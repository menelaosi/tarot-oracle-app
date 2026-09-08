// SQL for the astragalomancy routes. Standard mode reads a fixed meaning table;
// zodiac mode reuses the astrology reference tables (planet / sign / house).

export type StandardMeaningRow = { total: number; meaning: string };

export type PlanetRefRow = {
  key: string;
  name: string;
  glyph: string;
  keywords: string[];
  associations: string[];
};

export type SignRefRow = PlanetRefRow & { modality: string; element: string };

export type HouseRefRow = {
  number: number;
  name: string;
  keywords: string[];
  associations: string[];
};

export type AstragalomancyReadingRow = {
  id: string;
  question: string | null;
  mode: 'standard' | 'zodiac';
  dice: {
    values?: number[];
    total?: number;
    planet?: string;
    sign?: string;
    house?: number;
  };
  interpretation: string | null;
};

export const selectStandardMeaning =
  'SELECT total, meaning FROM astragalomancy_meanings WHERE total = $1';

export const selectPlanetRef =
  'SELECT key, name, glyph, keywords, associations FROM astrology_planets WHERE key = $1';

export const selectSignRef =
  'SELECT key, name, glyph, keywords, associations, modality, element FROM astrology_signs WHERE key = $1';

export const selectHouseRef =
  'SELECT number, name, keywords, associations FROM astrology_houses WHERE number = $1';

export const insertAstragalomancyReading = `
  INSERT INTO astragalomancy_readings (question, mode, dice)
  VALUES ($1, $2, $3::jsonb)
  RETURNING id, question
`;

export const selectAstragalomancyReading = `
  SELECT id, question, mode, dice, interpretation
  FROM astragalomancy_readings
  WHERE id = $1
`;

export const updateAstragalomancyInterpretation = `
  UPDATE astragalomancy_readings
  SET interpretation = $1
  WHERE id = $2
`;
