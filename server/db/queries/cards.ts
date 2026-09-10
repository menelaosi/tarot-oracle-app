// SQL for the cards routes, plus the row -> DTO mapper. selectCardDetails
// LEFT JOINs every correspondence table so a card with sparse data still
// returns; the array columns are COALESCEd to '{}', so a miss is an empty
// array, not null, and toCardDetails is a straight snake_case -> camelCase remap.

import { CARD_CORRESPONDENCE_JOINS } from './fragments.js';

export type CardDetailsRow = {
  id: number;
  name: string;
  arcana: 'major' | 'minor';
  suit: string | null;
  number: number | null;
  meaning_upright: string;
  meaning_reversed: string;
  element: string | null;
  suit_positive: string[];
  suit_negative: string[];
  numerology: string[];
  court_rank: string | null;
  court_description: string | null;
  court_positive: string[];
  court_negative: string[];
  major_element: string | null;
  major_core_theme: string | null;
  major_planets: string[];
  major_signs: string[];
  major_positive: string[];
  major_negative: string[];
  major_representations: string[];
};

export type DrawnCardRow = {
  id: number;
  name: string;
  imagePath: string;
  orientation: 'upright' | 'reversed';
  position: number;
};

export type CardDetailsDto = {
  id: number;
  name: string;
  arcana: 'major' | 'minor';
  suit: string | null;
  number: number | null;
  meaningUpright: string;
  meaningReversed: string;
  element: string | null;
  suitPositiveAssociations: string[];
  suitNegativeAssociations: string[];
  numerologyAssociations: string[];
  courtRank: string | null;
  courtDescription: string | null;
  courtPositiveAssociations: string[];
  courtNegativeAssociations: string[];
  majorElement: string | null;
  majorCoreTheme: string | null;
  majorPlanets: string[];
  majorSigns: string[];
  majorPositiveAssociations: string[];
  majorNegativeAssociations: string[];
  majorRepresentations: string[];
};

/** Row (snake_case) -> client DTO (camelCase). Arrays are already `[]`-safe from the query. */
export function toCardDetails({
  id,
  name,
  arcana,
  suit,
  number,
  meaning_upright: meaningUpright,
  meaning_reversed: meaningReversed,
  element,
  suit_positive: suitPositiveAssociations,
  suit_negative: suitNegativeAssociations,
  numerology: numerologyAssociations,
  court_rank: courtRank,
  court_description: courtDescription,
  court_positive: courtPositiveAssociations,
  court_negative: courtNegativeAssociations,
  major_element: majorElement,
  major_core_theme: majorCoreTheme,
  major_planets: majorPlanets,
  major_signs: majorSigns,
  major_positive: majorPositiveAssociations,
  major_negative: majorNegativeAssociations,
  major_representations: majorRepresentations,
}: CardDetailsRow): CardDetailsDto {
  return {
    id,
    name,
    arcana,
    suit,
    number,
    meaningUpright,
    meaningReversed,
    element,
    suitPositiveAssociations,
    suitNegativeAssociations,
    numerologyAssociations,
    courtRank,
    courtDescription,
    courtPositiveAssociations,
    courtNegativeAssociations,
    majorElement,
    majorCoreTheme,
    majorPlanets,
    majorSigns,
    majorPositiveAssociations,
    majorNegativeAssociations,
    majorRepresentations,
  };
}

export const selectCardDetails = `
  SELECT c.id, c.name, c.arcana, c.suit, c.number,
         c.meaning_upright, c.meaning_reversed,
         s.element,
         COALESCE(s.positive_associations, '{}'::text[]) AS suit_positive,
         COALESCE(s.negative_associations, '{}'::text[]) AS suit_negative,
         COALESCE(n.associations, '{}'::text[]) AS numerology,
         cr.rank AS court_rank,
         cr.description AS court_description,
         COALESCE(cp.associations, '{}'::text[]) AS court_positive,
         COALESCE(cn.associations, '{}'::text[]) AS court_negative,
         m.element AS major_element,
         m.core_theme AS major_core_theme,
         COALESCE(m.planets, '{}'::text[]) AS major_planets,
         COALESCE(m.signs, '{}'::text[]) AS major_signs,
         COALESCE(m.positive_associations, '{}'::text[]) AS major_positive,
         COALESCE(m.negative_associations, '{}'::text[]) AS major_negative,
         COALESCE(m.representations, '{}'::text[]) AS major_representations
  FROM cards c${CARD_CORRESPONDENCE_JOINS}
  WHERE c.id = $1
`;

export const selectRandomCards = `
  SELECT id, name, image_path
  FROM cards
  ORDER BY random()
  LIMIT $1
`;
