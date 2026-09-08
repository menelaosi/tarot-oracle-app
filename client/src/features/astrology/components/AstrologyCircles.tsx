import { DARK_GRAY, INDOOR_CIRCLE_RADIUS_RATIO } from '../lib/horoscope';
import type { Point } from '../types';
import AstrologyCircle from './AstrologySymbols/AstrologyCircle';

type AstrologyCirclesProps = {
  readonly point: Point;
  readonly radius: number;
  readonly thickness: number;
  readonly backgroundRadius: number;
};

/** The concentric outline circles that separate the wheel's rings. */
function AstrologyCircles({ point, radius, thickness, backgroundRadius }: AstrologyCirclesProps) {
  return (
    <g id='circles'>
      <AstrologyCircle
        point={point}
        radius={thickness}
        stroke={DARK_GRAY}
        strokeWidth={INDOOR_CIRCLE_RADIUS_RATIO}
      />
      <AstrologyCircle
        point={point}
        radius={radius}
        stroke={DARK_GRAY}
        strokeWidth={INDOOR_CIRCLE_RADIUS_RATIO}
      />
      <AstrologyCircle
        point={point}
        radius={backgroundRadius}
        stroke={DARK_GRAY}
        strokeWidth={INDOOR_CIRCLE_RADIUS_RATIO}
      />
    </g>
  );
};

export default AstrologyCircles;
