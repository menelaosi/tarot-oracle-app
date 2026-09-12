import { describe, expect, it } from 'vitest';
import { HttpError, toHttpError } from './http-error.js';

describe('HttpError', () => {
  it('carries the status alongside the message', () => {
    const error = new HttpError(404, 'Not found.');
    expect(error.status).toBe(404);
    expect(error.message).toBe('Not found.');
    expect(error).toBeInstanceOf(Error);
  });

  it('accepts a cause via ErrorOptions', () => {
    const cause = new Error('root cause');
    const error = new HttpError(500, 'Wrapped.', { cause });
    expect(error.cause).toBe(cause);
  });
});

describe('toHttpError', () => {
  it('passes an existing HttpError through unchanged', () => {
    const original = new HttpError(400, 'Bad request.');
    expect(toHttpError(original, 'fallback message')).toBe(original);
  });

  it('wraps a plain Error as a 500 by default', () => {
    const cause = new Error('boom');
    const wrapped = toHttpError(cause, 'Something broke.');
    expect(wrapped).toBeInstanceOf(HttpError);
    expect(wrapped.status).toBe(500);
    expect(wrapped.message).toBe('Something broke.');
    expect(wrapped.cause).toBe(cause);
  });

  it('wraps a non-Error thrown value the same way', () => {
    const wrapped = toHttpError('a string was thrown', 'Something broke.');
    expect(wrapped.status).toBe(500);
    expect(wrapped.cause).toBe('a string was thrown');
  });

  it('uses the given status code instead of 500 when provided', () => {
    const wrapped = toHttpError(new Error('boom'), 'Bad input.', 400);
    expect(wrapped.status).toBe(400);
  });
});
