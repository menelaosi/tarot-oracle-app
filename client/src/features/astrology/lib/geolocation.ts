// Thin promise wrapper over the browser geolocation API. Used by the transits
// view to offer "cast for where I am now" instead of the birth coordinates.

export type Coordinates = { latitude: number; longitude: number };

/**
 * Asks the browser for the user's current position. Resolves to `null` — never
 * rejects — when geolocation is unavailable, the user denies the prompt, or the
 * lookup times out, so callers can just fall back to the birth location.
 */
export function requestCurrentLocation(): Promise<Coordinates | null> {
  if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      () => resolve(null),
      { timeout: 10_000, maximumAge: 300_000 },
    );
  });
}
