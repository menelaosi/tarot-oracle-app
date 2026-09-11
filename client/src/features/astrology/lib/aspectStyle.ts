// Shared visual language for aspect lines, used by both the natal aspect chords
// (AstrologyAspects) and the transit-to-natal chords (AstrologyTransits).

export type AspectLine = {
  aspect: string; // conjunction | sextile | square | trine | opposition
  from: number; // ecliptic longitude of each endpoint, in wheel degrees
  to: number;
  orb: number; // how far from exact this aspect is, and the max orb allowed for it
  orbUsed: number;
};

// Hard aspects (square, opposition) strain; soft aspects (sextile, trine) flow;
// conjunction is a neutral blend. Unknown keys fall back to neutral.
export const ASPECT_COLOR: Record<string, string> = {
  conjunction: '#9aa0b4',
  sextile: '#5b8def',
  trine: '#5b8def',
  square: '#e0555f',
  opposition: '#e0555f',
};

export const NEUTRAL_ASPECT_COLOR = '#9aa0b4';

/** Line weight + opacity for an aspect, louder the closer it is to exact. */
export function aspectLineStyle(orb: number, orbUsed: number) {
  const exactness = 1 - Math.min(orb / orbUsed, 1);
  return { strokeWidth: 0.5 + exactness * 1.2, opacity: 0.35 + exactness * 0.5 };
}
