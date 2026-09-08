// Astrology endpoints. The chart itself is computed client-side; this is the
// only call to our backend.
import { postJson } from '../../lib/http';
import type { ChartSummary } from './lib/chartSummary';

export function interpretChart(chart: ChartSummary): Promise<string> {
  return postJson<{ interpretation: string }>(
    '/api/astrology/interpret',
    { chart },
    'The analysis could not be generated.',
  ).then((payload) => payload.interpretation);
}
