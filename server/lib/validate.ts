import { badRequest } from './http-error.js';

/**
 * A trimmed optional string field: absent or blank → null; present but not a
 * string → 400. Used for the `question` on every draw/roll route.
 */
export function optionalText(value: unknown, label: string = 'Value'): string | null {
  if (value == null) return null;
  if (typeof value !== 'string') throw badRequest(`${label} must be text.`);
  return value.trim() || null;
}

/**
 * A required, trimmed string field: absent, blank, or not a string → 400.
 * Reuses optionalText's own type/trim check rather than duplicating it.
 */
export function requireText(value: unknown, label: string = 'Value'): string {
  const text = optionalText(value, label);
  if (!text) throw badRequest(`${label} is required.`);
  return text;
}
