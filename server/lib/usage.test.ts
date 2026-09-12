import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpError } from './http-error.js';

const query = vi.fn();
vi.mock('../db/pool.js', () => ({ pool: { query } }));

const { assertUnderBudget, estimateCostUsd, getRecentSpendUsd, normalizeUsage, pricingFor } =
  await import('./usage.js');

beforeEach(() => {
  query.mockReset();
  delete process.env.DAILY_SPEND_CAP_USD;
});

describe('normalizeUsage', () => {
  it('coalesces null cache fields to 0', () => {
    expect(
      normalizeUsage({
        input_tokens: 1000,
        output_tokens: 500,
        cache_creation_input_tokens: null,
        cache_read_input_tokens: null,
      }),
    ).toEqual({
      input_tokens: 1000,
      output_tokens: 500,
      cache_creation_input_tokens: 0,
      cache_read_input_tokens: 0,
    });
  });

  it('passes real cache token counts through unchanged', () => {
    expect(
      normalizeUsage({
        input_tokens: 1000,
        output_tokens: 500,
        cache_creation_input_tokens: 200,
        cache_read_input_tokens: 300,
      }),
    ).toEqual({
      input_tokens: 1000,
      output_tokens: 500,
      cache_creation_input_tokens: 200,
      cache_read_input_tokens: 300,
    });
  });
});

describe('pricingFor', () => {
  it('falls back to Sonnet 5 rates for an unrecognized model', () => {
    expect(pricingFor('some-future-model-id')).toEqual(pricingFor('claude-sonnet-5'));
  });

  it('prices Haiku 4.5 cheaper than Sonnet 5', () => {
    const haiku = pricingFor('claude-haiku-4-5');
    const sonnet = pricingFor('claude-sonnet-5');
    expect(haiku.input).toBeLessThan(sonnet.input);
    expect(haiku.output).toBeLessThan(sonnet.output);
  });
});

describe('estimateCostUsd', () => {
  it('prices a Sonnet 5 call from input/output/cache-write/cache-read tokens', () => {
    const usage = normalizeUsage({
      input_tokens: 1_000_000,
      output_tokens: 1_000_000,
      cache_creation_input_tokens: 1_000_000,
      cache_read_input_tokens: 1_000_000,
    });
    const cost = estimateCostUsd(pricingFor('claude-sonnet-5'), usage);
    expect(cost).toBeCloseTo(2 + 10 + 2.5 + 0.2, 6);
  });

  it('is 0 for a normalized all-zero call', () => {
    const usage = normalizeUsage({
      input_tokens: 0,
      output_tokens: 0,
      cache_creation_input_tokens: null,
      cache_read_input_tokens: null,
    });
    expect(estimateCostUsd(pricingFor('claude-sonnet-5'), usage)).toBe(0);
  });

  it('prices a Haiku 4.5 call at its own, cheaper rates', () => {
    const usage = normalizeUsage({
      input_tokens: 1_000_000,
      output_tokens: 1_000_000,
      cache_creation_input_tokens: 0,
      cache_read_input_tokens: 0,
    });
    expect(estimateCostUsd(pricingFor('claude-haiku-4-5'), usage)).toBeCloseTo(1 + 5, 6);
  });
});

describe('getRecentSpendUsd', () => {
  it('parses the NUMERIC-as-string total into a number', async () => {
    query.mockResolvedValueOnce({ rows: [{ total: '3.140000' }] });
    await expect(getRecentSpendUsd('1 day')).resolves.toBe(3.14);
    expect(query).toHaveBeenCalledWith(expect.stringContaining('$1::interval'), ['1 day']);
  });

  it('is 0 when there is no usage yet (COALESCE floor)', async () => {
    query.mockResolvedValueOnce({ rows: [{ total: '0' }] });
    await expect(getRecentSpendUsd('1 day')).resolves.toBe(0);
  });
});

describe('assertUnderBudget', () => {
  it('resolves when spend is under the cap', async () => {
    process.env.DAILY_SPEND_CAP_USD = '5';
    query.mockResolvedValueOnce({ rows: [{ total: '4.99' }] });
    await expect(assertUnderBudget()).resolves.toBeUndefined();
  });

  it('rejects with a 503 HttpError when spend is exactly at the cap', async () => {
    process.env.DAILY_SPEND_CAP_USD = '5';
    query.mockResolvedValueOnce({ rows: [{ total: '5.00' }] });
    await expect(assertUnderBudget()).rejects.toBeInstanceOf(HttpError);
    query.mockResolvedValueOnce({ rows: [{ total: '5.00' }] });
    await expect(assertUnderBudget()).rejects.toMatchObject({ status: 503 });
  });

  it('rejects when spend is over the cap', async () => {
    process.env.DAILY_SPEND_CAP_USD = '5';
    query.mockResolvedValueOnce({ rows: [{ total: '5.01' }] });
    await expect(assertUnderBudget()).rejects.toMatchObject({ status: 503 });
  });

  it('falls back to the $5 default when DAILY_SPEND_CAP_USD is unset', async () => {
    query.mockResolvedValueOnce({ rows: [{ total: '4' }] });
    await expect(assertUnderBudget()).resolves.toBeUndefined();
  });

  it('falls back to the $5 default when DAILY_SPEND_CAP_USD is not a valid number', async () => {
    process.env.DAILY_SPEND_CAP_USD = 'not-a-number';
    query.mockResolvedValueOnce({ rows: [{ total: '4' }] });
    await expect(assertUnderBudget()).resolves.toBeUndefined();

    process.env.DAILY_SPEND_CAP_USD = 'not-a-number';
    query.mockResolvedValueOnce({ rows: [{ total: '5.01' }] });
    await expect(assertUnderBudget()).rejects.toMatchObject({ status: 503 });
  });
});
