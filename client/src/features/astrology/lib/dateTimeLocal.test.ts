import { describe, expect, it } from 'vitest';
import { dateFromDateTimeLocal } from './dateTimeLocal';

describe('dateFromDateTimeLocal', () => {
  it('pins the typed wall-clock value into the UTC fields', () => {
    const date = dateFromDateTimeLocal('1990-06-15T08:30');
    expect(date.getUTCFullYear()).toBe(1990);
    expect(date.getUTCMonth()).toBe(5);
    expect(date.getUTCDate()).toBe(15);
    expect(date.getUTCHours()).toBe(8);
    expect(date.getUTCMinutes()).toBe(30);
  });

  it('is independent of the process timezone', () => {
    const utc = dateFromDateTimeLocal('1990-06-15T08:30').getTime();
    expect(utc).toBe(Date.UTC(1990, 5, 15, 8, 30));
  });

  it('round-trips midnight and single-digit fields', () => {
    const date = dateFromDateTimeLocal('2000-01-01T00:05');
    expect(date.getUTCHours()).toBe(0);
    expect(date.getUTCMinutes()).toBe(5);
  });
});
