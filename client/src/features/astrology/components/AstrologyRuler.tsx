import { CUSPS_STROKE, DARK_GRAY, getPointPosition } from '../lib/horoscope';
import type { Point } from '../types';
import AstrologyCircle from './AstrologySymbols/AstrologyCircle';
import AstrologyLine from './AstrologySymbols/AstrologyLine';

type AstrologyRulerProps = {
  readonly point: Point;
  readonly startRadius: number;
  readonly rulerRadius: number;
  readonly startAngle: number;
  readonly isTransit?: boolean;
};

function getRulerPositions(
  point: Point,
  startRadius: number,
  endRadius: number,
  startAngle: number,
) {
  const rayRadius = endRadius;
  const radiusRatio = Math.abs((endRadius - startRadius) / 2);

  const halfRayRadius = (startRadius <= endRadius)
    ? rayRadius - radiusRatio
    : rayRadius + radiusRatio;
  const resultArray = [];
  for (let i = 0, start = 0, step = 5; i < 72; i++) {
    const angle = start + startAngle;
    const startingPoint = getPointPosition(
      point,
      startRadius,
      angle,
    );

    const endPositionStartRadius = (i % 2 === 0)
      ? rayRadius
      : halfRayRadius;

    const endingPoint = getPointPosition(
      point,
      endPositionStartRadius,
      angle,
    );

    resultArray.push(
      <AstrologyLine
        key={i}
        startingPoint={startingPoint}
        endingPoint={endingPoint}
        stroke={DARK_GRAY}
        strokeWidth={CUSPS_STROKE}
      />,
    );

    start += step;
  }

  return resultArray;
}

/** The degree tick ring just inside a wheel's rim (72 ticks, every 5°). */
function AstrologyRuler({
  point,
  startRadius,
  rulerRadius,
  startAngle,
  isTransit = false,
}: AstrologyRulerProps) {
  // The degree ruler is a band just inside its rim (startRadius), so its ticks
  // sit on the white wheel rather than the dark page margin.
  const endRadius = startRadius - rulerRadius;
  const circleRadius = isTransit ? endRadius : startRadius;
  const rulerPositions = getRulerPositions(
    point,
    startRadius,
    endRadius,
    startAngle,
  );
  return (
    <g id='ruler'>
      {rulerPositions}
      <AstrologyCircle
        point={point}
        radius={circleRadius}
        stroke={DARK_GRAY}
        strokeWidth={CUSPS_STROKE}
      />
    </g>
  );
};

export default AstrologyRuler;
