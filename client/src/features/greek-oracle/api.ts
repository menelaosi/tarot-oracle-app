// Greek Alphabet Oracle endpoints. Thin typed wrappers over lib/http so the view
// only handles state.
import { getInterpretationResponse, postJson } from '../../lib/http';
import type { GreekReading } from './types';

const greekOracleApi = '/api/greek-oracle/';

export function drawLetter(question: string): Promise<GreekReading> {
  return postJson<GreekReading>(
    `${greekOracleApi}draw`,
    { question },
    'The letter could not be drawn.',
  );
}

export async function interpretLetter(readingId: string): Promise<string> {
  return getInterpretationResponse(`${greekOracleApi}${readingId}/interpret`);
}
