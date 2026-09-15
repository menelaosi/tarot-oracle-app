// Provider-agnostic sign-in business logic. Named/shaped so a second
// provider later adds a sibling function reusing upsertUser with a different
// auth_provider literal, rather than a rewrite.

import { toUserDto, upsertUser, type UserDto, type UserRow } from '../db/queries/users.js';
import { loadRow } from './db.js';
import type { GoogleIdentity } from './google-auth.js';

export async function findOrCreateGoogleUser({
  providerId,
  email,
  displayName,
  avatarUrl,
}: GoogleIdentity): Promise<UserDto> {
  const row = await loadRow<UserRow>(
    upsertUser,
    ['google', providerId, email, displayName, avatarUrl],
    'The account could not be created.',
  );
  return toUserDto(row);
}
