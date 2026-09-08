import type { GlyphProps } from './glyphs/types';

/**
 * Renders an astrology glyph as a group of SVG paths. The anchor `point` is
 * shifted by the spec's `(dx, dy)` and rounded to whole pixels; each path body
 * is emitted after a leading `m <origin>`, so specs hold plain relative path
 * data and never repeat the placement arithmetic.
 */
function Glyph({ point, spec, stroke, strokeWidth }: GlyphProps) {
  const x = Math.round(point.x + spec.dx);
  const y = Math.round(point.y + spec.dy);
  return (
    <g>
      {spec.paths.map(({ ox = 0, oy = 0, d }, i) => (
        <path
          // Glyph paths are a fixed, ordered list — index keys are stable here.
          key={i}
          d={`m ${x + ox},${y + oy} ${d}`}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      ))}
    </g>
  );
}

export default Glyph;
