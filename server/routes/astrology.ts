import { Router } from 'express';
import { pool } from '../db/pool.js';
import {
  buildReferenceDigest,
  insertAstrologyReading,
  insertTransitReading,
  selectAspects,
  selectDignities,
  selectElements,
  selectExistingInterpretation,
  selectExistingTransitReading,
  selectHouses,
  selectModalities,
  selectPlanets,
  selectReferenceNotes,
  selectSigns,
  type AngleSummary,
  type AspectRow,
  type ChartSummary,
  type DignityRow,
  type ElementRow,
  type HouseRow,
  type ModalityRow,
  type NoteRow,
  type PlanetRow,
  type SignRow,
  type TransitContact,
  type TransitingPlacement,
  type TransitSummary,
} from '../db/queries/astrology.js';
import { createSystemRules, generateReading } from '../lib/claude.js';
import { run } from '../lib/db.js';
import { HttpError } from '../lib/http-error.js';
import { handler } from '../lib/route.js';

const router = Router();

const MAJOR_ASPECTS = new Set(['conjunction', 'sextile', 'trine', 'square', 'opposition']);

const round = (value: number, places = 2) => {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
};

const READING_RULES = [
  'You are an astrologer giving a natal chart reading directly to the person whose chart this is.',
  'Grounding: read the chart using only the ASTROLOGY REFERENCE below. For each placement look up its body, sign, and house there; for each aspect look up its meaning. Do not add outside astrology knowledge or invent meanings, correspondences, or degrees. Weave the reference keywords and associations into ordinary sentences — never quote them as lists or write phrases like "the associations say".',
  'Structure: cover the Sun, Moon, and Ascendant first; then the remaining planets and points by sign and house; then the major aspects together as one section; then a short synthesis and a closing thought to them. Keep each placement to two or three sentences. Call out retrograde planets and any dignity (rulership, detriment, exaltation, fall) the reference lists for that body in that sign.',
  'Use Markdown headings and short paragraphs.',
];

const TRANSIT_RULES = [
  'You are an astrologer telling this person what to expect on a specific day, based on how today is transiting planets contact their natal chart.',
  'This is a day-ahead briefing, not a life reading.',
  'Grounding: use only the ASTROLOGY REFERENCE below. For each transit, look up the transiting planet, the natal point it contacts, the aspect, and the natal house involved, and build the meaning from those. Do not invent correspondences or add outside astrology knowledge. Weave keywords into ordinary sentences rather than listing them.',
  'Structure: open with the single most significant transit and what it means for the day (the CONTACTS list is already ordered most-significant-first). Then cover the next two or three. Note whether each is applying (building, intensifying) or separating (fading). Keep the whole thing to two to four short paragraphs, then one line on the overall tone of the day.',
  'Scope: keep it to this day — near-term mood, energy, and what to lean into or watch for.',
  'Do not describe permanent traits or make guaranteed predictions. Use Markdown with short paragraphs; a heading is optional.',
];

/**
 * Loads the whole reference library and renders it as the compact digest that
 * goes in the cached system prefix. Shared by the natal and transit readings —
 * identical bytes each call, so the prompt cache actually hits.
 */
async function loadReferenceDigest(): Promise<string> {
  const [signs, planets, houses, aspects, dignities, modalities, elements, notes] =
    await Promise.all([
      pool.query<SignRow>(selectSigns),
      pool.query<PlanetRow>(selectPlanets),
      pool.query<HouseRow>(selectHouses),
      pool.query<AspectRow>(selectAspects),
      pool.query<DignityRow>(selectDignities),
      pool.query<ModalityRow>(selectModalities),
      pool.query<ElementRow>(selectElements),
      pool.query<NoteRow>(selectReferenceNotes),
    ]);

  return buildReferenceDigest({
    signs: signs.rows,
    planets: planets.rows,
    houses: houses.rows,
    aspects: aspects.rows,
    dignities: dignities.rows,
    modalities: modalities.rows,
    elements: elements.rows,
    notes: notes.rows,
  });
}

function isAngle(value: unknown): value is AngleSummary {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { sign?: unknown }).sign === 'string' &&
    typeof (value as { degree?: unknown }).degree === 'number'
  );
}

function assertChartSummary(value: unknown): asserts value is ChartSummary {
  const chart = value as Partial<ChartSummary> | null;
  const birth = chart?.birth as Partial<ChartSummary['birth']> | undefined;
  if (
    !chart ||
    !birth ||
    typeof birth.dateTime !== 'string' ||
    typeof birth.latitude !== 'number' ||
    typeof birth.longitude !== 'number' ||
    !Array.isArray(chart.placements) ||
    chart.placements.length === 0 ||
    !Array.isArray(chart.aspects) ||
    !chart.angles ||
    !isAngle(chart.angles.ascendant) ||
    !isAngle(chart.angles.midheaven) ||
    !isAngle(chart.angles.descendant) ||
    !isAngle(chart.angles.imumCoeli)
  ) {
    throw new HttpError(400, 'A valid chart summary is required.');
  }
}

