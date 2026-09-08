// Reference data lives in eight small tables (see server/schema.sql, seeded from
// Astrology.md). The interpret route loads them once, builds lookup maps, and
// enriches each placement in the client-supplied chart summary.

export type SignRow = {
  key: string;
  name: string;
  glyph: string;
  modality: string;
  element: string;
  ruling_planet: string;
  keywords: string[];
  associations: string[];
};

export type PlanetRow = {
  key: string;
  name: string;
  glyph: string;
  keywords: string[];
  associations: string[];
};

export type HouseRow = {
  number: number;
  name: string;
  keywords: string[];
  associations: string[];
};

export type AspectRow = {
  key: string;
  name: string;
  glyph: string;
  angle: number;
  meaning: string;
};

export type DignityRow = { planet_key: string; sign_key: string; dignity: string };

export type ModalityRow = { key: string; name: string; keywords: string[]; signs: string[] };
export type ElementRow = { key: string; name: string; keywords: string[]; signs: string[] };
export type NoteRow = { key: string; title: string; body: string };

// ORDER BY on every reference query keeps the serialized digest byte-stable
// across requests, so the cached system prefix actually hits (see routes/astrology.ts).
export const selectSigns = 'SELECT * FROM astrology_signs ORDER BY key';
export const selectPlanets = 'SELECT * FROM astrology_planets ORDER BY key';
export const selectHouses = 'SELECT * FROM astrology_houses ORDER BY number';
export const selectAspects = 'SELECT * FROM astrology_aspects ORDER BY angle';
export const selectDignities = 'SELECT * FROM astrology_dignities ORDER BY planet_key, dignity, sign_key';
export const selectModalities = 'SELECT * FROM astrology_modalities ORDER BY key';
export const selectElements = 'SELECT * FROM astrology_elements ORDER BY key';
export const selectReferenceNotes = 'SELECT * FROM astrology_reference_notes ORDER BY key';

/** Most recent stored analysis for an identical chart, if one exists. */
export const selectExistingInterpretation = `
  SELECT interpretation
  FROM astrology_readings
  WHERE summary = $1::jsonb AND interpretation IS NOT NULL
  ORDER BY created_at DESC
  LIMIT 1
`;

export const insertAstrologyReading = `
  INSERT INTO astrology_readings
    (birth_datetime, latitude, longitude, place_label, summary, interpretation)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING id
`;

// ---------------------------------------------------------------------------
// Chart summary sent by the client (client/src/features/astrology/lib/chartSummary.ts)
// ---------------------------------------------------------------------------

export type Placement = {
  body: string;
  sign: string;
  house: number | null;
  degree: number;
  degreeInSign: number;
  retrograde: boolean;
};

export type AngleSummary = { sign: string; degree: number };

export type AspectSummary = { from: string; to: string; type: string; orb: number };

export type ChartSummary = {
  birth: { dateTime: string; latitude: number; longitude: number; placeLabel: string };
  placements: Placement[];
  angles: {
    ascendant: AngleSummary;
    midheaven: AngleSummary;
    descendant: AngleSummary;
    imumCoeli: AngleSummary;
  };
  aspects: AspectSummary[];
};

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
  modalities: ModalityRow[];
  elements: ElementRow[];
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
