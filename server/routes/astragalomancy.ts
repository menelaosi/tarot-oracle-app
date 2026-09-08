import type Anthropic from '@anthropic-ai/sdk';
import { Router } from 'express';
import { pool } from '../db/pool.js';
import {
  insertAstragalomancyReading,
  selectAstragalomancyReading,
  selectHouseRef,
  selectPlanetRef,
  selectSignRef,
  selectStandardMeaning,
  updateAstragalomancyInterpretation,
  type AstragalomancyReadingRow,
  type HouseRefRow,
  type PlanetRefRow,
  type SignRefRow,
  type StandardMeaningRow,
} from '../db/queries/astragalomancy.js';
import { anthropic, claudeModel } from '../lib/anthropic-client.js';
import { HttpError, toHttpError } from '../lib/http-error.js';

const router = Router();

type Mode = 'standard' | 'zodiac';

// The 12 faces of each zodiac die. Planets are the ten classical bodies plus the
// two lunar nodes (Chiron / Lilith have no seeded keywords, so they're left off).
const PLANET_FACES = [
  'sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter',
  'saturn', 'uranus', 'neptune', 'pluto', 'nnode', 'snode',
];
const SIGN_FACES = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

const rollDie = (sides: number) => 1 + Math.floor(Math.random() * sides);

/** A uniformly random element of a non-empty list. */
function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)] as T;
}

/** Zodiac dice reading: planet = the situation, sign = the emotions, house = where it lands. */
const ZODIAC_RULES = [
  'You are giving an astragalomancy (dice divination) reading directly to the person who rolled.',
  'Three zodiac dice landed: a planet, a sign, and a house.',
  'Read the PLANET as the situation at hand, the SIGN as the emotions involved, and the HOUSE as the area of life where the impact is being felt.',
  'Ground each one only in its supplied keywords and associations — do not add outside astrology knowledge or invent meanings. Weave the keywords into ordinary sentences.',
  'Address them as "you" and "your". If they asked a question, answer it by reading the three dice together. If not, read the roll as guidance for them now.',
  'Keep it to a short few sentences or two or three short paragraphs. Plain text — no headings, no lists.',
  'No medical, legal, financial, or guaranteed predictive claims.',
].join(' ');

/** Standard dice reading: the sum points to one traditional meaning. */
const STANDARD_RULES = [
  'You are giving an astragalomancy (dice divination) reading directly to the person who rolled three standard six-sided dice.',
  'Their sum points to one traditional meaning, supplied below. Deliver that meaning to them, expanding it into a short, warm reading.',
  'Stay with the supplied meaning — do not invent additional omens or add outside divination lore.',
  'Address them as "you" and "your". Answer their question through the meaning if one was asked.',
  'Keep it to two or three sentences. Plain text — no headings.',
  'No medical, legal, financial, or guaranteed predictive claims.',
].join(' ');

function isMode(value: unknown): value is Mode {
  return value === 'standard' || value === 'zodiac';
}

async function resolveStandardMeaning(total: number): Promise<string> {
  const result = await pool.query<StandardMeaningRow>(selectStandardMeaning, [total]);
  return result.rows[0]?.meaning ?? '';
}

/** Loads the planet / sign / house reference rows for a zodiac roll. */
async function resolveZodiacRefs(planet: string, sign: string, house: number) {
  const [planetResult, signResult, houseResult] = await Promise.all([
    pool.query<PlanetRefRow>(selectPlanetRef, [planet]),
    pool.query<SignRefRow>(selectSignRef, [sign]),
    pool.query<HouseRefRow>(selectHouseRef, [house]),
  ]);
  const planetRow = planetResult.rows[0];
  const signRow = signResult.rows[0];
  const houseRow = houseResult.rows[0];
  if (!planetRow || !signRow || !houseRow) {
    throw new HttpError(500, 'The rolled dice could not be resolved.');
  }
  return {
    planet: { ...planetRow, keywords: planetRow.keywords ?? [], associations: planetRow.associations ?? [] },
    sign: { ...signRow, keywords: signRow.keywords ?? [], associations: signRow.associations ?? [] },
    house: { ...houseRow, keywords: houseRow.keywords ?? [], associations: houseRow.associations ?? [] },
  };
}

