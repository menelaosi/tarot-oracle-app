import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, getInterpretationResponse, getJson, messageFrom, postJson } from './http';

function jsonResponse(body: unknown, init: { ok?: boolean; status?: number } = {}): Response {
  const { ok = true, status = 200 } = init;
  return {
    ok,
    status,
    json: async () => body,
  } as Response;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('messageFrom', () => {
  it("uses an ApiError's own message", () => {
    expect(messageFrom(new ApiError(404, 'Not found.'))).toBe('Not found.');
  });

  it('recognizes common network-failure phrasing and gives a friendly hint', () => {
    expect(messageFrom(new TypeError('Failed to fetch'))).toBe(
      'Could not reach the server — check your connection and try again.',
    );
    expect(messageFrom(new Error('NetworkError when attempting to fetch resource'))).toBe(
      'Could not reach the server — check your connection and try again.',
    );
  });

  it('is case-insensitive when matching network-failure phrasing', () => {
    expect(messageFrom(new Error('FAILED TO FETCH'))).toBe(
      'Could not reach the server — check your connection and try again.',
    );
  });

  it('uses a plain Error message when it is not a network-failure phrase', () => {
    expect(messageFrom(new Error('Something specific broke.'))).toBe('Something specific broke.');
  });

  it('falls back to the default fallback for a non-Error value', () => {
    expect(messageFrom('a string', 'fallback text')).toBe('fallback text');
    expect(messageFrom('a string')).toBe('Something went wrong.');
  });
});

describe('getJson', () => {
  it('resolves with the parsed JSON body on a 2xx response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ hello: 'world' })));
    await expect(getJson('/api/thing')).resolves.toEqual({ hello: 'world' });
  });

  it('throws an ApiError carrying the status and server-supplied message on failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ error: 'Not found.' }, { ok: false, status: 404 })),
    );
    await expect(getJson('/api/thing')).rejects.toMatchObject({
      status: 404,
      message: 'Not found.',
    });
  });

  it('falls back to the given message when the error body has no error field', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({}, { ok: false, status: 500 })));
    await expect(getJson('/api/thing', 'Custom fallback.')).rejects.toMatchObject({
      message: 'Custom fallback.',
    });
  });

  it('falls back to the given message when the error response body is not JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('not json');
        },
      } as unknown as Response),
    );
    await expect(getJson('/api/thing', 'Custom fallback.')).rejects.toMatchObject({
      message: 'Custom fallback.',
    });
  });
});

describe('postJson', () => {
  it('sends a JSON body with the content-type header when a body is given', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true }));
    vi.stubGlobal('fetch', fetchMock);

    await postJson('/api/thing', { question: 'hi' });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe('POST');
    expect(init.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(init.body).toBe(JSON.stringify({ question: 'hi' }));
  });

  it('sends no body or content-type header when no body is given', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true }));
    vi.stubGlobal('fetch', fetchMock);

    await postJson('/api/thing');

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe('POST');
    expect(init.headers).toBeUndefined();
    expect(init.body).toBeUndefined();
  });
});

describe('getInterpretationResponse', () => {
  it('unwraps the { interpretation } field from a successful POST', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ interpretation: 'A grounded reading.' })),
    );
    await expect(getInterpretationResponse('/api/interpret')).resolves.toBe('A grounded reading.');
  });
});
