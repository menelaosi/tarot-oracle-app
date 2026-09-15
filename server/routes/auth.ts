import { Router } from 'express';
import { findOrCreateGoogleUser } from '../lib/auth.js';
import { verifyGoogleIdToken } from '../lib/google-auth.js';
import { handler } from '../lib/route.js';
import {
  cookieOptions,
  createSession,
  destroySession,
  getSessionUser,
  SESSION_COOKIE_NAME,
} from '../lib/session.js';
import { requireText } from '../lib/validate.js';

const router = Router();

// POST /api/auth/google — body { credential }, the signed ID token Google's
// own sign-in button hands the client directly (Google Identity Services, not
// a server-side OAuth redirect). Verifies it, finds-or-creates the account,
// and starts a session.
router.post(
  '/google',
  handler(async ({ body }, response) => {
    const identity = await verifyGoogleIdToken(requireText(body?.credential, 'Google credential'));
    const user = await findOrCreateGoogleUser(identity);

    const { cookieValue } = await createSession(user.id);
    response.cookie(SESSION_COOKIE_NAME, cookieValue, cookieOptions());
    response.json({ user });
  }, 'Google sign-in failed.'),
);

// POST /api/auth/logout — idempotent; clears the session row and the cookie
// whether or not there was a live session to begin with. Returns a JSON body
// (not a bare 204) — every other endpoint in this app does, and the client's
// shared postJson/unwrap always calls response.json() on an ok response.
router.post(
  '/logout',
  handler(async (request, response) => {
    await destroySession(request);
    response.clearCookie(SESSION_COOKIE_NAME, cookieOptions());
    response.json({ ok: true });
  }, 'Sign-out failed.'),
);

// GET /api/auth/me — always 200 { user: UserDto | null }, never 401. This is
// a status check the client calls unconditionally on every load; "no session"
// isn't an error here (requireUser, for future protected routes, is what 401s).
router.get(
  '/me',
  handler(async (request, response) => {
    const user = await getSessionUser(request);
    response.json({ user });
  }, 'Could not check sign-in status.'),
);

export default router;
