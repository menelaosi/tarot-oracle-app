import { Horoscope } from 'circular-natal-horoscope-js';
import { COLLISION_RADIUS, FULL_CIRCLE, INDOOR_CIRCLE_RADIUS_RATIO, INNER_CIRCLE_RADIUS_RATIO, MARGIN, PADDING, RULER_RADIUS, WHITE, assembleLocatedPoints, getCelestialBody, getPointPosition } from '../lib/horoscope';
import type { CelestialBodyPosition, LocatedPoint, Point } from '../types';
import { Planet } from '../types';
import AstrologyAspects, { type AspectLine } from './AstrologyAspects';
import AstrologyAxis from './AstrologyAxis';
import AstrologyBackground from './AstrologyBackground';
import AstrologyCircles from './AstrologyCircles';
import AstrologyCusps from './AstrologyCusps';
import AstrologyPlanets from './AstrologyPlanets';
import AstrologyRuler from './AstrologyRuler';
import AstrologyUniverse from './AstrologyUniverse';

interface AstrologyChartProps {
  readonly horoscope: Horoscope;
  readonly height?: number;
  readonly width?: number;
}
interface Cusp {
  ChartPosition: {
    StartPosition:{
      Ecliptic: { DecimalDegrees: number; },
      Horizon: { DecimalDegrees: number; },
    },
  };
}

// One entry of horoscope.Aspects.all — the pairing the library found between two
// points, plus how far off exact it is (`orb`) and the widest orb it allowed for
// that aspect type (`orbUsed`).
interface RawAspect {
  point1Key: string;
  point2Key: string;
  aspectKey: string;
  aspectLevel: 'major' | 'minor';
  orb: number;
  orbUsed: number;
}

function getCelestialBodyPositions(horoscope: Horoscope): Record<Planet, CelestialBodyPosition | undefined> {
  return Object.values(Planet).reduce<Record<Planet, CelestialBodyPosition | undefined>>(
    (positions, planet) => {
      const body = getCelestialBody(horoscope, planet);
      const longitude = body?.ChartPosition?.Ecliptic?.DecimalDegrees;
      positions[planet] = longitude === undefined
        ? undefined
        : { longitude, retrograde: Boolean(body?.isRetrograde) };
      return positions;
    },
    {} as Record<Planet, CelestialBodyPosition | undefined>,
  );
}

function getCuspPositions(horoscope: Horoscope): number[] {
  return horoscope?.Houses
    .map((cusp: Cusp) => cusp.ChartPosition
      .StartPosition
      .Ecliptic
      .DecimalDegrees,
    );
}

/**
 * Resolves each major aspect from `horoscope.Aspects` into a drawable chord by
 * looking up the ecliptic longitude of both endpoints. Endpoints the wheel does
 * not plot (south node, fixed stars) are dropped. `orbUsed` rides along so the
 * renderer can fade aspects out as they approach the edge of orb.
 */
function getAspectLines(
  horoscope: Horoscope,
  celestialBodyPositions: Record<Planet, CelestialBodyPosition | undefined>,
): AspectLine[] {
  const longitudeByKey: Record<string, number> = {};
  for (const planet of Object.values(Planet)) {
    const longitude = celestialBodyPositions[planet]?.longitude;
    if (longitude === undefined) continue;
    // Aspects name the lunar node 'northnode'; every other library key already
    // matches the Planet value we store positions under.
    longitudeByKey[planet === Planet.NorthNode ? 'northnode' : planet] = longitude;
  }
  const ascendant = horoscope.Ascendant?.ChartPosition?.Ecliptic?.DecimalDegrees;
  if (ascendant !== undefined) longitudeByKey.ascendant = ascendant;
  const midheaven = horoscope.Midheaven?.ChartPosition?.Ecliptic?.DecimalDegrees;
  if (midheaven !== undefined) longitudeByKey.midheaven = midheaven;

  const rawAspects: RawAspect[] = horoscope?.Aspects?.all ?? [];
  return rawAspects
    .filter((aspect) => aspect.aspectLevel === 'major')
    .map((aspect) => {
      const from = longitudeByKey[aspect.point1Key];
      const to = longitudeByKey[aspect.point2Key];
      if (from === undefined || to === undefined) return undefined;
      return { aspect: aspect.aspectKey, from, to, orb: aspect.orb, orbUsed: aspect.orbUsed };
    })
    .filter((line): line is AspectLine => line !== undefined);
}

