// Cross-chart (transit -> natal) aspect maths. circular-natal-horoscope-js only
// finds aspects *within* one chart, so for "where does today's sky land on your
// birth chart" we compare the two sets of longitudes ourselves.
import type { Horoscope } from 'circular-natal-horoscope-js';
import { FULL_CIRCLE, getCelestialBody } from './horoscope';
import { Planet } from '../types';

/** Exact separation, in degrees, for each major aspect. */
export const MAJOR_ASPECT_ANGLES: Record<string, number> = {
  conjunction: 0,
  sextile: 60,
  square: 90,
  trine: 120,
  opposition: 180,
};

// Transit orbs are deliberately tighter than natal ones — a day reading should
// only surface transits that are actually live now, not every loose contact.
const TRANSIT_ORBS: Record<string, number> = {
  conjunction: 4,
  sextile: 2,
  square: 3,
  trine: 3,
  opposition: 4,
};

/** Widest orb (degrees) a transit of this type is reported within. */
export function transitAspectMaxOrb(type: string): number {
  return TRANSIT_ORBS[type] ?? 3;
}

// How much weight a transiting body carries: the slower it moves, the rarer and
// more defining the transit, so Pluto outranks the Moon by a wide margin.
const TRANSITING_WEIGHT: Record<string, number> = {
  pluto: 10,
  neptune: 9,
  uranus: 9,
  saturn: 8,
  jupiter: 6,
  chiron: 5,
  nnode: 5,
  mars: 4,
  sun: 4,
  venus: 3,
  mercury: 3,
  lilith: 3,
  moon: 2,
};

// A hit to a personal point (luminaries, the rising/MC axis) lands harder than
// one to an outer planet buried in the natal chart.
const NATAL_WEIGHT: Record<string, number> = {
  sun: 3,
  moon: 3,
  ascendant: 3,
  midheaven: 3,
  mercury: 2,
  venus: 2,
  mars: 2,
};

const ASPECT_WEIGHT: Record<string, number> = {
  conjunction: 3,
  opposition: 3,
  square: 3,
  trine: 2,
  sextile: 1.5,
};

export type TransitContact = {
  /** Planet key of the moving body (Planet value: 'mars', 'nnode', …). */
  transiting: string;
  /** Natal point it contacts: a Planet value, or 'ascendant' / 'midheaven'. */
  natal: string;
  type: string;
  /** Degrees from exact right now. */
  orb: number;
  /** true = tightening toward exact (intensifying), false = separating. */
  applying: boolean;
};

/** Smallest angle between two ecliptic longitudes, 0–180. */
function separation(a: number, b: number): number {
  const diff = Math.abs(a - b) % FULL_CIRCLE;
  return diff > FULL_CIRCLE / 2 ? FULL_CIRCLE - diff : diff;
}

function bodyLongitude(horoscope: Horoscope, planet: Planet): number | undefined {
  const value = getCelestialBody(horoscope, planet)?.ChartPosition?.Ecliptic?.DecimalDegrees;
  return typeof value === 'number' ? value : undefined;
}

/** Natal longitudes of every body plus the Ascendant/MC axis, keyed as the reading expects. */
function natalLongitudes(natal: Horoscope): Record<string, number> {
  const longitudes: Record<string, number> = {};
  for (const planet of Object.values(Planet)) {
    const longitude = bodyLongitude(natal, planet);
    if (longitude !== undefined) longitudes[planet] = longitude;
  }
  const ascendant = natal.Ascendant?.ChartPosition?.Ecliptic?.DecimalDegrees;
  if (typeof ascendant === 'number') longitudes.ascendant = ascendant;
  const midheaven = natal.Midheaven?.ChartPosition?.Ecliptic?.DecimalDegrees;
  if (typeof midheaven === 'number') longitudes.midheaven = midheaven;
  return longitudes;
}

/**
 * Every major aspect a transiting body currently makes to a natal point, within
 * the tight transit orbs. `transitNext` is the same sky one day later — comparing
 * the two orbs is how we tell an applying transit from a separating one.
 */
export function getTransitContacts(
  natal: Horoscope,
  transitNow: Horoscope,
  transitNext: Horoscope,
): TransitContact[] {
  const natalPoints = natalLongitudes(natal);
  const contacts: TransitContact[] = [];

  for (const planet of Object.values(Planet)) {
    const now = bodyLongitude(transitNow, planet);
    const next = bodyLongitude(transitNext, planet);
    if (now === undefined) continue;

    for (const [natalKey, natalLongitude] of Object.entries(natalPoints)) {
      // A body does not aspect its own natal position in a day reading.
      if (natalKey === planet) continue;

      for (const [type, exact] of Object.entries(MAJOR_ASPECT_ANGLES)) {
        const orb = Math.abs(separation(now, natalLongitude) - exact);
        if (orb > TRANSIT_ORBS[type]) continue;

        const orbNext =
          next === undefined ? orb : Math.abs(separation(next, natalLongitude) - exact);

        contacts.push({ transiting: planet, natal: natalKey, type, orb, applying: orbNext < orb });
      }
    }
  }

  return contacts;
}

/** Significance score — bigger is more worth leading the reading with. */
function score(contact: TransitContact): number {
  const transiting = TRANSITING_WEIGHT[contact.transiting] ?? 3;
  const natal = NATAL_WEIGHT[contact.natal] ?? 1;
  const aspect = ASPECT_WEIGHT[contact.type] ?? 1;
  const orbUsed = TRANSIT_ORBS[contact.type] ?? 3;
  const exactness = 1 + (1 - Math.min(contact.orb / orbUsed, 1));
  const momentum = contact.applying ? 1.15 : 1;
  return transiting * natal * aspect * exactness * momentum;
}

/** Contacts ordered most significant first, so the prompt and UI lead with them. */
export function rankTransitContacts(contacts: TransitContact[]): TransitContact[] {
  return [...contacts].sort((a, b) => score(b) - score(a));
}
