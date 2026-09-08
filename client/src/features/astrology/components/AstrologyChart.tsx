import { Horoscope } from 'circular-natal-horoscope-js';
import { COLLISION_RADIUS, FULL_CIRCLE, INDOOR_CIRCLE_RADIUS_RATIO, INNER_CIRCLE_RADIUS_RATIO, MARGIN, PADDING, RULER_RADIUS, assembleLocatedPoints, getCelestialBody, getPointPosition } from '../lib/horoscope';
import type { CelestialBodyPosition, LocatedPoint, Point } from '../types';
import { Planet } from '../types';
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
 * Creates the astrology chart based on the provided horoscope
 * @param {AstrologyChartProps} props The horoscope passed in or undefined
 * @returns A div with all the SVGs for now for testing
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

  return (
    <svg
      id='chart'
      viewBox={`0 0 ${height} ${width}`}
      preserveAspectRatio='xMinYMin meet'
    >
      <g id='aspects' />
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
