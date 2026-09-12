// SQL for Claude usage/cost tracking (server/lib/usage.ts). One row per
// generateReading call; created_at is indexed for the rolling-window spend sum.

import { insertInto } from './fragments.js';

const USAGE = 'api_usage';
const COST = 'estimated_cost_usd';
const INPUT = 'input_tokens';

export const insertUsage = insertInto(USAGE, [
  'label',
  'model',
  INPUT,
  'output_tokens',
  `cache_creation_${INPUT}`,
  `cache_read_${INPUT}`,
  COST,
]);

/** Total estimated spend in the trailing `interval` (e.g. '1 day'); 0 with no usage yet. */
export const selectRecentSpend = `
  SELECT COALESCE(SUM(${COST}), 0) AS total
  FROM ${USAGE}
  WHERE created_at >= now() - $1::interval
`;

export type SpendRow = { total: string }; // node-postgres returns NUMERIC as a string
