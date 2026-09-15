// SQL for sessions — opaque, revocable server state a signed cookie points
// to. See lib/session.ts for the cookie signing/verification and the CRUD
// wrappers around these queries.

export type SessionRow = { id: string; expires_at: string };

export type SessionUserRow = {
  session_id: string;
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
};

const table = 'sessions';

// The expiry is a DB-computed interval, not a bound param, so this is
// hand-written rather than built with insertInto.
export const insertSession = `
  INSERT INTO ${table} (user_id, expires_at)
  VALUES ($1, now() + interval '30 days')
  RETURNING id, expires_at
`;

// Zero rows is a legitimate "no live session" outcome (missing or expired
// cookie), not a 404 — callers query this directly via pool.query, the same
// convention astrology's "already generated?" check uses, rather than loadRow.
export const selectSessionUser = `
  SELECT s.id AS session_id, u.id, u.email, u.display_name, u.avatar_url
  FROM ${table} s
  JOIN users u ON u.id = s.user_id
  WHERE s.id = $1 AND s.expires_at > now()
`;

export const deleteSession = `DELETE FROM ${table} WHERE id = $1`;
