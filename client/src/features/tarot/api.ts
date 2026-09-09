// Tarot endpoints. Thin typed wrappers over lib/http so views only handle state.
import { getInterpretationResponse, getJson, postJson } from '../../lib/http';
import type { Reading, SpreadOption } from './types';

type DrawOptions = {
  spreadType: string;
  question: string;
  includeReversals: boolean;
};

const api = '/api/';
const readingsApi = `${api}readings/`;

export function loadSpreads(): Promise<SpreadOption[]> {
  return getJson<SpreadOption[]>(`${api}spreads`, 'The spreads could not be loaded.');
}

export function drawReading(options: DrawOptions): Promise<Reading> {
  return postJson<Reading>(`${readingsApi}draw`, options, 'The cards could not be drawn.');
}

export function interpretReading(readingId: string): Promise<string> {
  return getInterpretationResponse(`${readingsApi}${readingId}/interpret`);
}
