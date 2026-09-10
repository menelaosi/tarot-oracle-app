import { Router } from 'express';
import { pool } from '../db/pool.js';
import {
  insertAstrologyReading,
  insertTransitReading,
  selectExistingInterpretation,
  selectExistingTransitReading,
} from '../db/queries/astrology.js';
import {
  chartReadingRequest,
  generateAstrologyReading,
  transitReadingRequest,
  type ReadingRequest,
} from '../lib/astrology-prompt.js';
import { assertChartSummary, assertTransitSummary } from '../lib/astrology-schema.js';
import { run } from '../lib/db.js';
import { handler } from '../lib/route.js';

const router = Router();

/** The stored interpretation for a determinism key, or null if none. */
async function storedInterpretation(query: string, params: unknown[]): Promise<string | null> {
  const { rows } = await pool.query<{ interpretation: string }>(query, params);
  return rows[0]?.interpretation ?? null;
}

/**
 * Both routes are "return the stored reading for an identical input, else ask
 * Claude against the cached reference digest and persist the result". `reused`
 * is true when the stored copy was served.
 */
async function readingFor(opts: {
  findExisting: () => Promise<string | null>;
  request: ReadingRequest;
  persist: (interpretation: string) => Promise<void>;
}): Promise<{ interpretation: string; reused: boolean }> {
  const existing = await opts.findExisting();
  if (existing !== null) return { interpretation: existing, reused: true };

  const interpretation = await generateAstrologyReading(opts.request);
  await opts.persist(interpretation);
  return { interpretation, reused: false };
}

// POST /api/astrology/interpret — body { chart: ChartSummary }.
router.post(
  '/interpret',
  handler(async (request, response) => {
    const { chart } = request.body as { chart?: unknown };
    assertChartSummary(chart);
    const summaryJson = JSON.stringify(chart);

    const { dateTime, latitude, longitude, placeLabel } = chart.birth;

    const { interpretation, reused } = await readingFor({
      findExisting: () => storedInterpretation(selectExistingInterpretation, [summaryJson]),
      request: chartReadingRequest(chart),
      persist: (interpretation) =>
        run(insertAstrologyReading, [
          dateTime,
          latitude,
          longitude,
          placeLabel || null,
          summaryJson,
          interpretation,
        ]),
    });

    response.json(reused ? { interpretation, reused } : { interpretation });
  }, 'Could not generate the analysis.'),
);

// POST /api/astrology/transits — body { natal: ChartSummary, transit: TransitSummary }.
router.post(
  '/transits',
  handler(async (request, response) => {
    const { natal, transit } = request.body as { natal?: unknown; transit?: unknown };
    assertChartSummary(natal);
    assertTransitSummary(transit);
    const natalJson = JSON.stringify(natal);

    const { dateTime, latitude, longitude, placeLabel } = natal.birth;
    const { at, date, location } = transit;

    const { interpretation, reused } = await readingFor({
      findExisting: () => storedInterpretation(selectExistingTransitReading, [natalJson, date]),
      request: transitReadingRequest(natal, transit),
      persist: (interpretation) =>
        run(insertTransitReading, [
          dateTime,
          latitude,
          longitude,
          placeLabel || null,
          JSON.stringify(location),
          at,
          date,
          natalJson,
          JSON.stringify(transit),
          interpretation,
        ]),
    });

    response.json(reused ? { interpretation, reused } : { interpretation });
  }, 'Could not generate the analysis.'),
);

export default router;
