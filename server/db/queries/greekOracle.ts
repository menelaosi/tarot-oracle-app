// SQL for the Greek Alphabet Oracle routes. The 24 letters are static reference
// data (server/seed.sql); a reading stores the drawn letter and, later, Claude's
// interpretation of it.

export type GreekLetterRow = {
  letter: string;
  name: string;
  position: number;
  oracle: string;
  meaning: string;
  keywords: string[];
};

export type GreekReadingRow = {
  id: string;
  question: string | null;
  interpretation: string | null;
} & GreekLetterRow;

const LETTER_COLUMNS = 'letter, name, position, oracle, meaning, keywords';

/** One random letter — the "draw a stone from the bag" step. */
export const selectRandomLetter = `
  SELECT ${LETTER_COLUMNS}
  FROM greek_oracle_letters
  ORDER BY random()
  LIMIT 1
`;

export const insertGreekReading = `
  INSERT INTO greek_oracle_readings (question, letter)
  VALUES ($1, $2)
  RETURNING id, question
`;

/** A reading joined to its letter — everything the interpret prompt needs. */
export const selectGreekReading = `
  SELECT r.id, r.question, r.interpretation,
         l.letter, l.name, l.position, l.oracle, l.meaning, l.keywords
  FROM greek_oracle_readings r
  JOIN greek_oracle_letters l ON l.letter = r.letter
  WHERE r.id = $1
`;

export const updateGreekInterpretation = `
  UPDATE greek_oracle_readings
  SET interpretation = $1
  WHERE id = $2
`;
