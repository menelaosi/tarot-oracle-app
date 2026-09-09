// Astrology endpoints. The charts themselves are computed client-side; these are
// the only calls to our backend.
import { getInterpretationResponse } from '../../lib/http';
import type { ChartSummary } from './lib/chartSummary';
import type { TransitSummary } from './lib/transitSummary';

const astrologyApi = '/api/astrology/';

export async function interpretChart(chart: ChartSummary): Promise<string> {
  return getInterpretationResponse(`${astrologyApi}interpret`, { chart });
}

/** Ask Claude what a given day looks like for a natal chart, from the current transits. */
export async function interpretTransits(natal: ChartSummary, transit: TransitSummary): Promise<string> {
  return getInterpretationResponse(`${astrologyApi}transits`, { natal, transit });
}
