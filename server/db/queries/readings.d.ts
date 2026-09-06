export type ReadingRow = {
    id: string;
    question: string | null;
};
export type InterpretationCardRow = {
    question: string | null;
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
export declare const insertReading = "\n  INSERT INTO readings (spread_type, question)\n  VALUES ($1, $2)\n  RETURNING id, question\n";
export declare const insertReadingCard = "\n  INSERT INTO reading_cards (reading_id, card_id, position, orientation)\n  VALUES ($1, $2, $3, $4)\n";
export declare const selectDrawnCards = "\n  SELECT c.id, c.name, c.image_path AS \"imagePath\", rc.orientation, rc.position\n  FROM reading_cards rc\n  JOIN cards c ON c.id = rc.card_id\n  WHERE rc.reading_id = $1\n  ORDER BY rc.position\n";
export declare const selectInterpretationCards = "\n  SELECT r.question, rc.position, rc.orientation, c.name,\n         c.meaning_upright, c.meaning_reversed, c.suit, c.number,\n         s.element, s.positive_associations AS suit_positive,\n         s.negative_associations AS suit_negative,\n         n.associations AS number_associations,\n         cr.rank AS court_rank,\n         cr.description AS court_description,\n         cp.associations AS court_positive,\n         cn.associations AS court_negative,\n         m.element AS major_element,\n         m.planets AS major_planets,\n         m.signs AS major_signs,\n         m.positive_associations AS major_positive,\n         m.negative_associations AS major_negative,\n         m.representations\n  FROM readings r\n  JOIN reading_cards rc ON rc.reading_id = r.id\n  JOIN cards c ON c.id = rc.card_id\n  LEFT JOIN suit_correspondences s ON s.suit = c.suit\n  LEFT JOIN numerology_correspondences n ON n.number = c.number\n  LEFT JOIN court_rank_correspondences cr ON cr.rank = CASE c.number\n    WHEN 11 THEN 'page'\n    WHEN 12 THEN 'knight'\n    WHEN 13 THEN 'queen'\n    WHEN 14 THEN 'king'\n  END\n  LEFT JOIN court_suit_correspondences cp\n    ON cp.rank = cr.rank AND cp.suit = c.suit AND cp.orientation = 'positive'\n  LEFT JOIN court_suit_correspondences cn\n    ON cn.rank = cr.rank AND cn.suit = c.suit AND cn.orientation = 'negative'\n  LEFT JOIN major_arcana_correspondences m ON m.card_id = c.id\n  WHERE r.id = $1\n  ORDER BY rc.position\n";
export declare const updateInterpretation = "\n  UPDATE readings\n  SET interpretation = $1\n  WHERE id = $2\n";
//# sourceMappingURL=readings.d.ts.map