// SQL for user accounts. Provider-agnostic — auth_provider/auth_provider_id
// is a generic pair rather than a Google-specific column, so a second
// provider later just adds another auth_provider value, not a schema change.

import { withAlias } from './fragments.js';

export type UserRow = {
  id: string;
  auth_provider: string;
  auth_provider_id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type UserDto = {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
};

/**
 * Row (snake_case) -> client DTO (camelCase). Drops fields the client never
 * needs. Typed as a Pick of UserRow's fields (not the full row) so it also
 * accepts sessions.ts's joined SessionUserRow, which carries the same four
 * fields plus a session_id it doesn't need.
 */
export function toUserDto({
  id,
  email,
  display_name: displayName,
  avatar_url: avatarUrl,
}: Pick<UserRow, 'id' | 'email' | 'display_name' | 'avatar_url'>): UserDto {
  return { id, email, displayName, avatarUrl };
}

const USER_COLUMNS =
  'id, auth_provider, auth_provider_id, email, display_name, avatar_url, created_at';

// Upsert, not select-then-insert: two concurrent first-time sign-ins for the
// same account would otherwise race the UNIQUE(auth_provider,
// auth_provider_id) constraint. Also refreshes email/name/avatar on every
// sign-in for free, in case any of them changed on the provider's side.
export const upsertUser = `
  INSERT INTO users (auth_provider, auth_provider_id, email, display_name, avatar_url)
  VALUES ($1, $2, $3, $4, $5)
  ON CONFLICT (auth_provider, auth_provider_id)
  DO UPDATE SET email = EXCLUDED.email, display_name = EXCLUDED.display_name, avatar_url = EXCLUDED.avatar_url
  RETURNING ${USER_COLUMNS}
`;

export const selectUserById = `SELECT ${withAlias(USER_COLUMNS, 'u')} FROM users u WHERE u.id = $1`;
