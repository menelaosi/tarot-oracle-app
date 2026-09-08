import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { toHttpError } from './http-error.js';

type AsyncHandler = (request: Request, response: Response) => Promise<void>;

/**
 * Wraps an async route so any throw is normalized and forwarded to the app's
 * error middleware: `HttpError`s pass through, anything else becomes a 500
 * carrying `fallbackMessage`. Removes the per-handler try/catch.
 */
export function handler(fn: AsyncHandler, fallbackMessage: string): RequestHandler {
  return (request: Request, response: Response, next: NextFunction) => {
    Promise.resolve(fn(request, response)).catch((error: unknown) =>
      next(toHttpError(error, fallbackMessage)),
    );
  };
}
