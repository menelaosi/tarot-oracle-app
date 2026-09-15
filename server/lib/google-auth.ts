// The one place google-auth-library is imported anywhere in this app — same
// "one chokepoint" shape as lib/claude.ts for the Anthropic SDK.

import { OAuth2Client } from 'google-auth-library';
import { badRequest, toHttpError } from './http-error.js';
import { requireEnv } from './require-env.js';

const GOOGLE_CLIENT_ID = requireEnv('GOOGLE_CLIENT_ID');
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Google's picture/name claims are never guaranteed present — coalesced to
// null here, the one boundary where that happens, so nothing downstream
// juggles undefined vs null for the same field.
export type GoogleIdentity = {
  providerId: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
};

/**
 * Verifies a Google ID token's signature, issuer, expiry, and audience
 * against Google's published keys, then extracts the identity claims this
 * app actually needs. Throws a 400 on a bad/expired/mis-audienced token, or
 * on a token missing the claims a real Google account always has.
 */
export async function verifyGoogleIdToken(idToken: string): Promise<GoogleIdentity> {
  const ticket = await client
    .verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID })
    .catch((error: unknown) => {
      throw toHttpError(error, 'Google sign-in could not be verified.', 400);
    });

  const { sub: providerId, email, name, picture } = ticket.getPayload() ?? {};
  if (!providerId || !email) {
    throw badRequest('Google account is missing required profile info.');
  }

  return {
    providerId,
    email,
    displayName: name ?? null,
    avatarUrl: picture ?? null,
  };
}
