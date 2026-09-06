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
  major_representations: string[] | null;
};

export type DrawnCardRow = {
  id: number;
  name: string;
  imagePath: string;
  orientation: 'upright' | 'reversed';
  position: number;
};

export const selectCardDetails = `
  SELECT c.id, c.name, c.arcana, c.suit, c.number,
         c.meaning_upright, c.meaning_reversed,
         s.element,
         s.positive_associations AS suit_positive,
         s.negative_associations AS suit_negative,
         n.associations AS numerology,
         cr.rank AS court_rank,
         cr.description AS court_description,
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
  LEFT JOIN major_arcana_correspondences m ON m.card_id = c.id
  WHERE c.id = $1
`;

export const selectRandomCards = `
  SELECT id, name, image_path
  FROM cards
  ORDER BY random()
  LIMIT 3
`;
