import { HttpError } from './http-error.js';

/**
 * A trimmed optional string field: absent or blank → null; present but not a
 * string → 400. Used for the `question` on every draw/roll route.
 */
export function optionalText(value: unknown, label: string = 'Value'): string | null {
  if (value == null) return null;
  if (typeof value !== 'string') throw new HttpError(400, `${label} must be text.`);
  return value.trim() || null;
}
