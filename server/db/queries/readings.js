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
  SELECT r.question, rc.position, rc.orientation, c.name,
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
//# sourceMappingURL=readings.js.map