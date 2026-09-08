import { ASPECT_COLOR, NEUTRAL_ASPECT_COLOR, aspectLineStyle, type AspectLine } from '../lib/aspectStyle';
import { getPointPosition } from '../lib/horoscope';
import type { Point } from '../types';
import AstrologyLine from './AstrologySymbols/AstrologyLine';

type AstrologyAspectsProps = {
  readonly point: Point;
  /** radius the chords are anchored at — the inner circle */
  readonly radius: number;
  readonly shift: number;
  readonly lines: readonly AspectLine[];
};

/**
 * Chords across the inner circle joining the bodies that aspect each other.
 * Colour keys the aspect family; each line thins and fades as its orb widens
 * toward the limit, so exact aspects read loudest.
 */
function AstrologyAspects({ point, radius, shift, lines }: AstrologyAspectsProps) {
  return (
    <g id="aspects">
      {lines.map((line, index) => (
        <AstrologyLine
          key={index}
          startingPoint={getPointPosition(point, radius, line.from + shift)}
          endingPoint={getPointPosition(point, radius, line.to + shift)}
          stroke={ASPECT_COLOR[line.aspect] ?? NEUTRAL_ASPECT_COLOR}
          {...aspectLineStyle(line.orb, line.orbUsed)}
        />
      ))}
    </g>
  );
}

export default AstrologyAspects;
