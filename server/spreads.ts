// The spread registry: the single source for each spread's label, position
// names, and prompt guidance. The API list, client picker, draw count, and
// Claude instructions all derive from here — add a spread in one place.

export type SpreadDefinition = {
  label: string;
  positions: readonly string[];
  topic?: string;
  guidance: string;
};

// Builds the `positions` array and the "Interpret X as ..." guidance from one
// list of [position, meaning] pairs, so a position label is only ever written
// once. `closing` is an optional extra sentence appended after the per-position
// lines. Spreads whose guidance isn't position-by-position (single, yes_no)
// don't use this.
function positional(
  entries: readonly (readonly [position: string, meaning: string])[],
  closing?: string,
): Pick<SpreadDefinition, 'positions' | 'guidance'> {
  const sentences = entries.map(([position, meaning]) => `Interpret ${position} as ${meaning}.`);
  if (closing) sentences.push(closing);
  return {
    positions: entries.map(([position]) => position),
    guidance: sentences.join(' '),
  };
}

export const spreads = {
  single: {
    label: 'Single card',
    positions: ['Overview'],
    topic: 'general guidance',
    guidance: [
      'Interpret the single card as the overall feeling surrounding their situation and the main influences at work in it.',
      'Speak to them directly, and keep it to a focused paragraph or two rather than a formal multi-section reading.',
    ].join(' '),
  },
  yes_no: {
    label: 'Yes / No',
    positions: ['Answer'],
    guidance: [
      'Answer their question directly with Yes, No, or Unclear.',
      "Follow the answer with a brief explanation grounded only in the card's supplied meaning, orientation, and correspondences.",
      'Do not treat the answer as a guaranteed prediction; frame it as the tendency or guidance shown by the card.',
      'Use the headings "Answer" and "Context".',
    ].join(' '),
  },
  three_card: {
    label: 'Past / Present / Future',
    ...positional([
      [
        'Past',
        'the attitudes, feelings, or beliefs from past events that have shaped their current situation',
      ],
      ['Present', 'the forces at work right now and the events influencing their situation'],
      [
        'Future',
        'the outcomes that could plausibly follow and the unconscious expectations they may be carrying, framed as tendency rather than certainty',
      ],
    ]),
  },
  daily: {
    label: 'Thinking / Feeling / Doing',
    ...positional(
      [
        ['Thinking', 'what is on their mind today and what they are turning over most'],
        ['Feeling', 'their dominant emotion today and the overall emotional weather'],
        ['Doing', 'the tasks and actions they are focused on accomplishing today'],
      ],
      'Keep it grounded in the day ahead rather than the distant future.',
    ),
  },
  situation_action_outcome: {
    label: 'Situation / Action / Outcome',
    ...positional([
      ['Situation', 'the current state of affairs they are in'],
      ['Action', 'the steps they can take, or are already taking, to address it'],
      [
        'Outcome',
        'the result they can reasonably expect from taking that action, framed as tendency rather than a guarantee',
      ],
    ]),
  },
  mind_body_soul: {
    label: 'Mind / Body / Soul',
    ...positional(
      [
        [
          'Mind',
          'how they are currently thinking, their mental perspective, and the beliefs or ideas shaping the situation',
        ],
        [
          'Body',
          'how they are feeling in their embodied and emotional experience, without making medical claims',
        ],
        ['Soul', 'their spiritual state, inner meaning, and connection to purpose or intuition'],
      ],
      'Write the three sections as if speaking to them directly, not as detached observations about a third party.',
    ),
  },
  the_oracle: {
    label: 'The Oracle',
    ...positional([
      ['The Present Problem', 'the core difficulty they are facing now'],
      ['The Way Out', 'the route through it that the cards suggest'],
      [
        'The Future',
        'where things tend to head once that route is taken, framed as tendency rather than certainty',
      ],
    ]),
  },
  relationship_check: {
    label: 'Relationship Check',
    ...positional(
      [
        ['What You Want', 'their own desires and needs in this relationship'],
        ['What They Want', "the other person's desires and needs as the cards portray them"],
        [
          'Where the Relationship Is Going',
          "the likely direction of the connection, framed as tendency rather than certainty and without making guaranteed predictions about another person's choices",
        ],
      ],
      'Speak to them directly throughout.',
    ),
  },
  the_way_ahead: {
    label: 'The Way Ahead',
    ...positional([
      [
        'You Already Know This',
        'the knowledge or resources they have long held about the situation',
      ],
      ['You Do This Well', 'a strength or skill they can rely on'],
      ['This Is New', 'what is genuinely unfamiliar or just emerging for them'],
      ['This Is What You Can Learn', 'the lesson or growth the cards point toward'],
    ]),
  },
  past_present_future_advice: {
    label: 'Past / Present / Future / Advice',
    ...positional([
      ['Past', 'relevant background and patterns in their life'],
      ['Present', 'the current energy or situation they are in'],
      [
        'Future',
        'the likely direction the cards suggest, framed as tendency rather than certainty',
      ],
      ['Advice', 'the most useful stance or next step the cards point to'],
    ]),
  },
} as const satisfies Record<string, SpreadDefinition>;

export type SpreadType = keyof typeof spreads;

/** Ordered, client-safe view of the registry for the picker and the API. */
export const spreadList: { id: SpreadType; label: string; positions: readonly string[] }[] =
  Object.entries(spreads).map(([id, spread]) => ({
    id: id as SpreadType,
    label: spread.label,
    positions: spread.positions,
  }));

export function isSupportedSpread(value: unknown): value is SpreadType {
  return typeof value === 'string' && value in spreads;
}

// Card counts in use today; an unlisted count still works, just as a digit ("5-card").
const cardCountWords: Record<number, string> = { 1: 'one', 2: 'two', 3: 'three', 4: 'four' };

function joinWithAnd(items: readonly string[]): string {
  if (items.length < 2) return items.join('');
  if (items.length === 2) return items.join(' and ');
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

export function getSpreadInstructions(spread: SpreadDefinition): string {
  const { positions, guidance } = spread;
  const topic = spread.topic ?? spread.label;
  const countWord = cardCountWords[positions.length] ?? String(positions.length);

  const parts = [`This is a ${countWord}-card ${topic} reading.`, guidance];
  if (positions.length > 1) {
    parts.push(
      `Clearly separate the ${joinWithAnd(positions)} sections, then provide a synthesis connecting them.`,
    );
  }
  return parts.join(' ');
}
