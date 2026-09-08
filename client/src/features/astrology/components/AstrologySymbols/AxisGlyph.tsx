import { LIGHT_GRAY, SYMBOL_AXIS_STROKE } from '../../lib/horoscope';
import type { Axis, Point } from '../../types';
import Glyph from './Glyph';
import { AXIS_GLYPHS } from './glyphs/axisGlyphs';

interface AxisGlyphProps {
  readonly axis: Axis;
  readonly point: Point;
}

/** Draws a chart-angle label (AC / IC / DC / MC) at the given anchor point. */
function AxisGlyph({ axis, point }: AxisGlyphProps) {
  return (
    <Glyph
      point={point}
      spec={AXIS_GLYPHS[axis]}
      stroke={LIGHT_GRAY}
      strokeWidth={SYMBOL_AXIS_STROKE}
    />
  );
}

export default AxisGlyph;
