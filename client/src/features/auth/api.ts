import { getJson, postJson } from '../../lib/http';

export type SessionUser = {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
};

const API = '/api/auth/';
/** The current signed-in user, or null — this always resolves, never throws for "signed out". */
export async function fetchSessionUser(): Promise<SessionUser | null> {
  const { user } = await getJson<{ user: SessionUser | null }>(
    `${API}me`,
    'Could not check sign-in status.',
  );
  return user;
}

/** Verifies a Google credential server-side and starts a session. */
export async function signInWithGoogle(credential: string): Promise<SessionUser> {
  const { user } = await postJson<{ user: SessionUser }>(
    `${API}google`,
    { credential },
    'Google sign-in failed.',
  );
  return user;
}

export async function signOut(): Promise<void> {
  await postJson(`${API}logout`, undefined, 'Sign-out failed.');
}
