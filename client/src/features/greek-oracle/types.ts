// Shapes returned by the Greek Alphabet Oracle API (server/routes/greekOracle.ts).
// Kept in sync by hand.

export type GreekLetter = {
  /** The Greek character, e.g. "Α". */
  letter: string;
  /** English name, e.g. "Alpha". */
  name: string;
  /** 1–24, its place in the alphabet. */
  position: number;
  /** The quoted line from the Olympian inscription. */
  oracle: string;
  /** The interpretive paragraph. */
  meaning: string;
  keywords: string[];
};

export type GreekReading = {
  id: string;
  question: string | null;
  letter: GreekLetter;
};
