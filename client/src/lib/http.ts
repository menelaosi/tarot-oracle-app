// Transport layer for the app's own API. Feature api.ts modules build on this.
// The Express error middleware returns `{ "error": "..." }` for every route, so
// a failed response is unwrapped to that message before it's thrown.

type ApiErrorBody = { error?: string };

async function unwrap<T>(response: Response, fallbackError: string): Promise<T> {
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
    throw new Error(body?.error ?? fallbackError);
  }
  return response.json() as Promise<T>;
}

export async function getJson<T>(url: string, fallbackError = 'The request failed.'): Promise<T> {
  const response = await fetch(url);
  return await unwrap<T>(response, fallbackError);
}

export async function postJson<T>(
  url: string,
  body?: unknown,
  fallbackError = 'The request failed.',
): Promise<T> {
  const init: RequestInit = 
    body === undefined
      ? { method: 'POST' }
      : {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      };
  const response = await fetch(url, init);
  return await unwrap<T>(response, fallbackError);
}

/** Error message for a caught unknown, with a friendly fallback. */
export function messageFrom(error: unknown, fallback = 'Something went wrong.'): string {
  return error instanceof Error ? error.message : fallback;
}
