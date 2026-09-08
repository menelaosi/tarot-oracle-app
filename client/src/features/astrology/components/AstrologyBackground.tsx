import { WHITE } from '../lib/horoscope';
import type { Point } from '../types';
import AstrologySegment from './AstrologySymbols/AstrologySegment';

type AstrologyBackgroundProps = {
  readonly id: string;
  readonly point: Point;
  readonly radius: number;
  readonly thickness: number;
};

/** The opaque disc behind a wheel (radix or transit), drawn as one wide ring segment. */
function AstrologyBackground({ id, point, radius, thickness }: AstrologyBackgroundProps) {
  return (
    <g id={id}>
      <AstrologySegment
        point={point}
        radius={radius}
        angleFrom={0}
        angleTo={359.99}
        thickness={thickness}
        lFlag={1}
        fill={WHITE}
      />
    </g>
  );
};

export default AstrologyBackground;
