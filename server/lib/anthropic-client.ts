import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.ANTHROPIC_API_KEY;

// null when the key isn't configured; routes should check for that and respond 503.
export const anthropic = apiKey ? new Anthropic({ apiKey }) : null;
export const claudeModel = process.env.CLAUDE_MODEL ?? 'claude-sonnet-5';
