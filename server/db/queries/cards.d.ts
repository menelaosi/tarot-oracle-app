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
export declare const selectCardDetails = "\n  SELECT c.id, c.name, c.arcana, c.suit, c.number,\n         c.meaning_upright, c.meaning_reversed,\n         s.element,\n         s.positive_associations AS suit_positive,\n         s.negative_associations AS suit_negative,\n         n.associations AS numerology,\n         cr.rank AS court_rank,\n         cr.description AS court_description,\n         cp.associations AS court_positive,\n         cn.associations AS court_negative,\n         m.element AS major_element,\n         m.planets AS major_planets,\n         m.signs AS major_signs,\n         m.positive_associations AS major_positive,\n         m.negative_associations AS major_negative,\n         m.representations AS major_representations\n  FROM cards c\n  LEFT JOIN suit_correspondences s ON s.suit = c.suit\n  LEFT JOIN numerology_correspondences n ON n.number = c.number\n  LEFT JOIN court_rank_correspondences cr ON cr.rank = CASE c.number\n    WHEN 11 THEN 'page'\n    WHEN 12 THEN 'knight'\n    WHEN 13 THEN 'queen'\n    WHEN 14 THEN 'king'\n  END\n  LEFT JOIN court_suit_correspondences cp\n    ON cp.rank = cr.rank AND cp.suit = c.suit AND cp.orientation = 'positive'\n  LEFT JOIN court_suit_correspondences cn\n    ON cn.rank = cr.rank AND cn.suit = c.suit AND cn.orientation = 'negative'\n  LEFT JOIN major_arcana_correspondences m ON m.card_id = c.id\n  WHERE c.id = $1\n";
export declare const selectRandomCards = "\n  SELECT id, name, image_path\n  FROM cards\n  ORDER BY random()\n  LIMIT 3\n";
//# sourceMappingURL=cards.d.ts.map