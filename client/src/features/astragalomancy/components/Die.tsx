import type { ReactNode } from 'react';

type DieProps = {
  variant: 'standard' | 'zodiac';
  index: number;
  children: ReactNode;
};

// Which of the 9 grid cells carry a pip, per face value.
const PIP_LAYOUT: Record<number, readonly number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

/** The pip grid for a standard die face (1–6); unknown values render blank. */
export function Pips({ value }: { value: number }) {
  const lit = new Set(PIP_LAYOUT[value] ?? []);
  return (
    <div className="die-pips" aria-hidden="true">
      {Array.from({ length: 9 }, (_, cell) => (
        <span key={cell} className={`pip${lit.has(cell) ? ' pip-on' : ''}`} />
      ))}
    </div>
  );
}

/** A zodiac glyph (or house number) as a die face, pinned to text — not emoji — rendering. */
export function DieGlyph({ glyph }: { glyph: string }) {
  // U+FE0E (variation selector-15) forces text rendering, so zodiac symbols
  // don't fall back to colour emoji glyphs on some platforms.
  return <span className="die-glyph">{`${glyph}\uFE0E`}</span>;
}

/**
 * A single die that tumbles in on mount and settles on `children` (a pip grid, a
 * zodiac glyph, or a house number). Re-rolling remounts it via a `key` on the
 * stage, so the animation replays. Honours `prefers-reduced-motion`.
 */
function Die({ variant, index, children }: DieProps) {
  return (
    <div className={`die die-${variant}`} style={{ animationDelay: `${index * 90}ms` }}>
      <div className="die-face">{children}</div>
    </div>
  );
}

export default Die;
