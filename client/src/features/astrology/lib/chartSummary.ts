import type { Horoscope } from 'circular-natal-horoscope-js';
import { FULL_CIRCLE, getCelestialBody, getSign } from './horoscope';
import { Planet } from '../types';

export type BirthInput = {
  dateTime: string;
  latitude: number;
  longitude: number;
  placeLabel: string;
};

export type Placement = {
  body: Planet;
  sign: string;
  house: number | null;
  degree: number;
  degreeInSign: number;
  retrograde: boolean;
};

export type AngleSummary = { sign: string; degree: number };

export type AspectSummary = { from: string; to: string; type: string; orb: number };

export type ChartSummary = {
  birth: BirthInput;
  placements: Placement[];
  angles: {
    ascendant: AngleSummary;
    midheaven: AngleSummary;
    descendant: AngleSummary;
    imumCoeli: AngleSummary;
  };
  aspects: AspectSummary[];
};

/** Lowercase sign key (`'aries'`), matching the server's astrology_signs.key. */
function signKey(degrees: number): string {
  return getSign(degrees).toLowerCase();
}

function angleAt(degrees: number): AngleSummary {
  return { sign: signKey(degrees), degree: degrees };
}

/**
 * Flattens the library's Horoscope into the compact payload the
 * `/api/astrology/interpret` endpoint enriches with reference data.
 */
export function buildChartSummary(horoscope: Horoscope, birth: BirthInput): ChartSummary {
  const placements: Placement[] = [];
  for (const body of Object.values(Planet)) {
    const raw = getCelestialBody(horoscope, body);
    const degree = raw?.ChartPosition?.Ecliptic?.DecimalDegrees;
    if (typeof degree !== 'number') continue;
    placements.push({
      body,
      sign: raw?.Sign?.key ?? signKey(degree),
      house: raw?.House?.id ?? null,
      degree,
      degreeInSign: degree % 30,
      retrograde: Boolean(raw?.isRetrograde),
    });
  }

  const ascDegree = horoscope.Ascendant?.ChartPosition?.Ecliptic?.DecimalDegrees ?? 0;
  const mcDegree = horoscope.Midheaven?.ChartPosition?.Ecliptic?.DecimalDegrees ?? 0;

  const aspects: AspectSummary[] = (horoscope.Aspects?.all ?? [])
    .filter((aspect: { aspectLevel: string }) => aspect.aspectLevel === 'major')
    .map((aspect: { point1Key: string; point2Key: string; aspectKey: string; orb: number }) => ({
      from: aspect.point1Key,
      to: aspect.point2Key,
      type: aspect.aspectKey,
      orb: aspect.orb,
    }));

  return {
    birth,
    placements,
    angles: {
      ascendant: {
        sign: horoscope.Ascendant?.Sign?.key ?? signKey(ascDegree),
        degree: ascDegree,
      },
      midheaven: {
        sign: horoscope.Midheaven?.Sign?.key ?? signKey(mcDegree),
        degree: mcDegree,
      },
      descendant: angleAt((ascDegree + FULL_CIRCLE / 2) % FULL_CIRCLE),
      imumCoeli: angleAt((mcDegree + FULL_CIRCLE / 2) % FULL_CIRCLE),
    },
    aspects,
  };
}
