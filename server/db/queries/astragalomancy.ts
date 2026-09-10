// SQL for the astragalomancy routes. Standard mode reads a fixed meaning table;
// zodiac mode reuses the astrology reference tables (planet / sign / house).

import { setInterpretation } from './fragments.js';

export type StandardMeaningRow = { total: number; meaning: string };

/** The fields every zodiac reference row shares — all a grounded reading needs. */
export type RefRow = {
  name: string;
  keywords: string[];
  associations: string[];
};

export type PlanetRefRow = RefRow & {
  key: string;
  glyph: string;
};

export type SignRefRow = PlanetRefRow & { modality: string; element: string };

export type HouseRefRow = RefRow & {
  number: number;
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

// Column lists that mirror the row-type hierarchy: RefRow, then +key/glyph for a
// keyed row (planet, sign), then sign's extra pair.
const REF_COLUMNS = 'name, keywords, associations';
const KEYED_REF_COLUMNS = `key, glyph, ${REF_COLUMNS}`;

const refSelect = (columns: string, table: string, key = 'key'): string =>
  `SELECT ${columns} FROM astrology_${table} WHERE ${key} = $1`;

export const selectPlanetRef = refSelect(KEYED_REF_COLUMNS, 'planets');
export const selectSignRef = refSelect(`${KEYED_REF_COLUMNS}, modality, element`, 'signs');
export const selectHouseRef = refSelect(`number, ${REF_COLUMNS}`, 'houses', 'number');

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

export const updateAstragalomancyInterpretation = setInterpretation('astragalomancy_readings');
