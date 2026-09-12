import { describe, expect, it } from 'vitest';
import { toCardDetails, type CardDetailsRow } from './cards.js';

const row: CardDetailsRow = {
  id: 1,
  name: 'The Fool',
  arcana: 'major',
  suit: null,
  number: 0,
  meaning_upright: 'New beginnings',
  meaning_reversed: 'Recklessness',
  element: null,
  suit_positive: [],
  suit_negative: [],
  numerology: [],
  court_rank: null,
  court_description: null,
  court_positive: [],
  court_negative: [],
  major_element: 'air',
  major_core_theme: 'Potential',
  major_planets: ['Uranus'],
  major_signs: [],
  major_positive: ['Spontaneity'],
  major_negative: ['Naivety'],
  major_representations: ['The innocent'],
};

describe('toCardDetails', () => {
  it('remaps every snake_case column to its camelCase DTO field', () => {
    expect(toCardDetails(row)).toEqual({
      id: 1,
      name: 'The Fool',
      arcana: 'major',
      suit: null,
      number: 0,
      meaningUpright: 'New beginnings',
      meaningReversed: 'Recklessness',
      element: null,
      suitPositiveAssociations: [],
      suitNegativeAssociations: [],
      numerologyAssociations: [],
      courtRank: null,
      courtDescription: null,
      courtPositiveAssociations: [],
      courtNegativeAssociations: [],
      majorElement: 'air',
      majorCoreTheme: 'Potential',
      majorPlanets: ['Uranus'],
      majorSigns: [],
      majorPositiveAssociations: ['Spontaneity'],
      majorNegativeAssociations: ['Naivety'],
      majorRepresentations: ['The innocent'],
    });
  });

  it('passes array values through by reference rather than copying', () => {
    const dto = toCardDetails(row);
    expect(dto.majorPlanets).toBe(row.major_planets);
  });

  it('preserves a suited minor-arcana row with a non-null suit/number', () => {
    const minor: CardDetailsRow = {
      ...row,
      arcana: 'minor',
      suit: 'cups',
      number: 3,
      court_rank: null,
    };
    const dto = toCardDetails(minor);
    expect(dto.arcana).toBe('minor');
    expect(dto.suit).toBe('cups');
    expect(dto.number).toBe(3);
  });
});
