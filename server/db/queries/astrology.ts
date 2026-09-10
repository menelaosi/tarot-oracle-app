// Reference data lives in eight small tables (see server/schema.sql, seeded from
// Astrology.md), loaded once and rendered into the cached digest below.

import { insertInto } from './fragments.js';

type Glyphed = { key: string; name: string; glyph: string };
type Keyworded = { keywords: string[]; associations: string[] };

export type PlanetRow = Glyphed & Keyworded;
export type SignRow = PlanetRow & { modality: string; element: string; ruling_planet: string };
export type HouseRow = { number: number; name: string } & Keyworded;
export type AspectRow = Glyphed & { angle: number; meaning: string };
export type DignityRow = { planet_key: string; sign_key: string; dignity: string };
export type SignGroupRow = { key: string; name: string; keywords: string[]; signs: string[] };
export type NoteRow = { key: string; title: string; body: string };

function selectOrder(table: string, key: string = 'key'): string {
  return `SELECT * FROM astrology_${table} ORDER BY ${key}`;
}

// ORDER BY on every reference query keeps the serialized digest byte-stable
// across requests, so the cached system prefix actually hits (see lib/astrology-prompt.ts).
export const selectSigns = selectOrder('signs');
export const selectPlanets = selectOrder('planets');
export const selectHouses = selectOrder('houses', 'number');
export const selectAspects = selectOrder('aspects', 'angle');
export const selectDignities = selectOrder('dignities', 'planet_key, dignity, sign_key');
export const selectModalities = selectOrder('modalities');
export const selectElements = selectOrder('elements');
export const selectReferenceNotes = selectOrder('reference_notes');

/** The newest interpreted row of `table` whose reuse key matches `match`. */
const latestInterpretation = (table: string, match: string): string => `
  SELECT interpretation
  FROM ${table}
  WHERE ${match} AND interpretation IS NOT NULL
  ORDER BY created_at DESC
  LIMIT 1
`;

/** Most recent stored analysis for an identical chart, if one exists. */
export const selectExistingInterpretation = latestInterpretation(
  'astrology_readings',
  'summary = $1::jsonb',
);

export const insertAstrologyReading = insertInto('astrology_readings', [
  'birth_datetime',
  'latitude',
  'longitude',
  'place_label',
  'summary',
  'interpretation',
]);

/**
 * Stored transit reading for this exact natal chart on this calendar day, if
 * one exists. Transits move daily, so the date is part of the key — yesterday's
 * reading is never served for today.
 */
export const selectExistingTransitReading = latestInterpretation(
  'astrology_transit_readings',
  'natal_summary = $1::jsonb AND transit_date = $2::date',
);

export const insertTransitReading = insertInto('astrology_transit_readings', [
  'birth_datetime',
  'latitude',
  'longitude',
  'place_label',
  'transit_location',
  'transit_at',
  'transit_date::date',
  'natal_summary',
  'transit_summary',
  'interpretation',
]);

// The chart / transit summaries the client sends live in lib/astrology-schema.ts
// (zod schemas + inferred types).

// ---------------------------------------------------------------------------
// Reference digest
//
// The whole reference library is rendered once as a compact text block that
// goes in the cached system prefix, so the per-request body only carries the
// chart itself and Claude looks meanings up from the digest.
// ---------------------------------------------------------------------------

export type ReferenceRows = {
  signs: SignRow[];
  planets: PlanetRow[];
  houses: HouseRow[];
  aspects: AspectRow[];
  dignities: DignityRow[];
  modalities: SignGroupRow[];
  elements: SignGroupRow[];
  notes: NoteRow[];
};

const list = (items: string[]) => items.join(', ');

export function buildReferenceDigest(rows: ReferenceRows): string {
  const dignitiesByPlanet = new Map<string, string[]>();
  for (const row of rows.dignities) {
    const entries = dignitiesByPlanet.get(row.planet_key) ?? [];
    entries.push(`${row.dignity} in ${row.sign_key}`);
    dignitiesByPlanet.set(row.planet_key, entries);
  }

  return [
    'ASTROLOGY REFERENCE',
    '',
    'SIGNS (key — name | modality element | ruler | keywords | associations)',
    ...rows.signs.map(
      (s) =>
        `${s.key} — ${s.name} | ${s.modality} ${s.element} | ruled by ${s.ruling_planet} | ` +
        `${list(s.keywords)} | ${s.associations.join('; ')}`,
    ),
    '',
    'PLANETS & POINTS (key — name | keywords | associations)',
    ...rows.planets.map(
      (p) => `${p.key} — ${p.name} | ${list(p.keywords)} | ${p.associations.join('; ')}`,
    ),
    '',
    'HOUSES (number — name | keywords | associations)',
    ...rows.houses.map(
      (h) => `${h.number} — ${h.name} | ${list(h.keywords)} | ${h.associations.join('; ')}`,
    ),
    '',
    'ASPECTS (key, angle — meaning)',
    ...rows.aspects.map((a) => `${a.key}, ${a.angle}° — ${a.meaning}`),
    '',
    'PLANETARY DIGNITIES',
    ...[...dignitiesByPlanet].map(([planet, entries]) => `${planet}: ${list(entries)}`),
    '',
    'MODALITIES (name — keywords — signs)',
    ...rows.modalities.map((m) => `${m.name} — ${list(m.keywords)} — ${list(m.signs)}`),
    '',
    'ELEMENTS (name — keywords — signs)',
    ...rows.elements.map((e) => `${e.name} — ${list(e.keywords)} — ${list(e.signs)}`),
    '',
    'NOTES',
    ...rows.notes.map((n) => `${n.title}: ${n.body}`),
  ].join('\n');
}
