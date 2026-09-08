import { Horoscope } from 'circular-natal-horoscope-js';
import type { AspectLine } from '../lib/aspectStyle';
import { COLLISION_RADIUS, DARK_GRAY, FULL_CIRCLE, INDOOR_CIRCLE_RADIUS_RATIO, INNER_CIRCLE_RADIUS_RATIO, LIGHT_GRAY, MARGIN, PADDING, RULER_RADIUS, WHITE, assembleLocatedPoints, getCelestialBody, getPointPosition } from '../lib/horoscope';
import type { TransitContact } from '../lib/transits';
import type { CelestialBodyPosition, LocatedPoint, Point } from '../types';
import { Planet } from '../types';
import AstrologyAspects from './AstrologyAspects';
import AstrologyAxis from './AstrologyAxis';
import AstrologyBackground from './AstrologyBackground';
import AstrologyCircles from './AstrologyCircles';
import AstrologyCusps from './AstrologyCusps';
import AstrologyPlanets from './AstrologyPlanets';
import AstrologyRuler from './AstrologyRuler';
import AstrologyTransits from './AstrologyTransits';
import AstrologyUniverse from './AstrologyUniverse';

type AstrologyChartProps = {
  readonly horoscope: Horoscope;
  readonly height?: number;
  readonly width?: number;
  /**
   * When set, draws the bi-wheel: a ring of the transiting planets outside the
   * natal wheel and dashed chords to the natal points they contact. `horoscope`
   * stays the natal chart; `transit.horoscope` is the sky for the chosen moment.
   */
  readonly transit?: {
    horoscope: Horoscope;
    contacts: readonly TransitContact[];
  };
};

// Extra breathing room outside the natal wheel for the transit ring; the wheel
// shrinks by this much when the bi-wheel is shown.
const TRANSIT_MARGIN = MARGIN + 48;
// The transit band hugs the wheel edge (small gap) rather than floating in the
// margin; AstrologyTransits derives the band width from this centre line.
const TRANSIT_RING_OFFSET = 18;
type Cusp = {
  ChartPosition: {
    StartPosition:{
      Ecliptic: { DecimalDegrees: number; },
      Horizon: { DecimalDegrees: number; },
    },
  };
};

// One entry of horoscope.Aspects.all — the pairing the library found between two
// points, plus how far off exact it is (`orb`) and the widest orb it allowed for
// that aspect type (`orbUsed`).
type RawAspect = {
  point1Key: string;
  point2Key: string;
  aspectKey: string;
  aspectLevel: 'major' | 'minor';
  orb: number;
  orbUsed: number;
};

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

/**
 * Natal longitudes keyed the way transit contacts name their target: a Planet
 * value ('sun', 'nnode', …) or 'ascendant' / 'midheaven' for the angles.
 */
function getNatalLongitudes(
  horoscope: Horoscope,
  positions: Record<Planet, CelestialBodyPosition | undefined>,
): Record<string, number> {
  const longitudes: Record<string, number> = {};
  for (const planet of Object.values(Planet)) {
    const longitude = positions[planet]?.longitude;
    if (longitude !== undefined) longitudes[planet] = longitude;
  }
  const ascendant = horoscope.Ascendant?.ChartPosition?.Ecliptic?.DecimalDegrees;
  if (ascendant !== undefined) longitudes.ascendant = ascendant;
  const midheaven = horoscope.Midheaven?.ChartPosition?.Ecliptic?.DecimalDegrees;
  if (midheaven !== undefined) longitudes.midheaven = midheaven;
  return longitudes;
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
function AstrologyChart({ horoscope, height = 800, width = 800, transit }: AstrologyChartProps) {
  const x = width / 2;
  const y = height / 2;
  const point: Point = { x, y };

  const radius = y - (transit ? TRANSIT_MARGIN : MARGIN);
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

  // Transit overlay geometry: a glyph band just outside the wheel edge, with the
  // moving planets collision-spread the same way the natal ones are.
  const transitRingRadius = radius + TRANSIT_RING_OFFSET;
  const transitPositions = transit
    ? getCelestialBodyPositions(transit.horoscope)
    : undefined;
  const transitLocatedPoints = transitPositions
    ? getLocatedPoints(transitPositions, point, transitRingRadius, shift)
    : [];
  const natalLongitudes = transit
    ? getNatalLongitudes(horoscope, celestialBodyPositions)
    : {};

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
      {transit && transitPositions && (
        <AstrologyTransits
          point={point}
          hubRadius={thickness}
          wheelRadius={radius}
          ringRadius={transitRingRadius}
          shift={shift}
          transitPositions={transitPositions}
          natalLongitudes={natalLongitudes}
          locatedPoints={transitLocatedPoints}
          contacts={transit.contacts}
        />
      )}
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
          stroke={transit ? DARK_GRAY : LIGHT_GRAY}
        />
        <AstrologyCircles
          point={point}
          radius={radius}
          thickness={thickness}
          backgroundRadius={radixRadius}
        />
      </g>
    </svg>
  );
};

export default AstrologyChart;
