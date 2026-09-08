import { getPointPosition } from '../lib/horoscope';
import type { Point } from '../types';
import AstrologyLine from './AstrologySymbols/AstrologyLine';

export type AspectLine = {
  /** conjunction | sextile | square | trine | opposition */
  aspect: string;
  /** ecliptic longitude of each endpoint, in wheel degrees */
  from: number;
  to: number;
  /** how far from exact this aspect is, and the max orb allowed for it */
  orb: number;
  orbUsed: number;
};

interface AstrologyAspectsProps {
  readonly point: Point;
  /** radius the chords are anchored at — the inner circle */
  readonly radius: number;
  readonly shift: number;
  readonly lines: readonly AspectLine[];
}

// Hard aspects (square, opposition) strain; soft aspects (sextile, trine) flow;
// conjunction is a neutral blend. Unknown keys fall back to neutral.
const ASPECT_COLOR: Record<string, string> = {
  conjunction: '#9aa0b4',
  sextile: '#5b8def',
  trine: '#5b8def',
  square: '#e0555f',
  opposition: '#e0555f',
};

/**
 * Chords across the inner circle joining the bodies that aspect each other.
 * Colour keys the aspect family; each line thins and fades as its orb widens
 * toward the limit, so exact aspects read loudest.
 */
function AstrologyAspects({ point, radius, shift, lines }: AstrologyAspectsProps) {
  return (
    <g id="aspects">
      {lines.map((line, index) => {
        const exactness = 1 - Math.min(line.orb / line.orbUsed, 1);
        return (
          <AstrologyLine
            key={index}
            startingPoint={getPointPosition(point, radius, line.from + shift)}
            endingPoint={getPointPosition(point, radius, line.to + shift)}
            stroke={ASPECT_COLOR[line.aspect] ?? '#9aa0b4'}
            strokeWidth={0.5 + exactness * 1.2}
            opacity={0.35 + exactness * 0.5}
          />
        );
      })}
    </g>
  );
}

export default AstrologyAspects;