function getLocatedPoints(
  celestialBodyPositions: Record<Planet, CelestialBodyPosition | undefined>,
  point: Point,
  pointRadius: number,
  shift: number,
): LocatedPoint[] {
  let locatedPoints: LocatedPoint[] = [];
  Object.keys(celestialBodyPositions).forEach(planet => {
    const planetName = planet as Planet;
    const planetShift = (celestialBodyPositions[planetName]?.longitude ?? 0) + shift;
    const position = getPointPosition(
      point,
      pointRadius,
      planetShift,
    );
    const locatedPoint = {
      planetName,
      point: position,
      radius: COLLISION_RADIUS,
      angle: planetShift,
      pointer: planetShift,
    };
    locatedPoints = assembleLocatedPoints(
      locatedPoints,
      locatedPoint,
      point,
      pointRadius,
    );
  });

  return locatedPoints;
}

/**
 * The natal wheel as one SVG. Derives each ring's radius from `radius`, resolves
 * body and cusp longitudes from the library `horoscope`, and composes the
 * background / signs / ruler / planets / cusps / axis subcomponents. `shift`
 * rotates the whole wheel so the Ascendant sits on the left.
 */
function AstrologyChart({ horoscope, height = 800, width = 800 }: AstrologyChartProps) {
  const x = width / 2;
  const y = height / 2;
  const point: Point = { x, y };

  const radius = y - MARGIN;

  const radiusRatio = radius / INNER_CIRCLE_RADIUS_RATIO;
  const radixRadius = radius - radiusRatio;

  const thickness = radius / INDOOR_CIRCLE_RADIUS_RATIO;

  const rulerRadius = radiusRatio / RULER_RADIUS;
  const pointRadius = radius - (radiusRatio + (2 * rulerRadius) + PADDING);
  const numbersRadius = (radius / INDOOR_CIRCLE_RADIUS_RATIO) + COLLISION_RADIUS;
  const endDashedLineRadius = radius - (radiusRatio + rulerRadius);

  const celestialBodyPositions = getCelestialBodyPositions(horoscope);

  const cuspPositions = getCuspPositions(horoscope);

  const shift = (cuspPositions && cuspPositions[0])
    ? FULL_CIRCLE - cuspPositions[0] : 0;

  const locatedPoints = getLocatedPoints(
    celestialBodyPositions,
    point,
    pointRadius,
    shift,
  );

  const aspectLines = getAspectLines(horoscope, celestialBodyPositions);

  return (
    <svg
      id='chart'
      viewBox={`0 0 ${height} ${width}`}
      preserveAspectRatio='xMinYMin meet'
    >
      {/*
        The wheel's rings stop at the inner circle, leaving the middle open. Fill
        it with the band colour first so the aspect chords drawn over it read
        against the same background as the rest of the chart, not the page.
      */}
      <circle cx={x} cy={y} r={thickness} fill={WHITE} />
      <AstrologyAspects
        point={point}
        radius={thickness}
        shift={shift}
        lines={aspectLines}
      />
      <g id='radix'>
        <AstrologyBackground
          id={'radix-background'}
          point={point}
          radius={radixRadius}
          thickness={thickness}
        />
        <AstrologyUniverse
          point={point}
          shift={shift}
          radius={radius}
          backgroundRadius={radixRadius}
        />
        <AstrologyRuler
          point={point}
          startRadius={radius}
          rulerRadius={rulerRadius}
          startAngle={shift}
        />
        <AstrologyPlanets
          point={point}
          radius={radius}
          planets={celestialBodyPositions}
          locatedPoints={locatedPoints}
          rulerRadius={rulerRadius}
          pointRadius={pointRadius}
          shift={shift}
        />
        <AstrologyCusps
          point={point}
          numbersRadius={numbersRadius}
          pointRadius={pointRadius}
          endDashedLineRadius={endDashedLineRadius}
          cuspPositions={cuspPositions}
          shift={shift}
          locatedPoints={locatedPoints}
        />
        <AstrologyAxis
          point={point}
          radius={radius}
          cuspPositions={cuspPositions}
          shift={shift}
        />
        <AstrologyCircles
          point={point}
          radius={radius}
          thickness={thickness}
          backgroundRadius={radixRadius}
        />
      </g>
      {/*
        The transit ring (outer wheel of moving planets against the natal chart)
        needs a transit date and its own body positions. This view only has the
        birth moment, so there is nothing to draw here yet — restore a
        <g id='transits'> group once transit data is wired through.
      */}
    </svg>
  );
};

export default AstrologyChart;
