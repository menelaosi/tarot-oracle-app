import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpError } from './http-error.js';

const query = vi.fn();
vi.mock('../db/pool.js', () => ({ pool: { query } }));

// Imported after the mock so it picks up the mocked pool.
const { loadRow, loadRows, run } = await import('./db.js');

beforeEach(() => {
  query.mockReset();
});

describe('run', () => {
  it('executes the query and returns nothing', async () => {
    query.mockResolvedValueOnce({ rows: [] });
    await expect(run('DELETE FROM x WHERE id = $1', [1])).resolves.toBeUndefined();
    expect(query).toHaveBeenCalledWith('DELETE FROM x WHERE id = $1', [1]);
  });

  it('defaults params to an empty array', async () => {
    query.mockResolvedValueOnce({ rows: [] });
    await run('DELETE FROM x');
    expect(query).toHaveBeenCalledWith('DELETE FROM x', []);
  });
});

describe('loadRows', () => {
  it('returns every row on a hit', async () => {
    const rows = [{ id: 1 }, { id: 2 }];
    query.mockResolvedValueOnce({ rows });
    await expect(loadRows('SELECT * FROM x', [], 'not found')).resolves.toEqual(rows);
  });

  it('404s with the given message when there are no rows', async () => {
    query.mockResolvedValueOnce({ rows: [] });
    await expect(loadRows('SELECT * FROM x', [], 'No x found.')).rejects.toMatchObject({
      status: 404,
      message: 'No x found.',
    });
  });

  it('rejects with an actual HttpError instance', async () => {
    query.mockResolvedValueOnce({ rows: [] });
    await expect(loadRows('SELECT * FROM x', [], 'No x found.')).rejects.toBeInstanceOf(HttpError);
  });
});

describe('loadRow', () => {
  it('returns just the first row on a hit', async () => {
    query.mockResolvedValueOnce({ rows: [{ id: 1 }, { id: 2 }] });
    await expect(loadRow('SELECT * FROM x', [], 'not found')).resolves.toEqual({ id: 1 });
  });

  it('404s the same way as loadRows when there are no rows', async () => {
    query.mockResolvedValueOnce({ rows: [] });
    await expect(loadRow('SELECT * FROM x', [], 'No x found.')).rejects.toMatchObject({
      status: 404,
    });
  });
});
