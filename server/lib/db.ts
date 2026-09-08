import type { QueryResultRow } from 'pg';
import { pool } from '../db/pool.js';
import { HttpError } from './http-error.js';

/**
 * Data-access helpers so routes never touch `pool` directly — one place to add
 * query logging, timing, or retries later. Reads that legitimately return zero
 * rows (e.g. astrology's "already generated?" check) still use `pool.query`.
 */

/** Runs a write, or any query whose result the caller doesn't need. */
export async function run(text: string, params: unknown[] = []): Promise<void> {
  await pool.query(text, params);
}

/** Runs a query and 404s (with `notFound`) when it returns no rows. */
export async function loadRows<T extends QueryResultRow>(
  text: string,
  params: unknown[],
  notFound: string,
): Promise<T[]> {
  const result = await pool.query<T>(text, params);
  if (!result.rows.length) throw new HttpError(404, notFound);
  return result.rows;
}

/** Like `loadRows`, but returns just the first row. 404s when there are none. */
export async function loadRow<T extends QueryResultRow>(
  text: string,
  params: unknown[],
  notFound: string,
): Promise<T> {
  const [row] = await loadRows<T>(text, params, notFound);
  if (!row) throw new HttpError(404, notFound);
  return row;
}
