import { useCallback, useEffect, useState } from 'react';
import { fetchSessionUser, signOut, type SessionUser } from './api';

// user: null on the first two variants isn't a filler default — they're
// exactly the two states with no signed-in user — so callers can read
// session.user directly without narrowing on status first.
export type SessionState =
  | { status: 'loading'; user: null }
  | { status: 'signed-out'; user: null }
  | { status: 'signed-in'; user: SessionUser };

/**
 * The current sign-in state, checked fresh via GET /api/auth/me on mount.
 * Deliberately not backed by useRetainedState — session truth lives in the
 * httpOnly cookie server-side, and caching "signed in as X" in localStorage
 * would show stale UI after a server-side logout/expiry until the next full
 * check, exactly what useRetainedState's own docs say it's unsuited for.
 */
export function useSession() {
  const [state, setState] = useState<SessionState>({ status: 'loading', user: null });

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      // A failed check and "no session" both land here as null — same
      // outcome (signed-out), so there's only one place that sets state.
      const user = await fetchSessionUser().catch(() => null);
      if (!cancelled) {
        setState(user ? { status: 'signed-in', user } : { status: 'signed-out', user: null });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const onSignedIn = useCallback(
    (user: SessionUser) => setState({ status: 'signed-in', user }),
    [],
  );

  const onSignOut = useCallback(async () => {
    await signOut();
    setState({ status: 'signed-out', user: null });
  }, []);

  return { state, onSignedIn, onSignOut };
}
