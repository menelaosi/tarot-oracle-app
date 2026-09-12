/** An error carrying the HTTP status it should be reported with. */
export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string, options?: ErrorOptions) {
    super(message, options);
    this.status = status;
  }
}

/** Wraps an unexpected error as a 500 HttpError, passing HttpErrors through unchanged. */
export function toHttpError(error: unknown, message: string, code: number = 500): HttpError {
  if (error instanceof HttpError) return error;
  return new HttpError(code, message, { cause: error });
}

// One named factory per status this app actually throws deliberately (as
// opposed to toHttpError's wrapping of an unexpected caught value), so a
// throw site reads as its HTTP semantics rather than a bare numeric code.
export const badRequest = (message: string): HttpError => new HttpError(400, message);
export const notFound = (message: string): HttpError => new HttpError(404, message);
export const serverError = (message: string): HttpError => new HttpError(500, message);
export const serviceUnavailable = (message: string): HttpError => new HttpError(503, message);
