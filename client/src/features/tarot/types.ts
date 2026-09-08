// Shapes returned by the tarot API (server/db/queries/*). Kept in sync by hand.

export type Position = string;

export type DrawnCard = {
  id: number;
  name: string;
  imagePath: string;
  orientation: 'upright' | 'reversed';
  position: number;
  positionLabel: Position;
};

export type CardDetails = {
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

export type Reading = {
  id: string;
  spreadType: string;
  spreadLabel: string;
  question: string | null;
  cards: DrawnCard[];
};

// Mirrors an entry from GET /api/spreads, which is built from server/spreads.ts.
export type SpreadOption = {
  id: string;
  label: string;
  positions: string[];
};
