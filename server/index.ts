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
const spreadDefinitions = {
  three_card: { label: 'Past / Present / Future', positions: ['Past', 'Present', 'Future'] },
  yes_no: { label: 'One-card Yes / No', positions: ['Answer'] },
  mind_body_soul: { label: 'Mind / Body / Soul', positions: ['Mind', 'Body', 'Soul'] },
} as const;
type SpreadType = keyof typeof spreadDefinitions;

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : new Pool({
      database: process.env.PGDATABASE ?? 'tarot_app',
      user: process.env.PGUSER ?? process.env.USER,
    });

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }));
app.use(express.json());

function isSupportedSpread(value: unknown): value is SpreadType {
  return typeof value === 'string' && value in spreadDefinitions;
}

function getSpreadInstructions(spreadType: SpreadType): string {
  switch (spreadType) {
    case 'yes_no':
      return [
        'This is a one-card Yes / No reading.',
        "Answer the querent's question directly with Yes, No, or Unclear.",
        "Follow the answer with a brief explanation grounded only in the card's supplied meaning, orientation, and correspondences.",
        'Do not treat the answer as a guaranteed prediction; frame it as the tendency or guidance shown by the card.',
        'Use the headings "Answer" and "Context".',
      ].join(' ');
    case 'mind_body_soul':
      return [
        'This is a three-card Mind / Body / Soul reading.',
        'Interpret Mind as how the querent is thinking, their mental perspective, and the beliefs or ideas shaping the situation.',
        'Interpret Body as how the querent is feeling in their embodied and emotional experience, without making medical claims.',
        "Interpret Soul as the querent's spiritual state, inner meaning, and connection to purpose or intuition.",
        'Clearly separate the Mind, Body, and Soul sections, then provide a synthesis connecting them.',
      ].join(' ');
    case 'three_card':
      return [
        'This is a three-card Past / Present / Future reading.',
        'Interpret Past as relevant background and patterns, Present as the current energy or situation, and Future as the likely direction or advice suggested by the cards.',
        'Clearly separate the Past, Present, and Future sections, then provide a synthesis connecting them.',
      ].join(' ');
  }
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
    includeReversals = false,
  } = request.body as {
    spreadType?: unknown;
    question?: unknown;
    includeReversals?: unknown;
  };

  if (!isSupportedSpread(spreadType)) {
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

    const definition = spreadDefinitions[spreadType];
    const cardsResult = await client.query<{ id: number; name: string; image_path: string }>(
      selectRandomCards,
      [definition.positions.length],
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
        positionLabel: definition.positions[card.position - 1],
      })),
      spreadLabel: definition.label,
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

    const firstRow = result.rows[0];
    const definition = firstRow ? spreadDefinitions[firstRow.spread_type] : null;
    if (!firstRow || !definition || result.rows.length !== definition.positions.length) {
      response.status(404).json({ error: 'Reading not found.' });
      return;
    }
    const spreadType = firstRow.spread_type;

    const databaseContext = result.rows.map((card) => ({
      position: definition.positions[card.position - 1],
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
      system: [
        'You are a tarot interpreter.',
        'Use only the supplied database context. Do not use general tarot knowledge or invent meanings, correspondences, or facts.',
        "Answer the querent's question when one is provided. If no question is provided, interpret the spread as general guidance.",
        'Use the supplied upright or reversed meaning that matches each card orientation.',
        'Treat correspondences as supporting context, not as permission to introduce outside tarot knowledge.',
        'Do not make medical, legal, financial, or guaranteed predictive claims.',
        'Use Markdown headings and paragraphs. Finish with a complete synthesis and final thought.',
        getSpreadInstructions(spreadType),
      ].join(' '),
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
