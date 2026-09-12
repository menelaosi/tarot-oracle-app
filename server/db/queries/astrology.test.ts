import { describe, expect, it } from 'vitest';
import { buildReferenceDigest, type ReferenceRows } from './astrology.js';

const rows: ReferenceRows = {
  signs: [
    {
      key: 'aries',
      name: 'Aries',
      glyph: '♈',
      modality: 'cardinal',
      element: 'fire',
      ruling_planet: 'mars',
      keywords: ['bold', 'direct'],
      associations: ['New starts'],
    },
  ],
  planets: [
    { key: 'sun', name: 'Sun', glyph: '☉', keywords: ['vitality'], associations: ['The ego'] },
    { key: 'chiron', name: 'Chiron', glyph: '⚷', keywords: [], associations: [] },
  ],
  houses: [{ number: 1, name: '1st House', keywords: ['self'], associations: ['Appearance'] }],
  aspects: [{ key: 'trine', name: 'Trine', glyph: '△', angle: 120, meaning: 'flowing energy' }],
  dignities: [
    { planet_key: 'sun', sign_key: 'leo', dignity: 'rulership' },
    { planet_key: 'sun', sign_key: 'aries', dignity: 'exaltation' },
    { planet_key: 'moon', sign_key: 'cancer', dignity: 'rulership' },
  ],
  modalities: [{ key: 'cardinal', name: 'Cardinal', keywords: ['initiating'], signs: ['aries'] }],
  elements: [{ key: 'fire', name: 'Fire', keywords: ['passionate'], signs: ['aries'] }],
  notes: [{ key: 'note1', title: 'A note', body: 'Some body text.' }],
};

describe('buildReferenceDigest', () => {
  const digest = buildReferenceDigest(rows);

  it('includes a labeled section for each reference category', () => {
    for (const heading of [
      'SIGNS',
      'PLANETS & POINTS',
      'HOUSES',
      'ASPECTS',
      'PLANETARY DIGNITIES',
      'MODALITIES',
      'ELEMENTS',
      'NOTES',
    ]) {
      expect(digest).toContain(heading);
    }
  });

  it('renders a sign line with modality, element, ruler, keywords, and associations', () => {
    expect(digest).toContain(
      'aries — Aries | cardinal fire | ruled by mars | bold, direct | New starts',
    );
  });

  it('renders a planet line, including one with empty keywords/associations', () => {
    expect(digest).toContain('sun — Sun | vitality | The ego');
    expect(digest).toContain('chiron — Chiron |  | ');
  });

  it('groups every dignity by planet, in "dignity in sign" form', () => {
    expect(digest).toContain('sun: rulership in leo, exaltation in aries');
    expect(digest).toContain('moon: rulership in cancer');
  });

  it('renders an aspect line with its angle and meaning', () => {
    expect(digest).toContain('trine, 120° — flowing energy');
  });

  it('is byte-identical across two calls with the same input (prompt-cache stability)', () => {
    expect(buildReferenceDigest(rows)).toBe(digest);
  });

  it('changes when a planet gains keyword content — proves the digest is not stuck on stale data', () => {
    const [sun, chiron] = rows.planets;
    const updated: ReferenceRows = {
      ...rows,
      planets: [sun!, { ...chiron!, keywords: ['healing'], associations: ['The wounded healer'] }],
    };
    expect(buildReferenceDigest(updated)).not.toBe(digest);
    expect(buildReferenceDigest(updated)).toContain(
      'chiron — Chiron | healing | The wounded healer',
    );
  });
});
