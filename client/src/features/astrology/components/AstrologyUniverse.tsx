import { DARK_GRAY, INNER_CIRCLE_RADIUS_RATIO, WHITE, getPointPosition } from '../lib/horoscope';
import type { Point } from '../types';
import { ZODIAC_SIGNS } from '../types';
import AstrologySegment from './AstrologySymbols/AstrologySegment';
import ZodiacGlyph from './AstrologySymbols/ZodiacGlyph';

interface AstrologyUniverseProps {
  readonly point: Point;
  readonly shift: number;
  readonly radius: number;
  readonly backgroundRadius: number;
}

/** Degrees of arc each zodiac sign occupies on the wheel. */
const SIGN_ARC = 360 / ZODIAC_SIGNS.length;

/** The zodiac band: 12 sign segments and their coloured glyphs. */
function AstrologyUniverse({ point, shift, radius, backgroundRadius }: AstrologyUniverseProps) {
  const glyphRadius = radius - (radius / INNER_CIRCLE_RADIUS_RATIO / 2);

  return (
    <g id='signs'>
      {ZODIAC_SIGNS.map((sign, i) => (
        <AstrologySegment
          key={sign}
          point={point}
          radius={radius}
          angleFrom={shift + (i * SIGN_ARC)}
          angleTo={shift + ((i + 1) * SIGN_ARC)}
          thickness={backgroundRadius}
          fill={WHITE}
          stroke={DARK_GRAY}
          strokeWidth={1}
        />
      ))}
      {ZODIAC_SIGNS.map((sign, i) => (
        <ZodiacGlyph
          key={sign}
          sign={sign}
          point={getPointPosition(point, glyphRadius, shift + (SIGN_ARC / 2) + (i * SIGN_ARC))}
        />
      ))}
    </g>
  );
}

export default AstrologyUniverse;
