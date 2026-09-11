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
  type AstragalomancyRoll,
  type HouseRefRow,
  type PlanetRefRow,
  type RefRow,
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
] as const;

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
] as const;

const rollDie = (sides: number) => 1 + Math.floor(Math.random() * sides);

const sum = (values: number[]) => values.reduce((total, n) => total + n, 0);

/** A uniformly random element of a non-empty list. */
function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)] as T;
}

function getMode(value: unknown): Mode {
  return value === 'standard' || value === 'zodiac' ? value : 'zodiac';
}

function rollStandard(): AstragalomancyRoll {
  const values = [rollDie(6), rollDie(6), rollDie(6)];
  return {
    mode: 'standard',
    dice: { values, total: sum(values) },
  };
}

function rollZodiac(): AstragalomancyRoll {
  return {
    mode: 'zodiac',
    dice: {
      planet: pick(PLANET_FACES),
      sign: pick(SIGN_FACES),
      house: rollDie(12),
    },
  };
}

const DIRECTIVE =
  'You are giving an astragalomancy (dice divination) reading directly to the person who rolled';
const PLAIN_TEXT = 'Plain text — no headings, no lists.';
/** Zodiac dice reading: planet = the situation, sign = the emotions, house = where it lands. */
const ZODIAC_RULES = [
  `${DIRECTIVE}.`,
  'Three zodiac dice landed: a planet, a sign, and a house.',
  'Read the PLANET as the situation at hand, the SIGN as the emotions involved, and the HOUSE as the area of life where the impact is being felt.',
  'Ground each one only in its supplied keywords and associations — do not add outside astrology knowledge or invent meanings. Weave the keywords into ordinary sentences.',
  'If they asked a question, answer it by reading the three dice together. If not, read the roll as guidance for them now.',
  'Keep it to a short few sentences or two or three short paragraphs.',
  PLAIN_TEXT,
];

/** Standard dice reading: the sum points to one traditional meaning. */
const STANDARD_RULES = [
  `${DIRECTIVE} three standard six-sided dice.`,
  'Their sum points to one traditional meaning, supplied below. Deliver that meaning to them, expanding it into a short, warm reading.',
  'Stay with the supplied meaning — do not invent additional omens or add outside divination lore.',
  'Address them as "you" and "your". Answer their question through the meaning if one was asked.',
  'Keep it to two or three sentences.',
  PLAIN_TEXT,
];

// The rule lists never vary per request, so fold in the shared voice lines once.
const ZODIAC_SYSTEM = createSystemRules(ZODIAC_RULES);
const STANDARD_SYSTEM = createSystemRules(STANDARD_RULES);

async function resolveStandardMeaning(total: number): Promise<string> {
  const { meaning } = await loadRow<StandardMeaningRow>(
    selectStandardMeaning,
    [total],
    'Standard meaning not found.',
  );
  return meaning;
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
    planet: planetRow,
    sign: signRow,
    house: { ...houseRow, glyph: String(houseRow.number) },
  };
}

/** The client-facing roll object — a discriminated union on `mode`. */
async function toRollDto({ mode, dice }: AstragalomancyRoll) {
  if (mode === 'standard') {
    const values = dice.values ?? [];
    const total = dice.total ?? values.reduce((sum, value) => sum + value, 0);

    return {
      mode: 'standard' as const,
      values,
      total,
      meaning: await resolveStandardMeaning(total),
    };
  }

  const { planet = '', sign = '', house = 0 } = dice;
  const refs = await resolveZodiacRefs(planet, sign, house);

  return { mode: 'zodiac' as const, ...refs };
}

type Roll = Awaited<ReturnType<typeof toRollDto>>;

/** One grounded reference (planet / sign / house), keyed by its role in the prompt. */
const grounded = (role: string, ref: RefRow) => ({
  [role]: ref.name,
  keywords: ref.keywords,
  associations: ref.associations,
});

/** Shapes a resolved roll into the mode-specific prompt for Claude. */
function toRollPrompt(roll: Roll, question: string | null) {
  if (roll.mode === 'standard') {
    return { question, dice: roll.values, total: roll.total, meaning: roll.meaning };
  }
  return {
    question,
    situation: grounded('planet', roll.planet),
    emotions: grounded('sign', roll.sign),
    impact: grounded('house', roll.house),
  };
}

// POST /api/astragalomancy/roll — body { mode?, question? }. Rolls the dice,
// stores the reading, and returns the resolved result for the client to animate.
router.post(
  '/roll',
  handler(async ({ body }, response) => {
    const question = optionalText(body.question, 'Question');
    const mode = getMode(body.mode);
    const roll = mode === 'standard' ? rollStandard() : rollZodiac();

    const reading = await loadRow<Pick<AstragalomancyReadingRow, 'id' | 'question'>>(
      insertAstragalomancyReading,
      [question, mode, JSON.stringify(roll.dice)],
      'The reading was not created.',
    );

    response.status(201).json({
      id: reading.id,
      question: reading.question,
      roll: await toRollDto(roll),
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
    const interpretation = await generateReading(
      roll.mode === 'standard' ? STANDARD_SYSTEM : ZODIAC_SYSTEM,
      toRollPrompt(roll, reading.question),
      600,
      'astragalomancy',
    );

    await run(updateAstragalomancyInterpretation, [interpretation, readingId]);
    response.json({ interpretation });
  }, 'Could not generate the interpretation.'),
);

export default router;
