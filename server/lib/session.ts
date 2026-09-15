// Cookie mechanics + session CRUD + a requireUser middleware for future
// protected routes. Sessions are opaque Postgres rows (db/queries/sessions.ts),
// not a JWT of our own — the cookie only carries a signed reference to one.

import { parseCookie } from 'cookie';
import type { CookieOptions, NextFunction, Request, Response } from 'express';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { pool } from '../db/pool.js';
import {
  deleteSession,
  insertSession,
  selectSessionUser,
  type SessionRow,
  type SessionUserRow,
} from '../db/queries/sessions.js';
import { toUserDto, type UserDto } from '../db/queries/users.js';
import { loadRow, run } from './db.js';
import { unauthorized } from './http-error.js';
import { requireEnv } from './require-env.js';

// Augmenting Express's own Request type requires exactly this shape — global
// namespace + interface merging — there's no alternative syntax for it.
/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/consistent-type-definitions */
declare global {
  namespace Express {
    interface Request {
      user?: UserDto;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace, @typescript-eslint/consistent-type-definitions */

export const SESSION_COOKIE_NAME = 'tarot_oracle_session';

const SESSION_COOKIE_SECRET = requireEnv('SESSION_COOKIE_SECRET');
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function hmac(value: string): string {
  return createHmac('sha256', SESSION_COOKIE_SECRET).update(value).digest('base64url');
}

/** Signs a session id so a tampered cookie value is detectable. Pure — no I/O. */
export function signSessionId(id: string): string {
  return `${id}.${hmac(id)}`;
}

/**
 * Verifies a signed session-id cookie value, returning the plain session id
 * on success or null for any missing, malformed, or tampered input. Pure —
 * no I/O, so a bad cookie never even reaches the database.
 */
export function verifySessionCookie(raw: string | undefined): string | null {
  if (!raw) return null;

  const separatorIndex = raw.lastIndexOf('.');
  if (separatorIndex === -1) return null;

  const id = raw.slice(0, separatorIndex);
  const signatureBuffer = Buffer.from(raw.slice(separatorIndex + 1));
  const expectedBuffer = Buffer.from(hmac(id));

  // timingSafeEqual throws on mismatched lengths rather than returning false.
  if (signatureBuffer.length !== expectedBuffer.length) return null;

  return timingSafeEqual(signatureBuffer, expectedBuffer) ? id : null;
}

function readSessionId({ headers }: Request): string | null {
  const { cookie } = headers;
  if (!cookie) return null;
  return verifySessionCookie(parseCookie(cookie)[SESSION_COOKIE_NAME]);
}

/** Shared Set-Cookie attributes for both setting and clearing the session cookie. */
export function cookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: THIRTY_DAYS_MS,
  };
}

export async function createSession(userId: string): Promise<{ cookieValue: string }> {
  const { id } = await loadRow<SessionRow>(
    insertSession,
    [userId],
    'The session could not be created.',
  );
  return { cookieValue: signSessionId(id) };
}

/** The signed-in user for this request's session cookie, or null if there isn't one. */
export async function getSessionUser(request: Request): Promise<UserDto | null> {
  const sessionId = readSessionId(request);
  if (!sessionId) return null;

  const { rows } = await pool.query<SessionUserRow>(selectSessionUser, [sessionId]);
  const row = rows[0];
  return row ? toUserDto(row) : null;
}

/** Idempotent — logging out with no valid cookie is a no-op, not an error. */
export async function destroySession(request: Request): Promise<void> {
  const sessionId = readSessionId(request);
  if (!sessionId) return;
  await run(deleteSession, [sessionId]);
}

/**
 * Express middleware for future protected routes: attaches `request.user`
 * on a live session, or forwards a 401 to the error middleware. Not consumed
 * by any route yet — no reading table has a user_id column in this task.
 */
export async function requireUser(
  request: Request,
  _response: Response,
  next: NextFunction,
): Promise<void> {
  const user = await getSessionUser(request);
  if (!user) {
    next(unauthorized('Sign in required.'));
    return;
  }
  request.user = user;
  next();
}
