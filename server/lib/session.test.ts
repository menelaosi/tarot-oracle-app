import type { Request } from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpError } from './http-error.js';

process.env.SESSION_COOKIE_SECRET = 'test-session-secret';

const query = vi.fn();
vi.mock('../db/pool.js', () => ({ pool: { query } }));

const {
  cookieOptions,
  createSession,
  destroySession,
  getSessionUser,
  requireUser,
  SESSION_COOKIE_NAME,
  signSessionId,
  verifySessionCookie,
} = await import('./session.js');

beforeEach(() => {
  query.mockReset();
});

function fakeRequest(cookieHeader?: string): Request {
  return { headers: { cookie: cookieHeader } } as unknown as Request;
}

describe('signSessionId / verifySessionCookie', () => {
  it('round-trips a signed id', () => {
    expect(verifySessionCookie(signSessionId('abc-123'))).toBe('abc-123');
  });

  it('rejects a tampered signature of the same length', () => {
    const signed = signSessionId('abc-123');
    const lastChar = signed.at(-1);
    const tampered = signed.slice(0, -1) + (lastChar === 'a' ? 'b' : 'a');
    expect(verifySessionCookie(tampered)).toBeNull();
  });

  it('rejects a value with no signature separator', () => {
    expect(verifySessionCookie('no-dot-here')).toBeNull();
  });

  it('rejects undefined', () => {
    expect(verifySessionCookie(undefined)).toBeNull();
  });

  it('rejects a signature of the wrong length without throwing', () => {
    const [id] = signSessionId('abc-123').split('.');
    expect(() => verifySessionCookie(`${id}.short`)).not.toThrow();
    expect(verifySessionCookie(`${id}.short`)).toBeNull();
  });
});

describe('cookieOptions', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('is httpOnly, lax, and not secure outside production', () => {
    delete process.env.NODE_ENV;
    expect(cookieOptions()).toMatchObject({
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
    });
  });

  it('is secure in production', () => {
    process.env.NODE_ENV = 'production';
    expect(cookieOptions().secure).toBe(true);
  });
});

describe('getSessionUser', () => {
  it('returns null when there is no cookie, without querying the database', async () => {
    await expect(getSessionUser(fakeRequest())).resolves.toBeNull();
    expect(query).not.toHaveBeenCalled();
  });

  it('returns null when the cookie fails signature verification, without querying', async () => {
    await expect(getSessionUser(fakeRequest(`${SESSION_COOKIE_NAME}=garbage`))).resolves.toBeNull();
    expect(query).not.toHaveBeenCalled();
  });

  it('queries by the verified session id and maps a hit to a UserDto', async () => {
    const signed = signSessionId('session-1');
    query.mockResolvedValueOnce({
      rows: [
        {
          session_id: 'session-1',
          id: 'user-1',
          email: 'a@b.com',
          display_name: 'A',
          avatar_url: null,
        },
      ],
    });

    const user = await getSessionUser(fakeRequest(`${SESSION_COOKIE_NAME}=${signed}`));

    expect(user).toEqual({ id: 'user-1', email: 'a@b.com', displayName: 'A', avatarUrl: null });
    expect(query).toHaveBeenCalledWith(expect.stringContaining('FROM sessions'), ['session-1']);
  });

  it('returns null when the session row is missing or expired', async () => {
    const signed = signSessionId('session-1');
    query.mockResolvedValueOnce({ rows: [] });
    await expect(
      getSessionUser(fakeRequest(`${SESSION_COOKIE_NAME}=${signed}`)),
    ).resolves.toBeNull();
  });
});

describe('createSession', () => {
  it('inserts a session row and returns a signed cookie value for it', async () => {
    query.mockResolvedValueOnce({ rows: [{ id: 'new-session-id', expires_at: '2099-01-01' }] });

    const { cookieValue } = await createSession('user-1');

    expect(verifySessionCookie(cookieValue)).toBe('new-session-id');
    expect(query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO sessions'), ['user-1']);
  });
});

describe('destroySession', () => {
  it('is a no-op when there is no valid cookie', async () => {
    await destroySession(fakeRequest());
    expect(query).not.toHaveBeenCalled();
  });

  it('deletes the session row for a valid cookie', async () => {
    const signed = signSessionId('session-1');
    query.mockResolvedValueOnce({ rows: [] });

    await destroySession(fakeRequest(`${SESSION_COOKIE_NAME}=${signed}`));

    expect(query).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM sessions'), [
      'session-1',
    ]);
  });
});

describe('requireUser', () => {
  it('attaches request.user and calls next() with no error on a live session', async () => {
    const signed = signSessionId('session-1');
    query.mockResolvedValueOnce({
      rows: [
        {
          session_id: 'session-1',
          id: 'user-1',
          email: 'a@b.com',
          display_name: null,
          avatar_url: null,
        },
      ],
    });
    const request = fakeRequest(`${SESSION_COOKIE_NAME}=${signed}`);
    const next = vi.fn();

    await requireUser(request, {} as never, next);

    expect(request.user).toEqual({
      id: 'user-1',
      email: 'a@b.com',
      displayName: null,
      avatarUrl: null,
    });
    expect(next).toHaveBeenCalledWith();
  });

  it('forwards a 401 HttpError to next() when there is no live session', async () => {
    const next = vi.fn();

    await requireUser(fakeRequest(), {} as never, next);

    expect(next).toHaveBeenCalledTimes(1);
    const [error] = next.mock.calls[0] as [unknown];
    expect(error).toBeInstanceOf(HttpError);
    expect((error as HttpError).status).toBe(401);
  });
});
