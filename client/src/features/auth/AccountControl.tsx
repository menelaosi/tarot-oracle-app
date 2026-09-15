import { GoogleLogin } from '@react-oauth/google';
import { useEffect, useRef, useState } from 'react';
import { useError } from '../../hooks/useError';
import { signInWithGoogle, type SessionUser } from './api';
import type { SessionState } from './useSession';

type AccountControlProps = {
  readonly session: SessionState;
  readonly onSignedIn: (user: SessionUser) => void;
  readonly onSignOut: () => Promise<void>;
};

/**
 * The masthead's account entry point. The moon mark is the trigger — clicking
 * it opens a popover (a Google sign-in button when signed out, name + sign-out
 * when in) rather than showing either inline all the time. Stays a fixed-size
 * button through the initial loading tick too (just disabled), so the masthead
 * never shifts once the real sign-in state is known.
 */
function AccountControl({ session, onSignedIn, onSignOut }: AccountControlProps) {
  const { error, failWith, clearError } = useError();
  const { status, user } = session;
  const isLoading = status === 'loading';

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Closes on an outside click or Escape — only while open, so a signed-out
  // visitor who never opens the popover pays for zero extra listeners.
  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="account-control" ref={containerRef}>
      <button
        type="button"
        className="moon-mark"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={user ? `Account: ${user.displayName ?? user.email}` : 'Sign in'}
        disabled={isLoading}
        onClick={() => setIsOpen((open) => !open)}
      >
        ☾
      </button>

      {isOpen && !isLoading && (
        <div className="account-popover">
          {user ? (
            <>
              <span>{user.displayName ?? user.email}</span>
              <button
                type="button"
                onClick={() => {
                  clearError();
                  onSignOut()
                    .then(() => setIsOpen(false))
                    .catch(failWith);
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <GoogleLogin
              onSuccess={({ credential }) => {
                if (!credential) {
                  failWith(new Error('Google did not return a credential.'));
                  return;
                }
                clearError();
                signInWithGoogle(credential)
                  .then((signedInUser) => {
                    onSignedIn(signedInUser);
                    setIsOpen(false);
                  })
                  .catch(failWith);
              }}
              onError={() => failWith(new Error('Google sign-in failed.'))}
            />
          )}
          {error && <p className="error-message">{error}</p>}
        </div>
      )}
    </div>
  );
}

export default AccountControl;
