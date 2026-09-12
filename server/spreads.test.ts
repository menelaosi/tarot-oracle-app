import { describe, expect, it } from 'vitest';
import { getSpreadInstructions, isSupportedSpread, spreadList, spreads } from './spreads.js';

describe('spreadList', () => {
  it('lists every registered spread with its id, label, and positions', () => {
    const single = spreadList.find((s) => s.id === 'single');
    expect(single).toEqual({ id: 'single', label: 'Single card', positions: ['Overview'] });
  });

  it('has one entry per key in the spreads registry', () => {
    expect(spreadList).toHaveLength(Object.keys(spreads).length);
  });
});

describe('isSupportedSpread', () => {
  it('is true for every real spread id', () => {
    for (const id of Object.keys(spreads)) {
      expect(isSupportedSpread(id)).toBe(true);
    }
  });

  it('is false for an unknown string', () => {
    expect(isSupportedSpread('not_a_real_spread')).toBe(false);
  });

  it('is false for a non-string value', () => {
    expect(isSupportedSpread(42)).toBe(false);
    expect(isSupportedSpread(null)).toBe(false);
    expect(isSupportedSpread(undefined)).toBe(false);
  });
});

describe('getSpreadInstructions', () => {
  it('names a single-card spread "one-card" and skips the multi-section instruction', () => {
    const instructions = getSpreadInstructions(spreads.single);
    expect(instructions).toContain('one-card');
    expect(instructions).not.toContain('Clearly separate');
  });

  it('builds one "Interpret X as ..." sentence per position for a positional spread', () => {
    const instructions = getSpreadInstructions(spreads.three_card);
    expect(instructions).toContain('Interpret Past as');
    expect(instructions).toContain('Interpret Present as');
    expect(instructions).toContain('Interpret Future as');
  });

  it('names the card count in words up to four, then falls back to a digit', () => {
    expect(getSpreadInstructions(spreads.three_card)).toContain('three-card');
    expect(getSpreadInstructions(spreads.the_way_ahead)).toContain('four-card');
  });

  it('joins two positions with "and", no comma', () => {
    // yes_no only has one position, so borrow a fixture-only two-position spread shape.
    const twoPosition = { ...spreads.the_oracle, positions: ['A', 'B'] as const };
    expect(getSpreadInstructions(twoPosition)).toContain('the A and B sections');
  });

  it('joins three or more positions with commas and a final "and"', () => {
    expect(getSpreadInstructions(spreads.three_card)).toContain(
      'the Past, Present, and Future sections',
    );
  });

  it('adds no multi-section instruction for a single-position spread', () => {
    expect(getSpreadInstructions(spreads.yes_no)).not.toContain('Clearly separate');
  });

  it('appends the closing sentence when the spread defines one', () => {
    // `daily` uses positional()'s optional closing argument.
    expect(getSpreadInstructions(spreads.daily)).toContain(
      'Keep it grounded in the day ahead rather than the distant future.',
    );
  });

  it('falls back to the spread label as the topic when none is given', () => {
    expect(getSpreadInstructions(spreads.three_card)).toContain(spreads.three_card.label);
  });

  it("uses the spread's own topic instead of its label when one is set", () => {
    expect(getSpreadInstructions(spreads.single)).toContain(spreads.single.topic as string);
  });
});
