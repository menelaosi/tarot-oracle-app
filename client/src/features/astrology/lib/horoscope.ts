// Wraps circular-natal-horoscope-js and holds the geometry + drawing constants
// the SVG chart uses. Angles are wheel degrees (0° left, counter-clockwise);
// convertShiftInDegrees turns them into the radians getPointPosition needs.
import { Horoscope, Origin } from 'circular-natal-horoscope-js';
import {
  Dignity,
  Planet,
  zodiacFromNumber,
  type LocatedPoint,
  type Point,
  type ZodiacSign,
} from '../types';
import type { Place } from './geocode';

const CUSTOM_ORBS = {
  conjunction: 8,
  opposition: 8,
  trine: 8,
  square: 7,
  sextile: 6,
  quincunx: 5,
  quintile: 1,
  septile: 1,
  'semi-square': 1,
  'semi-sextile': 1,
};

type CelestialBody = {
  ChartPosition?: { Ecliptic?: { DecimalDegrees?: number } };
};

export function getHoroscope(date: Date, place: Place): Horoscope {
  const { latitude, longitude } = place;
  const origin = new Origin({
    year: date.getFullYear(),
    month: date.getMonth(), // 0-indexed, which is what the library expects
    date: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    latitude,
    longitude,
  });

  return new Horoscope({
    origin,
    houseSystem: 'whole-sign',
    zodiac: 'tropical',
    aspectTypes: ['major', 'minor'],
    customOrbs: CUSTOM_ORBS,
    language: 'en',
  });
}

// circular-natal-horoscope-js splits its results: the Sun through Pluto plus
// Chiron live in CelestialBodies, while the lunar node and Lilith are in
// CelestialPoints under their own key names.
const CELESTIAL_POINT_KEY: Partial<Record<Planet, string>> = {
  [Planet.NorthNode]: 'northnode',
};

/** The raw library object for a planet/point, from whichever collection holds it. */
export function getCelestialBody(horoscope: Horoscope, planet: Planet) {
  return (
    horoscope?.CelestialBodies?.[planet] ??
    horoscope?.CelestialPoints?.[CELESTIAL_POINT_KEY[planet] ?? planet]
  );
}

export const WHITE = '#ffffff'; // BACKGROUND_RULER
export const DARK_GRAY = '#333333'; // LINE_COLOR AND CIRCLE_COLOR AND SYMBOL_AXIS_FONT_COLOR
export const LIGHT_GRAY = '#d8dae6'; // marks in the margin, outside the white wheel, on the dark page
export const BLACK = '#000000'; // SIGNS_COLOR AND POINTS_COLOR AND CUSPS_FONT_COLOR
export const POINTS_TEXT_SIZE = 8;
export const POINTS_STROKE = '1.8';
export const SIGNS_STROKE = '1.5';
export const MARGIN = 50;
export const PADDING = 18;
export const INDOOR_CIRCLE_RADIUS_RATIO = 2;
export const INNER_CIRCLE_RADIUS_RATIO = 8;
export const RULER_RADIUS = 4;
export const SYMBOL_AXIS_STROKE = 1.6;
export const CUSPS_STROKE = 1;
export const COLLISION_RADIUS = 10;
export const FULL_CIRCLE = 360;

const SHIFT_IN_DEGREES = 180;

const DIGNITIES_EXACT_EXALTATIONS_DEFAULT: { name: Planet; position: number; orbit: number }[] = [
  { name: Planet.Sun, position: 19, orbit: 2 },
  { name: Planet.Moon, position: 33, orbit: 2 },
  { name: Planet.Mercury, position: 33, orbit: 2 },
  { name: Planet.Venus, position: 357, orbit: 2 },
  { name: Planet.Mars, position: 298, orbit: 2 },
  { name: Planet.Jupiter, position: 105, orbit: 2 },
  { name: Planet.Saturn, position: 201, orbit: 2 },
  { name: Planet.NorthNode, position: 63, orbit: 2 },
];

