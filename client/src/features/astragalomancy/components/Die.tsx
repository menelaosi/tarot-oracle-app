import type { ReactNode } from 'react';

type DieProps = {
  variant: 'standard' | 'zodiac';
  /** Position in the row, used to stagger the roll animation. */
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
        <span key={cell} className={lit.has(cell) ? 'pip pip-on' : 'pip'} />
      ))}
    </div>
  );
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
