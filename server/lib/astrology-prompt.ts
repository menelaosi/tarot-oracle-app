// Turns a validated chart / transit summary into the Claude request: the rule
// list, the per-request user prompt (just the chart — small), and the cached
// reference digest that forms the byte-stable system prefix.

import { pool } from '../db/pool.js';
import {
  buildReferenceDigest,
  selectAspects,
  selectDignities,
  selectElements,
  selectHouses,
  selectModalities,
  selectPlanets,
  selectReferenceNotes,
  selectSigns,
  type AspectRow,
  type DignityRow,
  type HouseRow,
  type NoteRow,
  type PlanetRow,
  type SignGroupRow,
  type SignRow,
} from '../db/queries/astrology.js';
import type { AngleSummary, ChartSummary, TransitSummary } from './astrology-schema.js';
import { createSystemRules, generateReading } from './claude.js';

const MAJOR_ASPECTS = new Set(['conjunction', 'sextile', 'trine', 'square', 'opposition']);

/** True for the five Ptolemaic aspects; drops the minor ones the digest omits. */
const isMajorAspect = (a: { type: string }): boolean => MAJOR_ASPECTS.has(a.type);

const round = (value: number, places = 2) => {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
};

const MARKDOWN = 'Use Markdown headings and short paragraphs.';

const READING_RULES = [
  'You are an astrologer giving a natal chart reading directly to the person whose chart this is.',
  'Grounding: read the chart using only the ASTROLOGY REFERENCE below. For each placement look up its body, sign, and house there; for each aspect look up its meaning. Do not add outside astrology knowledge or invent meanings, correspondences, or degrees. Weave the reference keywords and associations into ordinary sentences — never quote them as lists or write phrases like "the associations say".',
  'Structure: cover the Sun, Moon, and Ascendant first; then the remaining planets and points by sign and house; then the major aspects together as one section; then a short synthesis and a closing thought to them. Keep each placement to two or three sentences. Call out retrograde planets and any dignity (rulership, detriment, exaltation, fall) the reference lists for that body in that sign.',
  MARKDOWN,
];

const TRANSIT_RULES = [
  'You are an astrologer telling this person what to expect on a specific day, based on how today is transiting planets contact their natal chart.',
  'This is a day-ahead briefing, not a life reading.',
  'Grounding: use only the ASTROLOGY REFERENCE below. For each transit, look up the transiting planet, the natal point it contacts, the aspect, and the natal house involved, and build the meaning from those. Do not invent correspondences or add outside astrology knowledge. Weave keywords into ordinary sentences rather than listing them.',
  'Structure: open with the single most significant transit and what it means for the day (the CONTACTS list is already ordered most-significant-first). Then cover the next two or three. Note whether each is applying (building, intensifying) or separating (fading). Keep the whole thing to two to four short paragraphs, then one line on the overall tone of the day.',
  'Scope: keep it to this day — near-term mood, energy, and what to lean into or watch for.',
  MARKDOWN,
];

// Reference tables are static seed data, so the digest is identical bytes every
// call — which is what lets the cached system prefix hit. Build it once per
// process; a reseed needs a server restart to be reflected.
let digestCache: string | null = null;

async function loadReferenceDigest(): Promise<string> {
  if (digestCache !== null) return digestCache;

  const [signs, planets, houses, aspects, dignities, modalities, elements, notes] =
    await Promise.all([
      pool.query<SignRow>(selectSigns),
      pool.query<PlanetRow>(selectPlanets),
      pool.query<HouseRow>(selectHouses),
      pool.query<AspectRow>(selectAspects),
      pool.query<DignityRow>(selectDignities),
      pool.query<SignGroupRow>(selectModalities),
      pool.query<SignGroupRow>(selectElements),
      pool.query<NoteRow>(selectReferenceNotes),
    ]);

  digestCache = buildReferenceDigest({
    signs: signs.rows,
    planets: planets.rows,
    houses: houses.rows,
    aspects: aspects.rows,
    dignities: dignities.rows,
    modalities: modalities.rows,
    elements: elements.rows,
    notes: notes.rows,
  });
  return digestCache;
}

/** The chart itself — the only part of the prompt that varies per request. */
function toChartPayload({
  angles: { ascendant, descendant, midheaven, imumCoeli },
  aspects,
  birth: { dateTime, placeLabel },
  placements,
}: ChartSummary) {
  const angle = ({ sign, degree }: AngleSummary) => ({ sign, degreeInSign: round(degree % 30) });
  return {
    birth: { dateTime, place: placeLabel || null },
    placements: placements.map(({ body, sign, house, degreeInSign, retrograde }) => ({
      body,
      sign,
      house,
      degreeInSign: round(degreeInSign),
      retrograde,
    })),
    angles: {
      ascendant: angle(ascendant),
      descendant: angle(descendant),
      midheaven: angle(midheaven),
      imumCoeli: angle(imumCoeli),
    },
    aspects: aspects
      .filter(isMajorAspect)
      .map(({ from, orb, to, type }) => ({ from, to, type, orb: round(orb, 1) })),
  };
}

/** The transit picture Claude reads — natal chart plus where today's sky lands on it. */
function toTransitPayload(
  natal: ChartSummary,
  { contacts, date, location: { label }, transitingPlacements }: TransitSummary,
) {
  const {
    birth: { placeLabel },
  } = natal;
  return {
    for: { date, place: label ?? (placeLabel || null) },
    natal: toChartPayload(natal),
    transiting: transitingPlacements.map(
      ({ body, sign, degreeInSign, retrograde, natalHouse }) => ({
        body,
        sign,
        degreeInSign: round(degreeInSign),
        retrograde,
        natalHouse,
      }),
    ),
    // Already ordered most-significant-first by the client.
    contacts: contacts.filter(isMajorAspect).map(({ applying, natal, orb, transiting, type }) => ({
      transiting,
      natal,
      type,
      orb: round(orb, 1),
      applying,
    })),
  };
}

export type ReadingRequest = { rules: string[]; prompt: string; label: string };

export function chartReadingRequest(chart: ChartSummary): ReadingRequest {
  return {
    rules: READING_RULES,
    prompt: `CHART\n${JSON.stringify(toChartPayload(chart))}`,
    label: 'birthchart',
  };
}

export function transitReadingRequest(
  natal: ChartSummary,
  transit: TransitSummary,
): ReadingRequest {
  return {
    rules: TRANSIT_RULES,
    prompt: `TODAY FOR THIS CHART\n${JSON.stringify(toTransitPayload(natal, transit))}`,
    label: 'transit',
  };
}

/** One grounded Claude call: rules + the cached reference digest, then the chart. */
export async function generateAstrologyReading({ rules, prompt, label }: ReadingRequest) {
  return generateReading(
    [
      { type: 'text' as const, text: createSystemRules(rules) },
      {
        type: 'text' as const,
        text: await loadReferenceDigest(),
        cache_control: { type: 'ephemeral' as const },
      },
    ],
    prompt,
    4000,
    `astrology ${label}`,
  );
}
