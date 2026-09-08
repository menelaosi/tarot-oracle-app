import { Router } from 'express';
import { pool, rollback } from '../db/pool.js';
import { selectRandomCards, type DrawnCardRow } from '../db/queries/cards.js';
import {
  insertReading,
  insertReadingCard,
  selectDrawnCards,
  selectInterpretationCards,
  updateInterpretation,
  type InterpretationCardRow,
  type ReadingRow,
} from '../db/queries/readings.js';
import { createSystemRules, generateReading } from '../lib/claude.js';
import { HttpError } from '../lib/http-error.js';
import { handler } from '../lib/route.js';
import { optionalText } from '../lib/validate.js';
import { getSpreadInstructions, isSupportedSpread, spreads } from '../spreads.js';

const router = Router();

// POST /api/readings/draw — pick random cards for the spread and persist the
// reading + its cards in one transaction, so a partial draw is never stored.
router.post(
  '/draw',
  handler(async (request, response) => {
    const { spreadType = 'three_card', includeReversals = false } = request.body;
    const question = optionalText(request.body.question, 'Question');

    if (!isSupportedSpread(spreadType)) {
      throw new HttpError(400, 'Unsupported spread type.');
    }
    const definition = spreads[spreadType];

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const readingResult = await client.query<ReadingRow>(insertReading, [spreadType, question]);
      const reading = readingResult.rows[0];
      if (!reading) throw new Error('The reading was not created.');
      const { id } = reading;

      const cardsResult = await client.query<{ id: number; name: string; image_path: string }>(
        selectRandomCards,
        [definition.positions.length],
      );

      for (const [index, card] of cardsResult.rows.entries()) {
        await client.query(insertReadingCard, [
          id,
          card.id,
          index + 1,
          includeReversals && Math.random() < 0.25 ? 'reversed' : 'upright',
        ]);
      }

      const result = await client.query<DrawnCardRow>(selectDrawnCards, [id]);
      await client.query('COMMIT');
      client.release();

      response.status(201).json({
        id,
        spreadType,
        spreadLabel: definition.label,
        question: reading.question,
        cards: result.rows.map((card) => ({
          ...card,
          positionLabel: definition.positions[card.position - 1],
        })),
      });
    } catch (error) {
      await rollback(client);
      throw error;
    }
  }, 'Could not draw the cards.'),
);

// Flattens a joined card row into the object Claude is given. Picks the upright
// or reversed variant per the card's orientation; this is the only tarot context
// the model gets, so anything not here can't be used.
function toInterpretationContext(
  card: InterpretationCardRow,
  definition: { positions: readonly string[] },
) {
  const isUpright = card.orientation === 'upright';
  return {
    position: definition.positions[card.position - 1],
    card: card.name,
    orientation: card.orientation,
    meaning: isUpright ? card.meaning_upright : card.meaning_reversed,
    suit: card.suit,
    number: card.number,
    element: card.element,
    suitAssociations: [...(card.suit_positive ?? []), ...(card.suit_negative ?? [])],
    numerology: card.number_associations ?? [],
    courtRank: card.court_rank,
    courtDescription: card.court_description,
    courtAssociations: isUpright ? (card.court_positive ?? []) : (card.court_negative ?? []),
    majorArcanaElement: card.major_element,
    majorArcanaPlanets: card.major_planets ?? [],
    majorArcanaSigns: card.major_signs ?? [],
    majorArcanaAssociations: isUpright ? (card.major_positive ?? []) : (card.major_negative ?? []),
    majorArcanaRepresentations: card.representations ?? [],
  };
}

const READING_RULES = [
  'You are a tarot interpreter giving a reading directly to the person who drew these cards.',
  'Use only the supplied database context. Do not use general tarot knowledge or invent meanings, correspondences, or facts.',
  'Answer their question directly when one is provided. If no question is provided, interpret the spread as general guidance for them.',
  'Use the supplied upright or reversed meaning that matches each card orientation.',
  'Treat correspondences as supporting context, not as permission to introduce outside tarot knowledge.',
  'Use Markdown headings and paragraphs. Finish with a complete synthesis and final thought addressed to them.',
].join(' ');

// POST /api/readings/:readingId/interpret — load the reading's cards + stored
// correspondences, ask Claude to read them (second person, DB context only),
// then persist the interpretation on the reading.
router.post(
  '/:readingId/interpret',
  handler(async (request, response) => {
    const { readingId } = request.params;
    const result = await pool.query<InterpretationCardRow>(selectInterpretationCards, [readingId]);

    const firstRow = result.rows[0];
    const definition =
      firstRow && isSupportedSpread(firstRow.spread_type) ? spreads[firstRow.spread_type] : null;
    if (!firstRow || !definition || result.rows.length !== definition.positions.length) {
      throw new HttpError(404, 'Reading not found.');
    }

    const cards = result.rows.map((card) => toInterpretationContext(card, definition));
    const system = createSystemRules([...READING_RULES, ...getSpreadInstructions(definition)]);
    const interpretation = await generateReading({
      system,
      prompt: { question: firstRow.question, cards },
      maxTokens: 1400,
      label: 'tarot interpret',
    });

    await pool.query(updateInterpretation, [interpretation, readingId]);
    response.json({ interpretation });
  }, 'Could not generate the interpretation.'),
);

export default router;
