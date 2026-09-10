// Transport for the app's own API; the feature api.ts modules build on this.
// server/app.ts's error middleware returns `{ "error": "..." }` on every failure,
// so a non-ok response becomes an `ApiError` carrying that message and the HTTP
// status. Callers `catch` and pass the error to `messageFrom` for display.

type ApiErrorBody = { error?: string };
export type InterpretationResponse = { interpretation: string };

/** A non-2xx response from our API. `status` lets callers tell 503 / 5xx / 4xx apart. */
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// A generous ceiling — only a genuinely stuck request (never a slow-but-live
// Claude call) should hit it, so the button doesn't stay disabled forever.
const TIMEOUT_MS = 90_000;

async function send(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error('The request took too long. Please try again.', { cause: error });
    }
    throw error; // network failure — messageFrom() turns it into a friendly line
  } finally {
    clearTimeout(timer);
  }
}

async function unwrap<T>(response: Response, fallbackError: string): Promise<T> {
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(response.status, body?.error ?? fallbackError);
  }
  return response.json() as Promise<T>;
}

export async function getJson<T>(url: string, fallbackError = 'The request failed.'): Promise<T> {
  return unwrap<T>(await send(url, {}), fallbackError);
}

export async function postJson<T>(
  url: string,
  body?: unknown,
  fallbackError = 'The request failed.',
): Promise<T> {
  const init: RequestInit = {
    method: 'POST',
    ...(body != null
      ? {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      : {}),
  };
  return unwrap<T>(await send(url, init), fallbackError);
}

const NETWORK_HINTS = ['failed to fetch', 'networkerror', 'load failed', 'network request failed'];

/** A display string for a caught unknown — server message, connection hint, or fallback. */
export function messageFrom(error: unknown, fallback = 'Something went wrong.'): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) {
    if (NETWORK_HINTS.some((hint) => error.message.toLowerCase().includes(hint))) {
      return 'Could not reach the server — check your connection and try again.';
    }
    return error.message;
  }
  return fallback;
}

export async function getInterpretationResponse(url: string, body?: unknown): Promise<string> {
  const { interpretation } = await postJson<InterpretationResponse>(
    url,
    body,
    'The interpretation could not be generated',
  );
  return interpretation;
}
