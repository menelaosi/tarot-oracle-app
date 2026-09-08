import type Anthropic from '@anthropic-ai/sdk';
import { Router } from 'express';
import { pool } from '../db/pool.js';
import {
  insertGreekReading,
  selectGreekReading,
  selectRandomLetter,
  updateGreekInterpretation,
  type GreekLetterRow,
  type GreekReadingRow,
} from '../db/queries/greekOracle.js';
import { anthropic, claudeModel } from '../lib/anthropic-client.js';
import { HttpError, toHttpError } from '../lib/http-error.js';

const router = Router();

/** Shapes a letter row into the client DTO (arrays normalised, no snake_case). */
function toLetterDto(row: GreekLetterRow) {
  return {
    letter: row.letter,
    name: row.name,
    position: row.position,
    oracle: row.oracle,
    meaning: row.meaning,
    keywords: row.keywords ?? [],
  };
}

// POST /api/greek-oracle/draw — body { question? }. Draws one letter and stores
// the reading, mirroring the tarot /draw step.
router.post('/draw', async (request, response) => {
  const { question: rawQuestion } = request.body as { question?: unknown };
  if (rawQuestion !== undefined && typeof rawQuestion !== 'string') {
    throw new HttpError(400, 'Question must be text.');
  }

  try {
    const letterResult = await pool.query<GreekLetterRow>(selectRandomLetter);
    const letter = letterResult.rows[0];
    if (!letter) throw new Error('No oracle letters are seeded.');

    const readingResult = await pool.query<{ id: string; question: string | null }>(
      insertGreekReading,
      [rawQuestion?.trim() || null, letter.letter],
    );
    const reading = readingResult.rows[0];
    if (!reading) throw new Error('The reading was not created.');

    response.status(201).json({
      id: reading.id,
      question: reading.question,
      letter: toLetterDto(letter),
    });
  } catch (error) {
    throw toHttpError(error, 'Could not draw a letter.');
  }
});

const READING_RULES = [
  'You are delivering a Greek Alphabet Oracle reading directly to the person who drew this letter.',
  'Address them as "you" and "your"; never the third person. Warm, plain, and encouraging.',
  'Ground everything in the supplied oracle line, meaning, and keywords only. Do not add outside divination lore, Greek mythology, or invented correspondences.',
  'If they asked a question, answer it directly through the letter. If not, read the letter as general guidance for them now.',
  'Keep it to a short few sentences (2 to 4). Plain text — no headings, no lists.',
  'No medical, legal, financial, or guaranteed predictive claims.',
].join(' ');

// POST /api/greek-oracle/:readingId/interpret — load the reading + its letter,
// ask Claude for a few sentences grounded only in that letter's text, persist it.
router.post('/:readingId/interpret', async (request, response) => {
  if (!anthropic) {
    throw new HttpError(503, 'ANTHROPIC_API_KEY is not configured.');
  }

  try {
    const result = await pool.query<GreekReadingRow>(selectGreekReading, [
      request.params.readingId,
    ]);
    const reading = result.rows[0];
    if (!reading) {
      throw new HttpError(404, 'Reading not found.');
    }

    const message = await anthropic.messages.create({
      model: claudeModel,
      max_tokens: 500,
      system: READING_RULES,
      messages: [
        {
          role: 'user',
          content: JSON.stringify({
            question: reading.question,
            letter: reading.letter,
            name: reading.name,
            oracle: reading.oracle,
            meaning: reading.meaning,
            keywords: reading.keywords ?? [],
          }),
        },
      ],
    });
    if (message.stop_reason === 'max_tokens') {
      console.warn('Claude Greek oracle interpretation reached the max token limit.');
    }

    const interpretation = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('\n');

    await pool.query(updateGreekInterpretation, [interpretation, request.params.readingId]);
    response.json({ interpretation });
  } catch (error) {
    throw toHttpError(error, 'Could not generate the interpretation.');
  }
});

export default router;
