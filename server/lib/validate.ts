import type { QueryResultRow } from 'pg';
import { pool } from '../db/pool.js';
import { HttpError } from './http-error.js';

export function optionalText(value: unknown, label: string = 'Value'): string | null {
  if (value == null) return null;
  if (typeof value !== 'string') throw new HttpError(400, `${label} must be text.`);
  return value.trim() || null;
}

export async function loadRow<T extends QueryResultRow>(
  text: string,
  params: unknown[],
  notFound: string,
): Promise<T> {
  const [row] = await loadRows<T>(text, params, notFound);
  if (!row) throw new HttpError(404, notFound);
  return row;
};

export async function loadRows<T extends QueryResultRow>(
  text: string,
  params: unknown[],
  notFound: string,
): Promise<T[]> {
  const result = await pool.query<T>(text, params);
  if (!result.rows.length) throw new HttpError(404, notFound);
  return result.rows;
}
