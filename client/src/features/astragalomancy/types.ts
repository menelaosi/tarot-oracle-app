// Shapes returned by the astragalomancy API (server/routes/astragalomancy.ts).
// Kept in sync by hand.

export type AstragalomancyMode = 'zodiac' | 'standard';

export type PlanetRef = {
  key: string;
  name: string;
  glyph: string;
  keywords: string[];
  associations: string[];
};

export type SignRef = PlanetRef & { modality: string; element: string };

export type HouseRef = {
  number: number;
  name: string;
  keywords: string[];
  associations: string[];
};

/** Three six-sided dice: the sum keys one fixed traditional meaning. */
export type StandardRoll = {
  mode: 'standard';
  values: number[];
  total: number;
  meaning: string;
};

/** Three zodiac dice: planet = the situation, sign = the emotions, house = where it lands. */
export type ZodiacRoll = {
  mode: 'zodiac';
  planet: PlanetRef;
  sign: SignRef;
  house: HouseRef;
};

export type AstragalomancyRoll = StandardRoll | ZodiacRoll;

export type AstragalomancyReading = {
  id: string;
  question: string | null;
  roll: AstragalomancyRoll;
};
