// SQL for the astragalomancy routes. Standard mode reads a fixed meaning table;
// zodiac mode reuses the astrology reference tables (planet / sign / house).

import { insertInto, setInterpretation } from './fragments.js';

/** `SELECT <columns> FROM <table> WHERE <key> = $1` — one row by a key column. */
const selectByKey = (columns: string, table: string, key = 'id'): string =>
  `SELECT ${columns} FROM ${table} WHERE ${key} = $1`;

// ── astragalomancy's own tables ──────────────────────────────────────────────

const READINGS = 'astragalomancy_readings';

export type StandardMeaningRow = { total: number; meaning: string };

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

export const selectStandardMeaning = selectByKey(
  'total, meaning',
  'astragalomancy_meanings',
  'total',
);

export const insertAstragalomancyReading = insertInto(
  READINGS,
  ['question', 'mode', 'dice::jsonb'],
  'id, question',
);

export const selectAstragalomancyReading = selectByKey(
  'id, question, mode, dice, interpretation',
  READINGS,
);

export const updateAstragalomancyInterpretation = setInterpretation(READINGS);

// ── borrowed from the astrology reference library (zodiac dice) ───────────────

/** The fields every zodiac reference row shares — all a grounded reading needs. */
export type RefRow = {
  name: string;
  keywords: string[];
  associations: string[];
};

export type PlanetRefRow = RefRow & { key: string; glyph: string };
export type SignRefRow = PlanetRefRow & { modality: string; element: string };
export type HouseRefRow = RefRow & { number: number };

// Column lists that mirror the row-type hierarchy: RefRow, then +key/glyph for a
// keyed row (planet, sign), then sign's extra pair.
const REF_COLUMNS = 'name, keywords, associations';
const KEYED_REF_COLUMNS = `key, glyph, ${REF_COLUMNS}`;

/** A lookup against a borrowed `astrology_*` reference table. */
const astrologyRef = (columns: string, table: string, key = 'key'): string =>
  selectByKey(columns, `astrology_${table}`, key);

export const selectPlanetRef = astrologyRef(KEYED_REF_COLUMNS, 'planets');
export const selectSignRef = astrologyRef(`${KEYED_REF_COLUMNS}, modality, element`, 'signs');
export const selectHouseRef = astrologyRef(`number, ${REF_COLUMNS}`, 'houses', 'number');
