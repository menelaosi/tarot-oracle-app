export type Position = 'Past' | 'Present' | 'Future';

export type DrawnCard = {
  id: number
  name: string
  imagePath: string
  orientation: 'upright' | 'reversed'
  position: number
  positionLabel: Position
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
