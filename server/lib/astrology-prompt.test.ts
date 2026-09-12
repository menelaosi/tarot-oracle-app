import { describe, expect, it } from 'vitest';
import { chartReadingRequest, transitReadingRequest } from './astrology-prompt.js';
import type { ChartSummary, TransitSummary } from './astrology-schema.js';

const angle = (degree: number) => ({ sign: 'cancer', degree });

const chart: ChartSummary = {
  birth: {
    dateTime: '1990-06-15T08:30:00',
    latitude: 40.7128,
    longitude: -74.006,
    placeLabel: 'New York, NY',
  },
  placements: [
    {
      body: 'sun',
      sign: 'gemini',
      house: 11,
      degree: 84.1488,
      degreeInSign: 24.1488,
      retrograde: false,
    },
    {
      body: 'saturn',
      sign: 'capricorn',
      house: 6,
      degree: 278.5,
      degreeInSign: 8.5,
      retrograde: true,
    },
  ],
  angles: {
    ascendant: angle(122.5725),
    midheaven: angle(30.5),
    descendant: angle(302.5725),
    imumCoeli: angle(210.5),
  },
  aspects: [
    { from: 'sun', to: 'moon', type: 'trine', orb: 2.567 },
    { from: 'sun', to: 'mars', type: 'quincunx', orb: 0.5 }, // not a Ptolemaic aspect
  ],
};

function parsedPrompt(prompt: string): unknown {
  const json = prompt.split('\n').slice(1).join('\n');
  return JSON.parse(json);
}

describe('chartReadingRequest', () => {
  const request = chartReadingRequest(chart);

  it('labels the request "birthchart"', () => {
    expect(request.label).toBe('birthchart');
  });

  it('prefixes the prompt with "CHART" on its own line', () => {
    expect(request.prompt.startsWith('CHART\n')).toBe(true);
  });

  it('carries the birth date/time and place label, but not lat/long', () => {
    const payload = parsedPrompt(request.prompt) as { birth: unknown };
    expect(payload.birth).toEqual({ dateTime: '1990-06-15T08:30:00', place: 'New York, NY' });
  });

  it('falls back to a null place when placeLabel is empty', () => {
    const noLabel = chartReadingRequest({
      ...chart,
      birth: { ...chart.birth, placeLabel: '' },
    });
    const payload = parsedPrompt(noLabel.prompt) as { birth: { place: string | null } };
    expect(payload.birth.place).toBeNull();
  });

  it('maps each placement to body/sign/house/degreeInSign/retrograde, dropping the raw degree', () => {
    const payload = parsedPrompt(request.prompt) as { placements: unknown[] };
    expect(payload.placements).toEqual([
      { body: 'sun', sign: 'gemini', house: 11, degreeInSign: 24.15, retrograde: false },
      { body: 'saturn', sign: 'capricorn', house: 6, degreeInSign: 8.5, retrograde: true },
    ]);
  });

  it("recomputes each angle's degreeInSign from its raw degree mod 30, rounded to 2 places", () => {
    const payload = parsedPrompt(request.prompt) as {
      angles: Record<string, { sign: string; degreeInSign: number }>;
    };
    // 122.5725 % 30 = 2.5725 -> rounds to 2.57
    expect(payload.angles.ascendant).toEqual({ sign: 'cancer', degreeInSign: 2.57 });
  });

  it('keeps only the five Ptolemaic aspect types, dropping quincunx and friends', () => {
    const payload = parsedPrompt(request.prompt) as { aspects: { type: string }[] };
    expect(payload.aspects).toHaveLength(1);
    expect(payload.aspects[0]).toEqual({ from: 'sun', to: 'moon', type: 'trine', orb: 2.6 });
  });

  it('rounds an aspect orb to 1 decimal place', () => {
    const payload = parsedPrompt(request.prompt) as { aspects: { orb: number }[] };
    expect(payload.aspects[0]?.orb).toBe(2.6);
  });
});

const transit: TransitSummary = {
  at: '2024-01-01T12:00:00Z',
  date: '2024-01-01',
  location: { latitude: 41, longitude: -75, label: 'Nearby, NY' },
  transitingPlacements: [
    { body: 'moon', sign: 'aries', degreeInSign: 15.333, retrograde: false, natalHouse: 3 },
  ],
  contacts: [
    { transiting: 'moon', natal: 'sun', type: 'square', orb: 1.05, applying: true },
    { transiting: 'venus', natal: 'mars', type: 'quintile', orb: 0.2, applying: false },
  ],
};

describe('transitReadingRequest', () => {
  const request = transitReadingRequest(chart, transit);

  it('labels the request "transit"', () => {
    expect(request.label).toBe('transit');
  });

  it('prefixes the prompt with "TODAY FOR THIS CHART"', () => {
    expect(request.prompt.startsWith('TODAY FOR THIS CHART\n')).toBe(true);
  });

  it("uses the transit's own location label over the natal place label", () => {
    const payload = parsedPrompt(request.prompt) as { for: { place: string | null } };
    expect(payload.for.place).toBe('Nearby, NY');
  });

  it('falls back to the natal place label when the transit location has none', () => {
    const noLabel = transitReadingRequest(chart, {
      ...transit,
      location: { ...transit.location, label: null },
    });
    const payload = parsedPrompt(noLabel.prompt) as { for: { place: string | null } };
    expect(payload.for.place).toBe('New York, NY');
  });

  it('embeds the full natal chart payload under "natal"', () => {
    const payload = parsedPrompt(request.prompt) as { natal: { placements: unknown[] } };
    expect(payload.natal.placements).toHaveLength(2);
  });

  it('maps transiting placements, rounding degreeInSign', () => {
    const payload = parsedPrompt(request.prompt) as { transiting: { degreeInSign: number }[] };
    expect(payload.transiting[0]?.degreeInSign).toBe(15.33);
  });

  it('keeps only Ptolemaic-type contacts, dropping quintile', () => {
    const payload = parsedPrompt(request.prompt) as { contacts: { type: string }[] };
    expect(payload.contacts).toHaveLength(1);
    expect(payload.contacts[0]?.type).toBe('square');
  });
});
