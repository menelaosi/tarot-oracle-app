import { afterEach, describe, expect, it, vi } from 'vitest';
import { requestCurrentLocation } from './geolocation';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('requestCurrentLocation', () => {
  it('resolves to null when geolocation is unavailable on navigator', async () => {
    vi.stubGlobal('navigator', {});
    await expect(requestCurrentLocation()).resolves.toBeNull();
  });

  it('resolves to null when navigator itself is unavailable', async () => {
    vi.stubGlobal('navigator', undefined);
    await expect(requestCurrentLocation()).resolves.toBeNull();
  });

  it('resolves to the coordinates on a successful lookup', async () => {
    vi.stubGlobal('navigator', {
      geolocation: {
        getCurrentPosition: (success: PositionCallback) => {
          success({
            coords: { latitude: 40.7128, longitude: -74.006 },
          } as GeolocationPosition);
        },
      },
    });

    await expect(requestCurrentLocation()).resolves.toEqual({
      latitude: 40.7128,
      longitude: -74.006,
    });
  });

  it('resolves to null (never rejects) when the user denies the prompt', async () => {
    vi.stubGlobal('navigator', {
      geolocation: {
        getCurrentPosition: (_success: PositionCallback, error: PositionErrorCallback) => {
          error({ code: 1, message: 'User denied Geolocation' } as GeolocationPositionError);
        },
      },
    });

    await expect(requestCurrentLocation()).resolves.toBeNull();
  });

  it('passes a timeout and maximumAge option to getCurrentPosition', async () => {
    const getCurrentPosition = vi.fn();
    vi.stubGlobal('navigator', { geolocation: { getCurrentPosition } });

    void requestCurrentLocation();

    expect(getCurrentPosition).toHaveBeenCalledWith(expect.any(Function), expect.any(Function), {
      timeout: 10_000,
      maximumAge: 300_000,
    });
  });
});
