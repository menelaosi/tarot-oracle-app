import type Anthropic from '@anthropic-ai/sdk';
import { Router } from 'express';
import { pool } from '../db/pool.js';
import {
  buildReferenceDigest,
  insertAstrologyReading,
  selectAspects,
  selectDignities,
  selectElements,
  selectExistingInterpretation,
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
} from '../db/queries/astrology.js';
import { anthropic, claudeModel } from '../lib/anthropic-client.js';
import { HttpError, toHttpError } from '../lib/http-error.js';

const router = Router();

const MAJOR_ASPECTS = new Set(['conjunction', 'sextile', 'trine', 'square', 'opposition']);

const round = (value: number, places = 2) => {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
};

const READING_RULES = [
  'You are an astrologer giving a natal chart reading directly to the person whose chart this is.',
  '',
  'Voice: address them as "you" and "your", never the third person. Warm and personal, like a conversation, not a clinical report.',
  '',
  'Grounding: read the chart using only the ASTROLOGY REFERENCE below. For each placement look up its body, sign, and house there; for each aspect look up its meaning. Do not add outside astrology knowledge or invent meanings, correspondences, or degrees. Weave the reference keywords and associations into ordinary sentences — never quote them as lists or write phrases like "the associations say".',
  '',
  'Structure: cover the Sun, Moon, and Ascendant first; then the remaining planets and points by sign and house; then the major aspects together as one section; then a short synthesis and a closing thought to them. Keep each placement to two or three sentences. Call out retrograde planets and any dignity (rulership, detriment, exaltation, fall) the reference lists for that body in that sign.',
  '',
  'Limits: no medical, legal, financial, or guaranteed predictive claims. Use Markdown headings and short paragraphs.',
].join('\n');

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

router.post('/interpret', async (request, response) => {
  if (!anthropic) {
    throw new HttpError(503, 'ANTHROPIC_API_KEY is not configured.');
  }

  const { chart } = request.body as { chart?: unknown };
  assertChartSummary(chart);
  const summaryJson = JSON.stringify(chart);

  try {
    // A birth chart is deterministic — if this exact one was analysed before,
    // return the stored reading instead of paying for another generation.
    const existing = await pool.query<{ interpretation: string }>(selectExistingInterpretation, [
      summaryJson,
    ]);
    if (existing.rows[0]) {
      response.json({ interpretation: existing.rows[0].interpretation, reused: true });
      return;
    }

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

    const referenceDigest = buildReferenceDigest({
      signs: signs.rows,
      planets: planets.rows,
      houses: houses.rows,
      aspects: aspects.rows,
      dignities: dignities.rows,
      modalities: modalities.rows,
      elements: elements.rows,
      notes: notes.rows,
    });

    const message = await anthropic.messages.create({
      model: claudeModel,
      max_tokens: 4000,
      // Stable prefix (rules + full reference) is cached; only the chart varies.
      system: [
        { type: 'text', text: READING_RULES },
        {
          type: 'text',
          text: referenceDigest,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: `CHART\n${JSON.stringify(toChartPayload(chart))}` }],
    });

    if (message.stop_reason === 'max_tokens') {
      console.warn('Claude astrology analysis reached the max token limit.');
    }
    console.info(
      'astrology interpret — cache write %d, cache read %d, input %d, output %d',
      message.usage.cache_creation_input_tokens ?? 0,
      message.usage.cache_read_input_tokens ?? 0,
      message.usage.input_tokens,
      message.usage.output_tokens,
    );

    const interpretation = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('\n');

    await pool.query(insertAstrologyReading, [
      chart.birth.dateTime,
      chart.birth.latitude,
      chart.birth.longitude,
      chart.birth.placeLabel || null,
      summaryJson,
      interpretation,
    ]);

    response.json({ interpretation });
  } catch (error) {
    throw toHttpError(error, 'Could not generate the analysis.');
  }
});

export default router;
