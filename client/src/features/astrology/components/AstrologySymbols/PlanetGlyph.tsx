import { BLACK, POINTS_STROKE, getSign } from '../../lib/horoscope';
import type { Planet, Point } from '../../types';
import { SIGN_COLOR } from '../../types';
import Glyph from './Glyph';
import { PLANET_GLYPHS } from './glyphs/planetGlyphs';

interface PlanetGlyphProps {
  readonly planet: Planet;
  readonly point: Point;
  /** Ecliptic longitude, used to colour the glyph by the sign it falls in. */
  readonly longitude: number;
}

/** Draws a planet or point glyph, coloured by the zodiac sign of its longitude. */
function PlanetGlyph({ planet, point, longitude }: PlanetGlyphProps) {
  return (
    <Glyph
      point={point}
      spec={PLANET_GLYPHS[planet]}
      stroke={SIGN_COLOR[getSign(longitude)] ?? BLACK}
      strokeWidth={POINTS_STROKE}
    />
  );
}

export default PlanetGlyph;
