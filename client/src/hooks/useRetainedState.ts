import { useCallback, useState, type Dispatch, type SetStateAction } from 'react';

// Survives unmount/remount by living outside the component tree. Cleared on reload.
const cache = new Map<string, unknown>();

/**
 * A drop-in `useState` whose value persists when the component unmounts and
 * remounts — e.g. when react-router swaps route elements on a tab switch. The
 * value is kept in a module-level cache under `key` and rehydrated on next mount.
 * Per-viewer and in-memory only; a full page reload starts fresh.
 */
export function useRetainedState<T>(
  key: string,
  initialState: T | (() => T),
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    if (cache.has(key)) return cache.get(key) as T;
    return initialState instanceof Function ? (initialState as () => T)() : initialState;
  });

  const setRetained = useCallback<Dispatch<SetStateAction<T>>>(
    (value) => {
      setState((prev) => {
        const next = value instanceof Function ? (value as (previous: T) => T)(prev) : value;
        cache.set(key, next);
        return next;
      });
    },
    [key],
  );

  return [state, setRetained];
}
