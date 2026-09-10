// SQL fragments shared across query files. Keeping the repeated pieces in one
// place so a schema change (a new correspondence table, a renamed column) is a
// single edit.

/**
 * The correspondence LEFT JOINs for a card aliased `c`. Appended after the base
 * `FROM cards c` (card details) or `JOIN cards c …` (a drawn reading) — both
 * `selectCardDetails` and `selectInterpretationCards` pull the same joined data.
 */
export const CARD_CORRESPONDENCE_JOINS = `
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
  LEFT JOIN major_arcana_correspondences m ON m.card_id = c.id`;

/** `UPDATE <table> SET interpretation = $1 WHERE id = $2` — the one write every reading has. */
export const setInterpretation = (table: string): string =>
  `UPDATE ${table} SET interpretation = $1 WHERE id = $2`;

/** Prefixes each column in a `"a, b, c"` list with a table alias: `"t.a, t.b, t.c"`. */
export const withAlias = (columns: string, alias: string): string =>
  columns
    .split(', ')
    .map((column) => `${alias}.${column}`)
    .join(', ');
