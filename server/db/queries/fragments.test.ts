import { describe, expect, it } from 'vitest';
import { insertInto, setInterpretation, withAlias } from './fragments.js';

describe('setInterpretation', () => {
  it('builds an UPDATE ... SET interpretation statement for the given table', () => {
    expect(setInterpretation('astrology_readings')).toBe(
      'UPDATE astrology_readings SET interpretation = $1 WHERE id = $2',
    );
  });
});

describe('insertInto', () => {
  it('numbers placeholders by column position, in order', () => {
    expect(insertInto('cards', ['name', 'suit', 'number'])).toBe(
      'INSERT INTO cards (name, suit, number) VALUES ($1, $2, $3)',
    );
  });

  it('appends RETURNING when given', () => {
    expect(insertInto('cards', ['name'], 'id')).toBe(
      'INSERT INTO cards (name) VALUES ($1) RETURNING id',
    );
  });

  it('omits RETURNING when not given', () => {
    expect(insertInto('cards', ['name'])).not.toContain('RETURNING');
  });

  it('casts a column written as "column::type", using the bare name in the column list', () => {
    expect(insertInto('astragalomancy_readings', ['question', 'mode', 'dice::jsonb'], 'id')).toBe(
      'INSERT INTO astragalomancy_readings (question, mode, dice) ' +
        'VALUES ($1, $2, $3::jsonb) RETURNING id',
    );
  });

  it('keeps placeholder numbering in sync when only some columns are cast', () => {
    // A cast column must not shift or duplicate the numbering of the ones after it.
    expect(insertInto('t', ['a::int', 'b', 'c::text'])).toBe(
      'INSERT INTO t (a, b, c) VALUES ($1::int, $2, $3::text)',
    );
  });
});

describe('withAlias', () => {
  it('prefixes every column in a comma-separated list with the alias', () => {
    expect(withAlias('a, b, c', 't')).toBe('t.a, t.b, t.c');
  });

  it('works for a single column', () => {
    expect(withAlias('id', 'c')).toBe('c.id');
  });
});
