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
import { createSystemRules, generateReading } from '../lib/claude.js';
import { loadRow, run } from '../lib/db.js';
import { HttpError } from '../lib/http-error.js';
import { handler } from '../lib/route.js';
import { optionalText } from '../lib/validate.js';

const router = Router();

type Mode = 'standard' | 'zodiac';

const PLANET_FACES = [
  'sun',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto',
  'nnode',
  'snode',
];
const SIGN_FACES = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces',
];

const rollDie = (sides: number) => 1 + Math.floor(Math.random() * sides);

/** A uniformly random element of a non-empty list. */
function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)] as T;
}

function isMode(value: unknown): value is Mode {
  return value === 'standard' || value === 'zodiac';
}

/** Zodiac dice reading: planet = the situation, sign = the emotions, house = where it lands. */
const ZODIAC_RULES = [
  'You are giving an astragalomancy (dice divination) reading directly to the person who rolled.',
  'Three zodiac dice landed: a planet, a sign, and a house.',
  'Read the PLANET as the situation at hand, the SIGN as the emotions involved, and the HOUSE as the area of life where the impact is being felt.',
  'Ground each one only in its supplied keywords and associations — do not add outside astrology knowledge or invent meanings. Weave the keywords into ordinary sentences.',
  'If they asked a question, answer it by reading the three dice together. If not, read the roll as guidance for them now.',
  'Keep it to a short few sentences or two or three short paragraphs. Plain text — no headings, no lists.',
];

/** Standard dice reading: the sum points to one traditional meaning. */
const STANDARD_RULES = [
  'You are giving an astragalomancy (dice divination) reading directly to the person who rolled three standard six-sided dice.',
  'Their sum points to one traditional meaning, supplied below. Deliver that meaning to them, expanding it into a short, warm reading.',
  'Stay with the supplied meaning — do not invent additional omens or add outside divination lore.',
  'Address them as "you" and "your". Answer their question through the meaning if one was asked.',
  'Keep it to two or three sentences. Plain text — no headings.',
];

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
    planet: {
      ...planetRow,
      keywords: planetRow.keywords ?? [],
      associations: planetRow.associations ?? [],
    },
    sign: {
      ...signRow,
      keywords: signRow.keywords ?? [],
      associations: signRow.associations ?? [],
    },
    house: {
      ...houseRow,
      keywords: houseRow.keywords ?? [],
      associations: houseRow.associations ?? [],
    },
  };
}

function getTotalViaReduce(values: number[]): number {
  return values.reduce((sum, n) => sum + n, 0);
}

/** The client-facing roll object — a discriminated union on `mode`. */
async function toRollDto(row: Pick<AstragalomancyReadingRow, 'mode' | 'dice'>) {
  if (row.mode === 'standard') {
    const values = row.dice.values ?? [];
    const total = row.dice.total ?? getTotalViaReduce(values);
    return {
      mode: 'standard' as const,
      values,
      total,
      meaning: await resolveStandardMeaning(total),
    };
  }
  const refs = await resolveZodiacRefs(
    row.dice.planet ?? '',
    row.dice.sign ?? '',
    row.dice.house ?? 0,
  );
  return { mode: 'zodiac' as const, ...refs };
}

// POST /api/astragalomancy/roll — body { mode?, question? }. Rolls the dice,
// stores the reading, and returns the resolved result for the client to animate.
router.post(
  '/roll',
  handler(async (request, response) => {
    const question = optionalText(request.body.question, 'Question');
    const mode: Mode = isMode(request.body.mode) ? request.body.mode : 'zodiac';

    const dice =
      mode === 'standard'
        ? (() => {
            const values = [rollDie(6), rollDie(6), rollDie(6)];
            return { values, total: getTotalViaReduce(values) };
          })()
        : { planet: pick(PLANET_FACES), sign: pick(SIGN_FACES), house: rollDie(12) };

    const reading = await loadRow<Pick<AstragalomancyReadingRow, 'id' | 'question'>>(
      insertAstragalomancyReading,
      [question, mode, JSON.stringify(dice)],
      'The reading was not created.',
    );

    response.status(201).json({
      id: reading.id,
      question: reading.question,
      roll: await toRollDto({ mode, dice }),
    });
  }, 'Could not roll the dice.'),
);

// POST /api/astragalomancy/:readingId/interpret — re-resolve the roll and ask
// Claude to read it, grounded only in the supplied meaning / reference data.
router.post(
  '/:readingId/interpret',
  handler(async (request, response) => {
    const { readingId } = request.params;
    const reading = await loadRow<AstragalomancyReadingRow>(
      selectAstragalomancyReading,
      [readingId],
      'Reading not found.',
    );

    const roll = await toRollDto(reading);
    const prompt =
      roll.mode === 'standard'
        ? {
            question: reading.question,
            dice: roll.values,
            total: roll.total,
            meaning: roll.meaning,
          }
        : {
            question: reading.question,
            situation: {
              planet: roll.planet.name,
              keywords: roll.planet.keywords,
              associations: roll.planet.associations,
            },
            emotions: {
              sign: roll.sign.name,
              keywords: roll.sign.keywords,
              associations: roll.sign.associations,
            },
            impact: {
              house: roll.house.name,
              keywords: roll.house.keywords,
              associations: roll.house.associations,
            },
          };

    const system = createSystemRules(roll.mode === 'standard' ? STANDARD_RULES : ZODIAC_RULES);
    const interpretation = await generateReading(system, prompt, 600, 'astragalomancy');

    await run(updateAstragalomancyInterpretation, [interpretation, readingId]);
    response.json({ interpretation });
  }, 'Could not generate the interpretation.'),
);

export default router;