/** The chart itself — the only part of the prompt that varies per request. */
function toChartPayload(chart: ChartSummary) {
  const angle = (a: AngleSummary) => ({ sign: a.sign, degreeInSign: round(a.degree % 30) });
  return {
    birth: { dateTime: chart.birth.dateTime, place: chart.birth.placeLabel || null },
    placements: chart.placements.map((p) => ({
      body: p.body,
      sign: p.sign,
      house: p.house,
      degreeInSign: round(p.degreeInSign),
      retrograde: p.retrograde,
    })),
    angles: {
      ascendant: angle(chart.angles.ascendant),
      descendant: angle(chart.angles.descendant),
      midheaven: angle(chart.angles.midheaven),
      imumCoeli: angle(chart.angles.imumCoeli),
    },
    aspects: chart.aspects
      .filter((a) => MAJOR_ASPECTS.has(a.type))
      .map((a) => ({ from: a.from, to: a.to, type: a.type, orb: round(a.orb, 1) })),
  };
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isTransitingPlacement(value: unknown): value is TransitingPlacement {
  const p = value as Partial<TransitingPlacement> | null;
  return (
    !!p &&
    typeof p.body === 'string' &&
    typeof p.sign === 'string' &&
    typeof p.degreeInSign === 'number' &&
    typeof p.retrograde === 'boolean' &&
    (p.natalHouse === null || typeof p.natalHouse === 'number')
  );
}

function isTransitContact(value: unknown): value is TransitContact {
  const c = value as Partial<TransitContact> | null;
  return (
    !!c &&
    typeof c.transiting === 'string' &&
    typeof c.natal === 'string' &&
    typeof c.type === 'string' &&
    typeof c.orb === 'number' &&
    typeof c.applying === 'boolean'
  );
}

function assertTransitSummary(value: unknown): asserts value is TransitSummary {
  const transit = value as Partial<TransitSummary> | null;
  if (
    !transit ||
    typeof transit.at !== 'string' ||
    typeof transit.date !== 'string' ||
    !DATE_RE.test(transit.date) ||
    !transit.location ||
    typeof transit.location.latitude !== 'number' ||
    typeof transit.location.longitude !== 'number' ||
    !Array.isArray(transit.transitingPlacements) ||
    transit.transitingPlacements.length === 0 ||
    !transit.transitingPlacements.every(isTransitingPlacement) ||
    !Array.isArray(transit.contacts) ||
    !transit.contacts.every(isTransitContact)
  ) {
    throw new HttpError(400, 'A valid transit summary is required.');
  }
}

/** The transit picture Claude reads — natal chart plus where today's sky lands on it. */
function toTransitPayload(natal: ChartSummary, transit: TransitSummary) {
  return {
    for: { date: transit.date, place: transit.location.label ?? (natal.birth.placeLabel || null) },
    natal: toChartPayload(natal),
    transiting: transit.transitingPlacements.map((p) => ({
      body: p.body,
      sign: p.sign,
      degreeInSign: round(p.degreeInSign),
      retrograde: p.retrograde,
      natalHouse: p.natalHouse,
    })),
    // Already ordered most-significant-first by the client.
    contacts: transit.contacts
      .filter((c) => MAJOR_ASPECTS.has(c.type))
      .map((c) => ({
        transiting: c.transiting,
        natal: c.natal,
        type: c.type,
        orb: round(c.orb, 1),
        applying: c.applying,
      })),
  };
}

async function astrologyGenerateReading(rules: string[], prompt: string, label: string) {
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

// POST /api/astrology/interpret — body { chart: ChartSummary }. Returns a stored
// reading for an identical chart, or asks Claude against the cached reference
// digest and persists the result.
router.post(
  '/interpret',
  handler(async (request, response) => {
    const { chart } = request.body as { chart?: unknown };
    assertChartSummary(chart);
    const summaryJson = JSON.stringify(chart);

    // A birth chart is deterministic — if this exact one was analysed before,
    // return the stored reading instead of paying for another generation.
    const existing = await pool.query<{ interpretation: string }>(selectExistingInterpretation, [
      summaryJson,
    ]);
    if (existing.rows[0]) {
      response.json({ interpretation: existing.rows[0].interpretation, reused: true });
      return;
    }

    const interpretation = await astrologyGenerateReading(
      READING_RULES,
      `CHART\n${JSON.stringify(toChartPayload(chart))}`,
      'birthchart',
    );

    await run(insertAstrologyReading, [
      chart.birth.dateTime,
      chart.birth.latitude,
      chart.birth.longitude,
      chart.birth.placeLabel || null,
      summaryJson,
      interpretation,
    ]);

    response.json({ interpretation });
  }, 'Could not generate the analysis.'),
);

// POST /api/astrology/transits — body { natal: ChartSummary, transit: TransitSummary }.
// Returns a stored reading for the same natal chart on the same calendar day, or
// asks Claude against the cached reference digest and persists the result.
router.post(
  '/transits',
  handler(async (request, response) => {
    const { natal, transit } = request.body as { natal?: unknown; transit?: unknown };
    assertChartSummary(natal);
    assertTransitSummary(transit);
    const natalJson = JSON.stringify(natal);

    // The natal chart is fixed and the transiting sky is fixed for a given day,
    // so an identical (chart, day) pair has a deterministic reading — reuse it.
    const existing = await pool.query<{ interpretation: string }>(selectExistingTransitReading, [
      natalJson,
      transit.date,
    ]);
    if (existing.rows[0]) {
      response.json({ interpretation: existing.rows[0].interpretation, reused: true });
      return;
    }

    const interpretation = await astrologyGenerateReading(
      TRANSIT_RULES,
      `TODAY FOR THIS CHART\n${JSON.stringify(toTransitPayload(natal, transit))}`,
      'transit',
    );

    await run(insertTransitReading, [
      natal.birth.dateTime,
      natal.birth.latitude,
      natal.birth.longitude,
      natal.birth.placeLabel || null,
      JSON.stringify(transit.location),
      transit.at,
      transit.date,
      natalJson,
      JSON.stringify(transit),
      interpretation,
    ]);

    response.json({ interpretation });
  }, 'Could not generate the analysis.'),
);

export default router;
