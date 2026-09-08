import type Anthropic from '@anthropic-ai/sdk';
import { anthropic, claudeModel } from './anthropic-client.js';
import { HttpError } from './http-error.js';

/** Plain text, or ordered blocks whose last entry can carry `cache_control`
 *  for prompt caching (astrology's reference digest). Typed from the SDK so it
 *  tracks whatever version is installed. */
export type SystemPrompt = NonNullable<Anthropic.MessageCreateParams['system']>;

export function requireAnthropic(): NonNullable<typeof anthropic> {
  if (!anthropic) {
    throw new HttpError(503, 'ANTHROPIC_API_KEY is not configured.');
  }
  return anthropic;
};

export function createSystemRules(rules: string[]): string {
  return [
    ...rules,
    'Address them as "you" and "your"; never the third person. Warm, plain, and encouraging like a conversation not a clinical report.',
    'No medical, legal, financial, or guaranteed predictive claims.',
  ].join(' ');
}

export async function generateReading(
  system: string | Anthropic.TextBlockParam[],
  prompt: string | object,
  maxTokens: number,
  label: string,
): Promise<string> {
  const client = requireAnthropic();

  const messageContent = typeof prompt === 'string'
   ? prompt : JSON.stringify(prompt);
  const message = await client.messages.create({
    model: claudeModel,
    max_tokens: maxTokens,
    system,
    messages: [
      { role: 'user', content: messageContent },
    ],
  });

  const labelString = `${label} interpret`;

  if (message.stop_reason === 'max_tokens') {
    console.warn('Claude %s reached the max token limit.', labelString);
  }
  const { usage } = message;
  console.info(
    '%s — cache write %d, cache read %d, input %d, output %d',
    labelString,
    usage.cache_creation_input_tokens ?? 0,
    usage.cache_read_input_tokens ?? 0,
    usage.input_tokens,
    usage.output_tokens,
  );

  return message.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('\n');
};
