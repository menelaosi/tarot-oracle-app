// SQL for the cards routes, plus the row -> DTO mapper. selectCardDetails
// LEFT JOINs every correspondence table so a card with sparse data still
// returns (nulls / empty arrays), which toCardDetails normalizes.

export type CardDetailsRow = {
  id: number;
  name: string;
  arcana: 'major' | 'minor';
  suit: string | null;
  number: number | null;
  meaning_upright: string;
  meaning_reversed: string;
  element: string | null;
  suit_positive: string[] | null;
  suit_negative: string[] | null;
  numerology: string[] | null;
  court_rank: string | null;
  court_description: string | null;
  court_positive: string[] | null;
  court_negative: string[] | null;
  major_element: string | null;
  major_core_theme: string | null;
  major_planets: string[] | null;
  major_signs: string[] | null;
  major_positive: string[] | null;
  major_negative: string[] | null;
  major_representations: string[] | null;
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

/** Row (snake_case, nullable) -> client DTO (camelCase, arrays defaulted to []). */
export function toCardDetails(row: CardDetailsRow): CardDetailsDto {
  return {
    id: row.id,
    name: row.name,
    arcana: row.arcana,
    suit: row.suit,
    number: row.number,
    meaningUpright: row.meaning_upright,
    meaningReversed: row.meaning_reversed,
    element: row.element,
    suitPositiveAssociations: row.suit_positive ?? [],
    suitNegativeAssociations: row.suit_negative ?? [],
    numerologyAssociations: row.numerology ?? [],
    courtRank: row.court_rank,
    courtDescription: row.court_description,
    courtPositiveAssociations: row.court_positive ?? [],
    courtNegativeAssociations: row.court_negative ?? [],
    majorElement: row.major_element,
    majorCoreTheme: row.major_core_theme,
    majorPlanets: row.major_planets ?? [],
    majorSigns: row.major_signs ?? [],
    majorPositiveAssociations: row.major_positive ?? [],
    majorNegativeAssociations: row.major_negative ?? [],
    majorRepresentations: row.major_representations ?? [],
  };
}

export const selectCardDetails = `
  SELECT c.id, c.name, c.arcana, c.suit, c.number,
         c.meaning_upright, c.meaning_reversed,
         s.element,
         s.positive_associations AS suit_positive,
         s.negative_associations AS suit_negative,
         n.associations AS numerology,
         cr.rank AS court_rank,
         cr.description AS court_description,
         cp.associations AS court_positive,
         cn.associations AS court_negative,
         m.element AS major_element,
         m.core_theme AS major_core_theme,
         m.planets AS major_planets,
         m.signs AS major_signs,
         m.positive_associations AS major_positive,
         m.negative_associations AS major_negative,
         m.representations AS major_representations
  FROM cards c
  LEFT JOIN suit_correspondences s ON s.suit = c.suit
  LEFT JOIN numerology_correspondences n ON n.number = c.number
  LEFT JOIN court_rank_correspondences cr ON cr.rank = CASE c.number
    WHEN 11 THEN 'page'
    WHEN 12 THEN 'knight'
    WHEN 13 THEN 'queen'
    WHEN 14 THEN 'king'
  END
  LEFT JOIN court_suit_correspondences cp
    ON cp.rank = cr.rank AND cp.suit = c.suit AND cp.orientation = 'positive'
  LEFT JOIN court_suit_correspondences cn
    ON cn.rank = cr.rank AND cn.suit = c.suit AND cn.orientation = 'negative'
  LEFT JOIN major_arcana_correspondences m ON m.card_id = c.id
  WHERE c.id = $1
`;

export const selectRandomCards = `
  SELECT id, name, image_path
  FROM cards
  ORDER BY random()
  LIMIT $1
`;
