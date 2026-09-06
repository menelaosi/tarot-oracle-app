/** An error carrying the HTTP status it should be reported with. */
export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string, options?: ErrorOptions) {
    super(message, options);
    this.status = status;
  }
}

/** Wraps an unexpected error as a 500 HttpError, passing HttpErrors through unchanged. */
export function toHttpError(error: unknown, message: string): HttpError {
  if (error instanceof HttpError) return error;
  return new HttpError(500, message, { cause: error });
}