/** The client-facing roll object — a discriminated union on `mode`. */
async function toRollDto(row: Pick<AstragalomancyReadingRow, 'mode' | 'dice'>) {
  if (row.mode === 'standard') {
    const values = row.dice.values ?? [];
    const total = row.dice.total ?? values.reduce((sum, n) => sum + n, 0);
    return { mode: 'standard' as const, values, total, meaning: await resolveStandardMeaning(total) };
  }
  const refs = await resolveZodiacRefs(row.dice.planet ?? '', row.dice.sign ?? '', row.dice.house ?? 0);
  return { mode: 'zodiac' as const, ...refs };
}

// POST /api/astragalomancy/roll — body { mode?, question? }. Rolls the dice,
// stores the reading, and returns the resolved result for the client to animate.
router.post('/roll', async (request, response) => {
  const { mode: rawMode, question: rawQuestion } = request.body as {
    mode?: unknown;
    question?: unknown;
  };
  const mode: Mode = isMode(rawMode) ? rawMode : 'zodiac';
  if (rawQuestion !== undefined && typeof rawQuestion !== 'string') {
    throw new HttpError(400, 'Question must be text.');
  }

  const dice =
    mode === 'standard'
      ? (() => {
          const values = [rollDie(6), rollDie(6), rollDie(6)];
          return { values, total: values.reduce((sum, n) => sum + n, 0) };
        })()
      : { planet: pick(PLANET_FACES), sign: pick(SIGN_FACES), house: rollDie(12) };

  try {
    const readingResult = await pool.query<{ id: string; question: string | null }>(
      insertAstragalomancyReading,
      [rawQuestion?.trim() || null, mode, JSON.stringify(dice)],
    );
    const reading = readingResult.rows[0];
    if (!reading) throw new Error('The reading was not created.');

    response.status(201).json({
      id: reading.id,
      question: reading.question,
      roll: await toRollDto({ mode, dice }),
    });
  } catch (error) {
    throw toHttpError(error, 'Could not roll the dice.');
  }
});

// POST /api/astragalomancy/:readingId/interpret — re-resolve the roll and ask
// Claude to read it, grounded only in the supplied meaning / reference data.
router.post('/:readingId/interpret', async (request, response) => {
  if (!anthropic) {
    throw new HttpError(503, 'ANTHROPIC_API_KEY is not configured.');
  }

  try {
    const result = await pool.query<AstragalomancyReadingRow>(selectAstragalomancyReading, [
      request.params.readingId,
    ]);
    const reading = result.rows[0];
    if (!reading) {
      throw new HttpError(404, 'Reading not found.');
    }

    const roll = await toRollDto(reading);
    const isStandard = roll.mode === 'standard';

    const message = await anthropic.messages.create({
      model: claudeModel,
      max_tokens: 600,
      system: isStandard ? STANDARD_RULES : ZODIAC_RULES,
      messages: [
        {
          role: 'user',
          content: JSON.stringify(
            isStandard
              ? { question: reading.question, dice: roll.values, total: roll.total, meaning: roll.meaning }
              : {
                  question: reading.question,
                  situation: { planet: roll.planet.name, keywords: roll.planet.keywords, associations: roll.planet.associations },
                  emotions: { sign: roll.sign.name, keywords: roll.sign.keywords, associations: roll.sign.associations },
                  impact: { house: roll.house.name, keywords: roll.house.keywords, associations: roll.house.associations },
                },
          ),
        },
      ],
    });
    if (message.stop_reason === 'max_tokens') {
      console.warn('Claude astragalomancy interpretation reached the max token limit.');
    }

    const interpretation = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('\n');

    await pool.query(updateAstragalomancyInterpretation, [interpretation, request.params.readingId]);
    response.json({ interpretation });
  } catch (error) {
    throw toHttpError(error, 'Could not generate the interpretation.');
  }
});

export default router;
