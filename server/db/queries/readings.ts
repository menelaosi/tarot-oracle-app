// SQL for the readings routes. selectInterpretationCards joins each drawn
// card to its correspondences so one query feeds the whole Claude prompt.

import { CARD_CORRESPONDENCE_JOINS, insertInto, setInterpretation } from './fragments.js';

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
  suit_positive: string[];
  suit_negative: string[];
  number_associations: string[];
  court_rank: string | null;
  court_description: string | null;
  court_positive: string[];
  court_negative: string[];
  major_element: string | null;
  major_planets: string[];
  major_signs: string[];
  major_positive: string[];
  major_negative: string[];
  representations: string[];
};

export const insertReading = insertInto('readings', ['spread_type', 'question'], 'id, question');

export const insertReadingCard = insertInto('reading_cards', [
  'reading_id',
  'card_id',
  'position',
  'orientation',
]);

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
         s.element,
         COALESCE(s.positive_associations, '{}'::text[]) AS suit_positive,
         COALESCE(s.negative_associations, '{}'::text[]) AS suit_negative,
         COALESCE(n.associations, '{}'::text[]) AS number_associations,
         cr.rank AS court_rank,
         cr.description AS court_description,
         COALESCE(cp.associations, '{}'::text[]) AS court_positive,
         COALESCE(cn.associations, '{}'::text[]) AS court_negative,
         m.element AS major_element,
         COALESCE(m.planets, '{}'::text[]) AS major_planets,
         COALESCE(m.signs, '{}'::text[]) AS major_signs,
         COALESCE(m.positive_associations, '{}'::text[]) AS major_positive,
         COALESCE(m.negative_associations, '{}'::text[]) AS major_negative,
         COALESCE(m.representations, '{}'::text[]) AS representations
  FROM readings r
  JOIN reading_cards rc ON rc.reading_id = r.id
  JOIN cards c ON c.id = rc.card_id${CARD_CORRESPONDENCE_JOINS}
  WHERE r.id = $1
  ORDER BY rc.position
`;

export const updateInterpretation = setInterpretation('readings');
