// Transport for the app's own API; the feature api.ts modules build on this.
// server/app.ts's error middleware returns `{ "error": "..." }` on every failure,
// so a non-ok response is unwrapped to that message (falling back to a generic
// one) and thrown, letting callers just `catch` and show `err.message`.

type ApiErrorBody = { error?: string };
export type InterpretationResponse = { interpretation: string };

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
  const response = await fetch(url, {
    method: 'POST',
    ...(body != null ? {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    } : {}),
  });
  return await unwrap<T>(response, fallbackError);
}

/** Error message for a caught unknown, with a friendly fallback. */
export function messageFrom(error: unknown, fallback = 'Something went wrong.'): string {
  return error instanceof Error ? error.message : fallback;
}

export async function getInterpretationResponse(
  url: string,
  body?: unknown,
): Promise<string> {
  const { interpretation } = await postJson<InterpretationResponse>(
    url,
    body,
    'The interpretation could not be generated',
  );
  return interpretation;
}
