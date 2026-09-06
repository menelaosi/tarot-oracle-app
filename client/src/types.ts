export type Position = 'Past' | 'Present' | 'Future';

export type DrawnCard = {
  id: number
  name: string
  imagePath: string
  orientation: 'upright' | 'reversed'
  position: number
  positionLabel: Position
};

export type CardDetails = {
  id: number
  name: string
  arcana: 'major' | 'minor'
  suit: string | null
  number: number | null
  meaningUpright: string
  meaningReversed: string
  element: string | null
  suitPositiveAssociations: string[]
  suitNegativeAssociations: string[]
  numerologyAssociations: string[]
  courtRank: string | null
  courtDescription: string | null
  courtPositiveAssociations: string[]
  courtNegativeAssociations: string[]
  majorElement: string | null
  majorPlanets: string[]
  majorSigns: string[]
  majorPositiveAssociations: string[]
  majorNegativeAssociations: string[]
  majorRepresentations: string[]
};

export type Reading = {
  id: string
  spreadType: 'three_card'
  question: string | null
  cards: DrawnCard[]
};

export type SpreadOption = {
  value: Reading['spreadType']
  label: string
};
