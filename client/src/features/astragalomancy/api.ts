// Astragalomancy endpoints. Thin typed wrappers over lib/http so the view only
// handles state. The dice are rolled server-side; the client animates toward the
// returned result.
import { getInterpretationResponse, postJson } from '../../lib/http';
import type { AstragalomancyMode, AstragalomancyReading } from './types';

const astragalomancyApi = '/api/astragalomancy/';

export function rollDice(
  mode: AstragalomancyMode,
  question: string,
): Promise<AstragalomancyReading> {
  return postJson<AstragalomancyReading>(
    `${astragalomancyApi}roll`,
    { mode, question },
    'The dice could not be rolled.',
  );
}

export async function interpretRoll(readingId: string): Promise<string> {
  return getInterpretationResponse(`${astragalomancyApi}${readingId}/interpret`);
}
