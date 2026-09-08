// Greek Alphabet Oracle endpoints. Thin typed wrappers over lib/http so the view
// only handles state.
import { postJson } from '../../lib/http';
import type { GreekReading } from './types';

export function drawLetter(question: string): Promise<GreekReading> {
  return postJson<GreekReading>(
    '/api/greek-oracle/draw',
    { question },
    'The letter could not be drawn.',
  );
}

export function interpretLetter(readingId: string): Promise<string> {
  return postJson<{ interpretation: string }>(
    `/api/greek-oracle/${readingId}/interpret`,
    undefined,
    'The interpretation could not be generated.',
  ).then((payload) => payload.interpretation);
}
