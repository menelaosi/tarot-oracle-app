import { describe, expect, it } from 'vitest';
import { assertChartSummary, assertTransitSummary } from './astrology-schema.js';
import { HttpError } from './http-error.js';

const validPlacement = {
  body: 'sun',
  sign: 'gemini',
  house: 10,
  degree: 84.15,
  degreeInSign: 24.15,
  retrograde: false,
};

const validAngle = { sign: 'cancer', degree: 122.57 };

const validChartSummary = {
  birth: {
    dateTime: '1990-06-15T08:30:00',
    latitude: 40.7128,
    longitude: -74.006,
    placeLabel: 'New York, NY',
  },
  placements: [validPlacement],
  angles: {
    ascendant: validAngle,
    midheaven: validAngle,
    descendant: validAngle,
    imumCoeli: validAngle,
  },
  aspects: [{ from: 'sun', to: 'moon', type: 'trine', orb: 2.5 }],
};

describe('assertChartSummary', () => {
  it('accepts a well-formed chart summary without throwing', () => {
    expect(() => assertChartSummary(validChartSummary)).not.toThrow();
  });

  it('accepts zero aspects — aspects has no .min()', () => {
    expect(() => assertChartSummary({ ...validChartSummary, aspects: [] })).not.toThrow();
  });

  it('rejects an empty placements array', () => {
    expect(() => assertChartSummary({ ...validChartSummary, placements: [] })).toThrow(HttpError);
  });

  it('rejects a missing top-level field', () => {
    const withoutAngles = {
      birth: validChartSummary.birth,
      placements: validChartSummary.placements,
      aspects: validChartSummary.aspects,
    };
    expect(() => assertChartSummary(withoutAngles)).toThrow(HttpError);
  });

  it('rejects a placement whose degree is a string instead of a number', () => {
    const malformed = {
      ...validChartSummary,
      placements: [{ ...validPlacement, degree: '84.15' }],
    };
    expect(() => assertChartSummary(malformed)).toThrow(HttpError);
  });

  it('throws a 400 with a stable, user-facing message', () => {
    try {
      assertChartSummary(null);
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect((error as HttpError).status).toBe(400);
      expect((error as HttpError).message).toBe('A valid chart summary is required.');
    }
  });

  it('allows house to be null (unhoused points like the angles do not use it)', () => {
    const withNullHouse = {
      ...validChartSummary,
      placements: [{ ...validPlacement, house: null }],
    };
    expect(() => assertChartSummary(withNullHouse)).not.toThrow();
  });
});

const validTransitSummary = {
  at: '2024-01-01T12:00:00Z',
  date: '2024-01-01',
  location: { latitude: 40.7128, longitude: -74.006, label: 'New York, NY' },
  transitingPlacements: [
    { body: 'sun', sign: 'capricorn', degreeInSign: 10, retrograde: false, natalHouse: 4 },
  ],
  contacts: [{ transiting: 'sun', natal: 'moon', type: 'square', orb: 1.2, applying: true }],
};

describe('assertTransitSummary', () => {
  it('accepts a well-formed transit summary without throwing', () => {
    expect(() => assertTransitSummary(validTransitSummary)).not.toThrow();
  });

  it('rejects a date not in YYYY-MM-DD form', () => {
    expect(() => assertTransitSummary({ ...validTransitSummary, date: '01/01/2024' })).toThrow(
      HttpError,
    );
  });

  it('rejects an empty transitingPlacements array', () => {
    expect(() =>
      assertTransitSummary({ ...validTransitSummary, transitingPlacements: [] }),
    ).toThrow(HttpError);
  });

  it('accepts zero contacts — contacts has no .min()', () => {
    expect(() => assertTransitSummary({ ...validTransitSummary, contacts: [] })).not.toThrow();
  });

  it('allows location.label to be null (no reverse-geocoded label yet)', () => {
    const withNullLabel = {
      ...validTransitSummary,
      location: { ...validTransitSummary.location, label: null },
    };
    expect(() => assertTransitSummary(withNullLabel)).not.toThrow();
  });

  it('throws a 400 with a stable, user-facing message', () => {
    try {
      assertTransitSummary(undefined);
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect((error as HttpError).status).toBe(400);
      expect((error as HttpError).message).toBe('A valid transit summary is required.');
    }
  });
});
