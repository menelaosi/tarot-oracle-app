export interface Point {
  x: number;
  y: number;
}

export interface LocatedPoint {
  planetName: Planet;
  point: Point;
  radius: number;
  angle: number;
  pointer: number;
}

/** A celestial body's ecliptic longitude plus whether it is retrograde at the chart's moment. */
export interface CelestialBodyPosition {
  longitude: number;
  retrograde: boolean;
}

export interface DescriptionPosition {
  text: string;
  point: Point;
}

export interface DefaultDignities {
  name: string;
  position: number;
  orbit: number;
}

export const Dignity = {
  Rulership: 'r',
  Detriment: 'd',
  Exaltation: 'e',
  ExactExaltation: 'E',
  Fall: 'f',
} as const;
export type Dignity = (typeof Dignity)[keyof typeof Dignity];

export const Planet = {
  Sun: 'sun',
  Moon: 'moon',
  Mercury: 'mercury',
  Venus: 'venus',
  Mars: 'mars',
  Jupiter: 'jupiter',
  Saturn: 'saturn',
  Uranus: 'uranus',
  Neptune: 'neptune',
  Pluto: 'pluto',
  Chiron: 'chiron',
  Lilith: 'lilith',
  NorthNode: 'nnode',
} as const;
export type Planet = (typeof Planet)[keyof typeof Planet];

export const SIGN_COLOR: Record<ZodiacSign, string> = {
  Aries: '#FF4500',
  Taurus: '#228B22',
  Gemini: '#ADD8E6',
  Cancer: '#4169E1',
  Leo: '#FFD700',
  Virgo: '#32CD32',
  Libra: '#D3D3D3',
  Scorpio: '#483D8B',
  Sagittarius: '#FF6347',
  Capricorn: '#808000',
  Aquarius: '#87CEFA',
  Pisces: '#4682B4',
};

export const SIGN_EMOJI: Record<ZodiacSign, string> = {
  Aries: '♈',
  Taurus: '♉',
  Gemini: '♊',
  Cancer: '♋',
  Leo: '♌',
  Virgo: '♍',
  Libra: '♎',
  Scorpio: '♏',
  Sagittarius: '♐',
  Capricorn: '♑',
  Aquarius: '♒',
  Pisces: '♓',
};

export const ZODIAC_SIGNS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
] as const;
export type ZodiacSign = (typeof ZODIAC_SIGNS)[number];

/** 1-based zodiac position, e.g. zodiacNumber('Aries') === 1. */
export function zodiacNumber(sign: ZodiacSign): number {
  return ZODIAC_SIGNS.indexOf(sign) + 1;
}

/** Inverse of zodiacNumber; 1 -> 'Aries'. */
export function zodiacFromNumber(n: number): ZodiacSign {
  return ZODIAC_SIGNS[(n - 1) % 12];
}

export const Axis = {
  Ascendant: 0,
  ImmumCoeli: 3,
  Descendant: 6,
  Midheaven: 9,
} as const;
export type Axis = (typeof Axis)[keyof typeof Axis];
