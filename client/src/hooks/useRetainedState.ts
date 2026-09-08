import { useCallback, useState, type Dispatch, type SetStateAction } from 'react';

// A drop-in replacement for useState whose value survives the component
// unmounting and remounting — e.g. when react-router swaps route elements as
// you switch tabs. The value lives in this module-level cache, keyed by a
// caller-provided string, and is rehydrated on the next mount. A full page
// reload clears it.
const cache = new Map<string, unknown>();

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