export function getSign(angle: number): ZodiacSign {
  const normalized = ((angle % FULL_CIRCLE) + FULL_CIRCLE) % FULL_CIRCLE;
  return zodiacFromNumber(Math.floor(normalized / 30) + 1);
}

const planetDignities: Record<Planet, Partial<Record<ZodiacSign, Dignity>>> = {
  [Planet.Sun]: {
    Leo: Dignity.Rulership,
    Aquarius: Dignity.Detriment,
    Aries: Dignity.Exaltation,
    Virgo: Dignity.Fall,
  },
  [Planet.Moon]: {
    Cancer: Dignity.Rulership,
    Capricorn: Dignity.Detriment,
    Taurus: Dignity.Exaltation,
    Scorpio: Dignity.Fall,
  },
  [Planet.Mercury]: {
    Gemini: Dignity.Rulership,
    Sagittarius: Dignity.Detriment,
    Virgo: Dignity.Exaltation,
    Pisces: Dignity.Fall,
  },
  [Planet.Venus]: {
    Taurus: Dignity.Rulership,
    Libra: Dignity.Rulership,
    Aries: Dignity.Detriment,
    Scorpio: Dignity.Detriment,
    Pisces: Dignity.Exaltation,
    Virgo: Dignity.Fall,
  },
  [Planet.Mars]: {
    Aries: Dignity.Rulership,
    Scorpio: Dignity.Rulership,
    Taurus: Dignity.Detriment,
    Libra: Dignity.Detriment,
    Capricorn: Dignity.Exaltation,
    Cancer: Dignity.Fall,
  },
  [Planet.Jupiter]: {
    Sagittarius: Dignity.Rulership,
    Pisces: Dignity.Rulership,
    Gemini: Dignity.Detriment,
    Virgo: Dignity.Detriment,
    Cancer: Dignity.Exaltation,
    Capricorn: Dignity.Fall,
  },
  [Planet.Saturn]: {
    Capricorn: Dignity.Rulership,
    Aquarius: Dignity.Rulership,
    Cancer: Dignity.Detriment,
    Leo: Dignity.Detriment,
    Libra: Dignity.Exaltation,
    Aries: Dignity.Fall,
  },
  [Planet.Uranus]: {
    Aquarius: Dignity.Rulership,
    Leo: Dignity.Detriment,
    Scorpio: Dignity.Exaltation,
    Taurus: Dignity.Fall,
  },
  [Planet.Neptune]: {
    Pisces: Dignity.Rulership,
    Virgo: Dignity.Detriment,
    Leo: Dignity.Exaltation,
    Sagittarius: Dignity.Exaltation,
    Aquarius: Dignity.Fall,
    Gemini: Dignity.Fall,
  },
  [Planet.Pluto]: {
    Scorpio: Dignity.Rulership,
    Taurus: Dignity.Detriment,
    Aries: Dignity.Exaltation,
    Libra: Dignity.Fall,
  },
  [Planet.Chiron]: {},
  [Planet.Lilith]: {},
  [Planet.NorthNode]: {},
};

function hasConjunction(planetPosition: number, pointPosition: number, orbit: number): boolean {
  const halfOrbit = orbit / 2;
  let minimumOrbit = pointPosition - halfOrbit;
  if (minimumOrbit < 0) {
    minimumOrbit = FULL_CIRCLE - minimumOrbit;
  }

  let maximumOrbit = pointPosition + halfOrbit;
  if (maximumOrbit >= FULL_CIRCLE) {
    maximumOrbit -= FULL_CIRCLE;
  }

  return planetPosition <= maximumOrbit || planetPosition >= minimumOrbit;
}

/**
 * Dignities for a planet at a longitude: its essential dignity in that sign
 * (rulership / detriment / exaltation / fall), plus an exact-exaltation marker
 * when it's within orb of its exaltation degree.
 */
export function getDignities(planetName: Planet, planetPosition: number): Dignity[] {
  const result: Dignity[] = [];

  const dignity = planetDignities[planetName]?.[getSign(planetPosition)];
  if (dignity) result.push(dignity);

  for (const { name, position, orbit } of DIGNITIES_EXACT_EXALTATIONS_DEFAULT) {
    if (planetName === name && hasConjunction(planetPosition, position, orbit)) {
      result.push(Dignity.ExactExaltation);
    }
  }

  return result;
}

