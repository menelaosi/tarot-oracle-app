// SQL for the readings routes. selectInterpretationCards joins each drawn
// card to its correspondences so one query feeds the whole Claude prompt.

export type ReadingRow = {
  id: string;
  question: string | null;
};

export type CardResultRow = {
  id: number;
  name: string;
  image_path: string;
};

export type InterpretationCardRow = {
  question: string | null;
  spread_type: string;
  position: number;
  orientation: 'upright' | 'reversed';
  name: string;
  meaning_upright: string;
  meaning_reversed: string;
  suit: string | null;
  number: number | null;
  element: string | null;
  suit_positive: string[] | null;
  suit_negative: string[] | null;
  number_associations: string[] | null;
  court_rank: string | null;
  court_description: string | null;
  court_positive: string[] | null;
  court_negative: string[] | null;
  major_element: string | null;
  major_planets: string[] | null;
  major_signs: string[] | null;
  major_positive: string[] | null;
  major_negative: string[] | null;
  representations: string[] | null;
};

export const insertReading = `
  INSERT INTO readings (spread_type, question)
  VALUES ($1, $2)
  RETURNING id, question
`;

export const insertReadingCard = `
  INSERT INTO reading_cards (reading_id, card_id, position, orientation)
  VALUES ($1, $2, $3, $4)
`;

export const selectDrawnCards = `
  SELECT c.id, c.name, c.image_path AS "imagePath", rc.orientation, rc.position
  FROM reading_cards rc
  JOIN cards c ON c.id = rc.card_id
  WHERE rc.reading_id = $1
  ORDER BY rc.position
`;

export const selectInterpretationCards = `
  SELECT r.question, r.spread_type, rc.position, rc.orientation, c.name,
         c.meaning_upright, c.meaning_reversed, c.suit, c.number,
         s.element, s.positive_associations AS suit_positive,
         s.negative_associations AS suit_negative,
         n.associations AS number_associations,
         cr.rank AS court_rank,
         cr.description AS court_description,
         cp.associations AS court_positive,
         cn.associations AS court_negative,
         m.element AS major_element,
         m.planets AS major_planets,
         m.signs AS major_signs,
         m.positive_associations AS major_positive,
         m.negative_associations AS major_negative,
         m.representations
  FROM readings r
  JOIN reading_cards rc ON rc.reading_id = r.id
  JOIN cards c ON c.id = rc.card_id
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
  WHERE r.id = $1
  ORDER BY rc.position
`;

export const updateInterpretation = `
  UPDATE readings
  SET interpretation = $1
  WHERE id = $2
`;
