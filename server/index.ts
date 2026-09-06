import Anthropic from '@anthropic-ai/sdk';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { type Request, type Response } from 'express';
import { fileURLToPath } from 'node:url';
import { Pool, type PoolClient } from 'pg';
import {
  selectCardDetails,
  selectRandomCards,
  type CardDetailsRow,
  type DrawnCardRow,
} from './db/queries/cards.js';
import {
  insertReading,
  insertReadingCard,
  selectDrawnCards,
  selectInterpretationCards,
  updateInterpretation,
  type InterpretationCardRow,
  type ReadingRow,
} from './db/queries/readings.js';

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) });

const app = express();
const port = Number(process.env.PORT ?? 3001);
const positions = ['Past', 'Present', 'Future'] as const;

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : new Pool({
      database: process.env.PGDATABASE ?? 'tarot_app',
      user: process.env.PGUSER ?? process.env.USER,
    });

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }));
app.use(express.json());

function isThreeCardSpread(value: unknown): value is 'three_card' {
  return value === 'three_card';
}

async function rollback(client: PoolClient) {
  try {
    await client.query('ROLLBACK');
  } finally {
    client.release();
  }
}

app.get('/api/health', (_request, response) => {
  response.json({ ok: true });
});

app.get('/api/cards/:cardId', async (request: Request, response: Response) => {
  const cardId = Number(request.params.cardId);

  if (!Number.isInteger(cardId)) {
    response.status(400).json({ error: 'Card ID must be an integer.' });
    return;
  }

  try {
    const result = await pool.query<CardDetailsRow>(selectCardDetails, [cardId]);

    const card = result.rows[0];
    if (!card) {
      response.status(404).json({ error: 'Card not found.' });
      return;
    }

    response.json({
      id: card.id,
      name: card.name,
      arcana: card.arcana,
      suit: card.suit,
      number: card.number,
      meaningUpright: card.meaning_upright,
      meaningReversed: card.meaning_reversed,
      element: card.element,
      suitPositiveAssociations: card.suit_positive ?? [],
      suitNegativeAssociations: card.suit_negative ?? [],
      numerologyAssociations: card.numerology ?? [],
      courtRank: card.court_rank,
      courtDescription: card.court_description,
      courtPositiveAssociations: card.court_positive ?? [],
      courtNegativeAssociations: card.court_negative ?? [],
      majorElement: card.major_element,
      majorPlanets: card.major_planets ?? [],
      majorSigns: card.major_signs ?? [],
      majorPositiveAssociations: card.major_positive ?? [],
      majorNegativeAssociations: card.major_negative ?? [],
      majorRepresentations: card.major_representations ?? [],
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Could not load card details.' });
  }
});

app.post('/api/readings/draw', async (request: Request, response: Response) => {
  const {
    spreadType = 'three_card',
    question,
    includeReversals = true,
  } = request.body as {
    spreadType?: unknown;
    question?: unknown;
    includeReversals?: unknown;
  };

  if (!isThreeCardSpread(spreadType)) {
    response.status(400).json({ error: 'Unsupported spread type.' });
    return;
  }

  if (question !== undefined && typeof question !== 'string') {
    response.status(400).json({ error: 'Question must be text.' });
    return;
  }

  if (typeof includeReversals !== 'boolean') {
    response.status(400).json({ error: 'includeReversals must be boolean.' });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const readingResult = await client.query<ReadingRow>(insertReading, [
      spreadType,
      question?.trim() || null,
    ]);
    const reading = readingResult.rows[0];
    if (!reading) throw new Error('The reading was not created.');

    const cardsResult = await client.query<{ id: number; name: string; image_path: string }>(
      selectRandomCards,
    );

    for (const [index, card] of cardsResult.rows.entries()) {
      await client.query(insertReadingCard, [
        reading.id,
        card.id,
        index + 1,
        includeReversals && Math.random() < 0.5 ? 'reversed' : 'upright',
      ]);
    }

    const result = await client.query<DrawnCardRow>(selectDrawnCards, [reading.id]);
    await client.query('COMMIT');
    client.release();

    response.status(201).json({
      id: reading.id,
      spreadType,
      question: reading.question,
      cards: result.rows.map((card) => ({
        ...card,
        positionLabel: positions[card.position - 1],
      })),
    });
  } catch (error) {
    await rollback(client);
    console.error(error);
    response.status(500).json({ error: 'Could not draw the cards.' });
  }
});

app.post('/api/readings/:readingId/interpret', async (request: Request, response: Response) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    response.status(503).json({ error: 'ANTHROPIC_API_KEY is not configured.' });
    return;
  }

  try {
    const result = await pool.query<InterpretationCardRow>(selectInterpretationCards, [
      request.params.readingId,
    ]);

    if (result.rows.length !== 3) {
      response.status(404).json({ error: 'Reading not found.' });
      return;
    }

    const firstRow = result.rows[0];
    const databaseContext = result.rows.map((card) => ({
      position: positions[card.position - 1],
      card: card.name,
      orientation: card.orientation,
      meaning: card.orientation === 'upright' ? card.meaning_upright : card.meaning_reversed,
      suit: card.suit,
      number: card.number,
      element: card.element,
      suitAssociations: [...(card.suit_positive ?? []), ...(card.suit_negative ?? [])],
      numerology: card.number_associations ?? [],
      courtRank: card.court_rank,
      courtDescription: card.court_description,
      courtAssociations:
        card.orientation === 'upright' ? (card.court_positive ?? []) : (card.court_negative ?? []),
      majorArcanaElement: card.major_element,
      majorArcanaPlanets: card.major_planets ?? [],
      majorArcanaSigns: card.major_signs ?? [],
      majorArcanaAssociations:
        card.orientation === 'upright' ? (card.major_positive ?? []) : (card.major_negative ?? []),
      majorArcanaRepresentations: card.representations ?? [],
    }));

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL ?? 'claude-sonnet-5',
      max_tokens: 1400,
      system:
        'You are a tarot interpreter. Use only the supplied database context. Do not use general tarot knowledge or invent meanings, correspondences, or facts. Synthesize the supplied meanings into a grounded, reflective reading. Clearly distinguish the three positions. Do not claim certainty or predict guaranteed events. Finish the reading with a complete synthesis and final thought.',
      messages: [
        {
          role: 'user',
          content: JSON.stringify({ question: firstRow?.question ?? null, cards: databaseContext }),
        },
      ],
    });
    if (message.stop_reason === 'max_tokens') {
      console.warn('Claude interpretation reached the max token limit.');
    }
    const interpretation = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('\n');

    await pool.query(updateInterpretation, [interpretation, request.params.readingId]);
    response.json({ interpretation });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Could not generate the interpretation.' });
  }
});

app.listen(port, () => {
  console.log(`Tarot API listening on http://localhost:${port}`);
});
