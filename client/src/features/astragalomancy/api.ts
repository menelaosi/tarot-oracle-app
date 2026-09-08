// Astragalomancy endpoints. Thin typed wrappers over lib/http so the view only
// handles state. The dice are rolled server-side; the client animates toward the
// returned result.
import { postJson } from '../../lib/http';
import type { AstragalomancyMode, AstragalomancyReading } from './types';

export function rollDice(
  mode: AstragalomancyMode,
  question: string,
): Promise<AstragalomancyReading> {
  return postJson<AstragalomancyReading>(
    '/api/astragalomancy/roll',
    { mode, question },
    'The dice could not be rolled.',
  );
}

export function interpretRoll(readingId: string): Promise<string> {
  return postJson<{ interpretation: string }>(
    `/api/astragalomancy/${readingId}/interpret`,
    undefined,
    'The interpretation could not be generated.',
  ).then((payload) => payload.interpretation);
}