/**
 * Converts a wheel angle in degrees to the shifted angle in radians used for
 * placing SVG points (0° at the left, increasing counter-clockwise).
 */
export function convertShiftInDegrees(angle: number): number {
  return (((SHIFT_IN_DEGREES - angle) % FULL_CIRCLE) * Math.PI) / SHIFT_IN_DEGREES;
}

export function getPointPosition(point: Point, radius: number, angle: number): Point {
  const angleInRadians = convertShiftInDegrees(angle);
  const x = point.x + radius * Math.cos(angleInRadians);
  const y = point.y + radius * Math.sin(angleInRadians);
  return { x, y };
}

function isCollision(locatedPoint: LocatedPoint, comparePoint: LocatedPoint): boolean {
  const vX = locatedPoint.point.x - comparePoint.point.x;
  const vY = locatedPoint.point.y - comparePoint.point.y;

  const magnitude = Math.sqrt(vX * vX * vY * vY);
  const totalRadii = locatedPoint.radius + comparePoint.radius;

  return magnitude <= totalRadii;
}

/**
 * Adds `locatedPoint` to `locatedPoints`, nudging any glyph it overlaps (and
 * re-checking, recursively) so tightly-grouped planets fan out instead of
 * stacking. Mutates and returns the array.
 */
export function assembleLocatedPoints(
  locatedPoints: LocatedPoint[],
  locatedPoint: LocatedPoint,
  centerPoint: Point,
  pointRadius: number,
): LocatedPoint[] {
  if (locatedPoints.length === 0) {
    locatedPoints.push(locatedPoint);
    return locatedPoints;
  }

  const placePointsInCollision = (collisionPoint: LocatedPoint, incoming: LocatedPoint) => {
    const pointerDifference = Math.abs(collisionPoint.pointer - incoming.pointer);
    if (
      (collisionPoint.pointer <= incoming.pointer && pointerDifference <= COLLISION_RADIUS) ||
      (collisionPoint.pointer <= incoming.pointer && pointerDifference >= COLLISION_RADIUS)
    ) {
      collisionPoint.angle--;
      incoming.angle++;
    } else {
      collisionPoint.angle++;
      incoming.angle--;
    }

    collisionPoint.angle = (collisionPoint.angle + FULL_CIRCLE) % FULL_CIRCLE;
    incoming.angle = (incoming.angle + FULL_CIRCLE) % FULL_CIRCLE;
  };

  locatedPoints.sort((pointA, pointB) => pointA.angle - pointB.angle);

  const collisionIndex = locatedPoints.findIndex((point) => isCollision(point, locatedPoint));
  if (collisionIndex === -1) {
    locatedPoints.push(locatedPoint);
    return locatedPoints;
  }

  const collisionPoint = locatedPoints[collisionIndex];
  placePointsInCollision(collisionPoint, locatedPoint);
  collisionPoint.point = getPointPosition(centerPoint, pointRadius, collisionPoint.angle);
  locatedPoints.splice(collisionIndex, 1);

  locatedPoints = assembleLocatedPoints(locatedPoints, collisionPoint, centerPoint, pointRadius);
  locatedPoints = assembleLocatedPoints(locatedPoints, locatedPoint, centerPoint, pointRadius);

  return locatedPoints;
}

export function longitudeOf(body: CelestialBody | undefined) {
  const longitude = body?.ChartPosition?.Ecliptic?.DecimalDegrees;
  return typeof longitude === 'number' ? longitude : undefined;
}

export function longitudeOfMidheavenAscendant(
  { Ascendant, Midheaven }: Horoscope,
  record: Record<string, number>,
) {
  const ascendant = longitudeOf(Ascendant);
  if (ascendant != null) record.ascendant = ascendant;

  const midheaven = longitudeOf(Midheaven);
  if (midheaven != null) record.midheaven = midheaven;

  return record;
}
