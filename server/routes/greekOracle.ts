import { Router } from 'express';
import {
  insertGreekReading,
  selectGreekReading,
  selectRandomLetter,
  updateGreekInterpretation,
  type GreekLetterRow,
  type GreekReadingRow,
} from '../db/queries/greekOracle.js';
import { createSystemRules, generateReading } from '../lib/claude.js';
import { loadRow, run } from '../lib/db.js';
import { handler } from '../lib/route.js';
import { optionalText } from '../lib/validate.js';

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
router.post(
  '/draw',
  handler(async (request, response) => {
    const rawQuestion = optionalText(request.body.question, 'Question');

    const letter = await loadRow<GreekLetterRow>(
      selectRandomLetter,
      [],
      'No oracle letters are seeded.',
    );
    const { id, question } = await loadRow<GreekReadingRow>(
      insertGreekReading,
      [rawQuestion, letter.letter],
      'The reading was not created',
    );

    response.status(201).json({
      id,
      question,
      letter: toLetterDto(letter),
    });
  }, 'Could not draw a letter.'),
);

// POST /api/greek-oracle/:readingId/interpret — load the reading + its letter,
// ask Claude for a few sentences grounded only in that letter's text, persist it.
router.post(
  '/:readingId/interpret',
  handler(async (request, response) => {
    const { readingId } = request.params;
    const { question, letter, name, oracle, meaning, keywords } = await loadRow<GreekReadingRow>(
      selectGreekReading,
      [readingId],
      'Reading not found',
    );

    const interpretation = await generateReading(
      createSystemRules([
        'You are delivering a Greek Alphabet Oracle reading directly to the person who drew this letter.',
        'Ground everything in the supplied oracle line, meaning, and keywords only. Do not add outside divination lore, Greek mythology, or invented correspondences.',
        'If they asked a question, answer it directly through the letter. If not, read the letter as general guidance for them now.',
        'Keep it to a short few sentences (2 to 4). Plain text — no headings, no lists.',
      ]),
      {
        question,
        letter,
        name,
        oracle,
        meaning,
        keywords,
      },
      500,
      'greek-oracle',
    );

    await run(updateGreekInterpretation, [interpretation, readingId]);
    response.json({ interpretation });
  }, 'Could not generate the interpretation.'),
);

export default router;
