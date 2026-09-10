import { useCallback, useState } from 'react';
import { messageFrom } from '../lib/http';

/**
 * The single error line a feature view shows. `clearError` is the dismiss
 * control and the "starting a new action" reset; `failWith` renders a caught
 * value through `messageFrom`; `setError` remains for literal validation copy.
 */
export function useError() {
  const [error, setError] = useState('');

  const clearError = useCallback(() => setError(''), []);

  const failWith = useCallback(
    (cause: unknown, fallback?: string) => setError(messageFrom(cause, fallback)),
    [],
  );

  return { error, setError, clearError, failWith };
}
