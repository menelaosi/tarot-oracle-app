// Tarot endpoints. Thin typed wrappers over lib/http so views only handle state.
import { getJson, postJson } from '../../lib/http';
import type { Reading, SpreadOption } from './types';

type DrawOptions = {
  spreadType: string;
  question: string;
  includeReversals: boolean;
};

export function loadSpreads(): Promise<SpreadOption[]> {
  return getJson<SpreadOption[]>('/api/spreads', 'The spreads could not be loaded.');
}

export function drawReading(options: DrawOptions): Promise<Reading> {
  return postJson<Reading>('/api/readings/draw', options, 'The cards could not be drawn.');
}

export function interpretReading(readingId: string): Promise<string> {
  return postJson<{ interpretation: string }>(
    `/api/readings/${readingId}/interpret`,
    undefined,
    'The interpretation could not be generated.',
  ).then((payload) => payload.interpretation);
}
