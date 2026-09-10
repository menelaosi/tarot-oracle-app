import type { Horoscope } from 'circular-natal-horoscope-js';
import { Planet } from '../types';
import type { Place } from './geocode';
import { FULL_CIRCLE, getCelestialBody, getSign } from './horoscope';
import { getTransitContacts, rankTransitContacts, type TransitContact } from './transits';

/** Where and when the transiting chart is anchored. */
export type TransitFrame = {
  /** ISO instant the transit chart is cast for. */
  at: string;
  /** Calendar day (YYYY-MM-DD) the reading is for. */
  date: string;
  /** Birthplace, or the browser's current location when the user opts in. */
  location: Place;
};

export type TransitingPlacement = {
  body: Planet;
  sign: string;
  degreeInSign: number;
  retrograde: boolean;
  /** Natal house the transiting body is currently passing through. */
  natalHouse: number | null;
};

export type TransitSummary = TransitFrame & {
  transitingPlacements: TransitingPlacement[];
  /** Ranked most-significant-first. */
  contacts: TransitContact[];
};

/** Which natal house (whole-sign, so 30° wide) a longitude falls in. */
function natalHouseOf(natal: Horoscope, longitude: number): number | null {
  const houses = natal?.Houses;
  if (!Array.isArray(houses)) return null;
  for (let i = 0; i < houses.length; i += 1) {
    const start = houses[i]?.ChartPosition?.StartPosition?.Ecliptic?.DecimalDegrees;
    if (typeof start !== 'number') continue;
    const offset = (((longitude - start) % FULL_CIRCLE) + FULL_CIRCLE) % FULL_CIRCLE;
    if (offset < 30) return houses[i]?.id ?? i + 1;
  }
  return null;
}

/**
 * Flattens the natal chart + today's sky (and tomorrow's, for applying/separating)
 * into the payload `/api/astrology/transits` enriches with reference data.
 */
export function buildTransitSummary(
  natal: Horoscope,
  transitNow: Horoscope,
  transitNext: Horoscope,
  frame: TransitFrame,
): TransitSummary {
  const transitingPlacements: TransitingPlacement[] = [];
  for (const body of Object.values(Planet)) {
    const raw = getCelestialBody(transitNow, body);
    const degree = raw?.ChartPosition?.Ecliptic?.DecimalDegrees;
    if (typeof degree !== 'number') continue;
    transitingPlacements.push({
      body,
      sign: raw?.Sign?.key ?? getSign(degree).toLowerCase(),
      degreeInSign: degree % 30,
      retrograde: Boolean(raw?.isRetrograde),
      natalHouse: natalHouseOf(natal, degree),
    });
  }

  const contacts = rankTransitContacts(getTransitContacts(natal, transitNow, transitNext));

  return { ...frame, transitingPlacements, contacts };
}
