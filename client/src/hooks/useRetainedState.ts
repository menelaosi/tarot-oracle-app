import { useCallback, useState, type Dispatch, type SetStateAction } from 'react';

// Bump the version segment to invalidate every persisted key at once — e.g. after
// a change to a stored value's shape, or a database reseed that orphans stored
// reading ids.
const STORAGE_PREFIX = 'tarot-oracle:v1:';

// In-memory mirror of what's been read/written this session, so repeated mounts
// (tab switches) don't re-parse JSON and state still survives a switch even when
// localStorage is unavailable (private mode, sandboxed iframe, quota).
const cache = new Map<string, unknown>();

function storageKey(key: string): string {
  return STORAGE_PREFIX + key;
}

function readStored<T>(key: string): { hit: true; value: T } | { hit: false } {
  if (cache.has(key)) return { hit: true, value: cache.get(key) as T };
  try {
    const raw = localStorage.getItem(storageKey(key));
    if (raw === null) return { hit: false };
    const value = JSON.parse(raw) as T;
    cache.set(key, value);
    return { hit: true, value };
  } catch {
    return { hit: false };
  }
}

function writeStored<T>(key: string, value: T, persist: boolean): void {
  cache.set(key, value);
  if (!persist) return;
  try {
    localStorage.setItem(storageKey(key), JSON.stringify(value));
  } catch {
    // Quota exceeded / storage blocked — the in-memory cache still carries the
    // value for the rest of this session, so tab switches keep working.
  }
}

/**
 * A drop-in `useState` whose value persists across tab switches *and* full page
 * reloads. The value is JSON-serialised to `localStorage` under a namespaced,
 * versioned key and rehydrated on next mount; a module-level cache mirrors it so
 * remounts within a session don't re-parse.
 *
 * Per-viewer only, and the value must be JSON-serialisable — don't retain class
 * instances (e.g. a `Horoscope`); retain the inputs and recompute.
 *
 * Pass `{ persist: false }` for values that should survive tab switches but not a
 * reload — e.g. fetched reference data that would otherwise go stale.
 */
export function useRetainedState<T>(
  key: string,
  initialState: T | (() => T),
  { persist = true }: { persist?: boolean } = {},
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    const stored = readStored<T>(key);
    if (stored.hit) return stored.value;
    return initialState instanceof Function ? (initialState as () => T)() : initialState;
  });

  const setRetained = useCallback<Dispatch<SetStateAction<T>>>(
    (value) => {
      setState((prev) => {
        const next = value instanceof Function ? (value as (previous: T) => T)(prev) : value;
        writeStored(key, next, persist);
        return next;
      });
    },
    [key, persist],
  );

  return [state, setRetained];
}
