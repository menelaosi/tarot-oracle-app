// Astrology endpoints. The charts themselves are computed client-side; these are
// the only calls to our backend.
import { postJson } from '../../lib/http';
import type { ChartSummary } from './lib/chartSummary';
import type { TransitSummary } from './lib/transitSummary';

export function interpretChart(chart: ChartSummary): Promise<string> {
  return postJson<{ interpretation: string }>(
    '/api/astrology/interpret',
    { chart },
    'The analysis could not be generated.',
  ).then((payload) => payload.interpretation);
}

/** Ask Claude what a given day looks like for a natal chart, from the current transits. */
export function interpretTransits(natal: ChartSummary, transit: TransitSummary): Promise<string> {
  return postJson<{ interpretation: string }>(
    '/api/astrology/transits',
    { natal, transit },
    'The transit analysis could not be generated.',
  ).then((payload) => payload.interpretation);
}
