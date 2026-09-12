import type Anthropic from '@anthropic-ai/sdk';
import { anthropic, claudeModel } from './anthropic-client.js';
import { serviceUnavailable } from './http-error.js';
import { assertUnderBudget, normalizeUsage, recordUsage } from './usage.js';

/** Plain text, or ordered blocks whose last entry can carry `cache_control`
 *  for prompt caching (astrology's reference digest). Typed from the SDK so it
 *  tracks whatever version is installed. */
export type SystemPrompt = NonNullable<Anthropic.MessageCreateParams['system']>;

export function requireAnthropic(): NonNullable<typeof anthropic> {
  if (!anthropic) {
    throw serviceUnavailable('ANTHROPIC_API_KEY is not configured.');
  }
  return anthropic;
}

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
  await assertUnderBudget();

  const messageContent = typeof prompt === 'string' ? prompt : JSON.stringify(prompt);
  const { content, stop_reason, usage } = await client.messages.create({
    model: claudeModel,
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: messageContent }],
  });

  const labelString = `${label} interpret`;

  if (stop_reason === 'max_tokens')
    console.warn('Claude %s reached the max token limit.', labelString);

  const normalizedUsage = normalizeUsage(usage);
  console.info(
    '%s — cache write %d, cache read %d, input %d, output %d',
    labelString,
    normalizedUsage.cache_creation_input_tokens,
    normalizedUsage.cache_read_input_tokens,
    normalizedUsage.input_tokens,
    normalizedUsage.output_tokens,
  );

  // Best-effort: a logging hiccup must never fail a reading Claude already
  // generated and the user already paid for in tokens.
  try {
    await recordUsage(label, claudeModel, normalizedUsage);
  } catch (error) {
    console.error('Failed to record Claude usage for %s:', labelString, error);
  }

  return content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map(({ text }) => text)
    .join('\n');
}
