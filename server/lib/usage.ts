// Claude cost estimation and the daily spend cap. estimateCostUsd is pure (see
// usage.test.ts); recordUsage/assertUnderBudget are the two DB-touching calls
// lib/claude.ts wires into generateReading — the single chokepoint for every
// Claude call in the app.

import { insertUsage, selectRecentSpend, type SpendRow } from '../db/queries/usage.js';
import { loadRow, run } from './db.js';
import { serviceUnavailable } from './http-error.js';

type Pricing = { input: number; output: number; cacheWrite: number; cacheRead: number };

/**
 * The subset of Anthropic's `Usage` response shape this module prices on.
 * `Anthropic.Usage` (i.e. `message.usage` in lib/claude.ts) satisfies this
 * structurally, so the real SDK response passes straight through with no
 * cast; tests can build literals without the SDK type's other required
 * fields (cache_creation, service_tier, etc.), which are irrelevant to pricing.
 * Cache fields are nullable here — the SDK omits them when caching wasn't
 * used — normalizeUsage() is the one place that coalesces them to 0.
 */
export type RawTokenUsage = {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens: number | null;
  cache_read_input_tokens: number | null;
};

/** Same shape as RawTokenUsage, but cache fields are guaranteed real numbers. */
export type TokenUsage = {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens: number;
  cache_read_input_tokens: number;
};

/**
 * Coalesces the SDK's nullable cache fields to 0 once, at the one boundary
 * that needs to — every other function in this module, and every caller in
 * lib/claude.ts, works off the already-normalized TokenUsage and never
 * repeats the `?? 0`.
 */
export function normalizeUsage({
  input_tokens,
  output_tokens,
  cache_creation_input_tokens,
  cache_read_input_tokens,
}: RawTokenUsage): TokenUsage {
  return {
    input_tokens,
    output_tokens,
    cache_creation_input_tokens: cache_creation_input_tokens ?? 0,
    cache_read_input_tokens: cache_read_input_tokens ?? 0,
  };
}

const perMillion = (usd: number): number => usd / 1_000_000;

// 2026 rates (see the claude-api skill). $/token = $/MTok / 1,000,000.
const SONNET_5_PRICING: Pricing = {
  input: perMillion(2.0),
  output: perMillion(10.0),
  cacheWrite: perMillion(2.5),
  cacheRead: perMillion(0.2),
};

const HAIKU_4_5_PRICING: Pricing = {
  input: perMillion(1.0),
  output: perMillion(5.0),
  cacheWrite: perMillion(1.25),
  cacheRead: perMillion(0.1),
};

// Keyed by the exact CLAUDE_MODEL id (see lib/anthropic-client.ts).
const MODEL_PRICING: Record<string, Pricing> = {
  'claude-sonnet-5': SONNET_5_PRICING,
  'claude-haiku-4-5': HAIKU_4_5_PRICING,
};

// Any model id not listed above (a future or typo'd CLAUDE_MODEL value) falls
// back to Sonnet 5's rates — this app's actual default — rather than
// throwing, so an unrecognized model never breaks a reading.
export function pricingFor(model: string): Pricing {
  return MODEL_PRICING[model] ?? SONNET_5_PRICING;
}

/** Pure $ estimate for one Claude call. No I/O — see usage.test.ts. */
export function estimateCostUsd(
  { cacheRead, cacheWrite, input, output }: Pricing,
  { cache_creation_input_tokens, cache_read_input_tokens, input_tokens, output_tokens }: TokenUsage,
): number {
  return (
    input_tokens * input +
    output_tokens * output +
    cache_creation_input_tokens * cacheWrite +
    cache_read_input_tokens * cacheRead
  );
}

/** Logs one Claude call's actual usage and estimated cost. */
export async function recordUsage(label: string, model: string, usage: TokenUsage): Promise<void> {
  const cost = estimateCostUsd(pricingFor(model), usage);
  await run(insertUsage, [
    label,
    model,
    usage.input_tokens,
    usage.output_tokens,
    usage.cache_creation_input_tokens,
    usage.cache_read_input_tokens,
    cost.toFixed(6),
  ]);
}

/** Total estimated Claude spend in the trailing `interval` (e.g. '1 day'). */
export async function getRecentSpendUsd(interval: string): Promise<number> {
  const { total } = await loadRow<SpendRow>(
    selectRecentSpend,
    [interval],
    'Could not calculate recent spend.',
  );
  return Number(total);
}

const DEFAULT_DAILY_SPEND_CAP_USD = 5;

function dailySpendCapUsd(): number {
  const parsed = Number(process.env.DAILY_SPEND_CAP_USD);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_DAILY_SPEND_CAP_USD;
}

/**
 * Throws a friendly 503 once the trailing 24h of estimated Claude spend is at
 * or over DAILY_SPEND_CAP_USD (default $5). This is a best-effort, soft
 * guardrail with a small unavoidable race window under concurrent requests —
 * see the plan doc's race-condition note. Pair it with a hard spend limit set
 * on the Anthropic Console as the real backstop.
 */
export async function assertUnderBudget(): Promise<void> {
  const cap = dailySpendCapUsd();
  const spentToday = await getRecentSpendUsd('1 day');
  if (spentToday >= cap) {
    throw serviceUnavailable(
      'Daily usage cap for new readings hit for today. Please try again after it resets.',
    );
  }
}
