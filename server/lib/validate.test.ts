import { describe, expect, it } from 'vitest';
import { HttpError } from './http-error.js';
import { optionalText } from './validate.js';

describe('optionalText', () => {
  it('is null for null or undefined', () => {
    expect(optionalText(null)).toBeNull();
    expect(optionalText(undefined)).toBeNull();
  });

  it('trims a valid string', () => {
    expect(optionalText('  hello  ')).toBe('hello');
  });

  it('is null for a blank or whitespace-only string', () => {
    expect(optionalText('')).toBeNull();
    expect(optionalText('   ')).toBeNull();
  });

  it('throws a labeled 400 HttpError for a non-string value', () => {
    expect(() => optionalText(42, 'Question')).toThrow(HttpError);
    try {
      optionalText(42, 'Question');
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect((error as HttpError).status).toBe(400);
      expect((error as HttpError).message).toBe('Question must be text.');
    }
  });

  it('defaults the label to "Value" when none is given', () => {
    expect(() => optionalText(42)).toThrow('Value must be text.');
  });
});
