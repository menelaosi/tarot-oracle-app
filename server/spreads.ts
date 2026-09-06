export const spreadDefinitions = {
  three_card: { label: 'Past / Present / Future', positions: ['Past', 'Present', 'Future'] },
  yes_no: { label: 'One-card Yes / No', positions: ['Answer'] },
  mind_body_soul: { label: 'Mind / Body / Soul', positions: ['Mind', 'Body', 'Soul'] },
} as const;

export type SpreadType = keyof typeof spreadDefinitions;

export function isSupportedSpread(value: unknown): value is SpreadType {
  return typeof value === 'string' && value in spreadDefinitions;
}

// Only spread sizes in use today; an unlisted count still works, just as a digit ("5-card").
const cardCountWords: Record<number, string> = { 1: 'one', 3: 'three' };

function joinWithAnd(items: readonly string[]): string {
  if (items.length < 2) return items.join('');
  if (items.length === 2) return items.join(' and ');
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

const spreadPrompts: Record<SpreadType, { topic: string; guidance: string }> = {
  yes_no: {
    topic: 'Yes / No',
    guidance: [
      'Answer their question directly with Yes, No, or Unclear.',
      "Follow the answer with a brief explanation grounded only in the card's supplied meaning, orientation, and correspondences.",
      'Do not treat the answer as a guaranteed prediction; frame it as the tendency or guidance shown by the card.',
      'Use the headings "Answer" and "Context".',
    ].join(' '),
  },
  mind_body_soul: {
    topic: spreadDefinitions.mind_body_soul.label,
    guidance: [
      'Interpret Mind as how they are currently thinking, their mental perspective, and the beliefs or ideas shaping the situation.',
      'Interpret Body as how they are feeling in their embodied and emotional experience, without making medical claims.',
      'Interpret Soul as their spiritual state, inner meaning, and connection to purpose or intuition.',
      'Write the three sections as if speaking to them directly, not as detached observations about a third party.',
    ].join(' '),
  },
  three_card: {
    topic: spreadDefinitions.three_card.label,
    guidance: [
      'Interpret Past as relevant background and patterns in their life.',
      'Interpret Present as the current energy or situation they are in.',
      'Interpret Future as the likely direction or advice suggested by the cards.',
    ].join(' '),
  },
};

export function getSpreadInstructions(spreadType: SpreadType): string {
  const { positions } = spreadDefinitions[spreadType];
  const { topic, guidance } = spreadPrompts[spreadType];
  const countWord = cardCountWords[positions.length] ?? String(positions.length);

  const parts = [`This is a ${countWord}-card ${topic} reading.`, guidance];
  if (positions.length > 1) {
    parts.push(
      `Clearly separate the ${joinWithAnd(positions)} sections, then provide a synthesis connecting them.`,
    );
  }
  return parts.join(' ');
}
