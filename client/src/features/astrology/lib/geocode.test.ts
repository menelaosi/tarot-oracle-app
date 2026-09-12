import { afterEach, describe, expect, it, vi } from 'vitest';
import { searchPlaces } from './geocode';

function photonResponse(features: unknown[]): Response {
  return { ok: true, json: async () => ({ features }) } as Response;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('searchPlaces', () => {
  it('maps a Photon feature to a Place, swapping GeoJSON [lon, lat] to latitude/longitude', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        photonResponse([
          {
            geometry: { coordinates: [-74.006, 40.7128] },
            properties: { name: 'New York', city: 'New York', state: 'NY', country: 'USA' },
          },
        ]),
      ),
    );

    const places = await searchPlaces('new york');
    expect(places).toEqual([
      { label: 'New York, New York, NY, USA', latitude: 40.7128, longitude: -74.006 },
    ]);
  });

  it('omits missing label parts rather than leaving empty commas', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        photonResponse([
          {
            geometry: { coordinates: [2.35, 48.85] },
            properties: { name: 'Paris', country: 'France' }, // no city/state
          },
        ]),
      ),
    );

    const [place] = await searchPlaces('paris');
    expect(place.label).toBe('Paris, France');
  });

  it('URL-encodes the query string', async () => {
    const fetchMock = vi.fn().mockResolvedValue(photonResponse([]));
    vi.stubGlobal('fetch', fetchMock);

    await searchPlaces('New York, NY');

    const [url] = fetchMock.mock.calls[0] as [string];
    expect(url).toContain(encodeURIComponent('New York, NY'));
  });

  it('throws a plain Error when the lookup responds with a non-ok status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false } as Response));
    await expect(searchPlaces('anywhere')).rejects.toThrow('Place lookup failed.');
  });

  it('returns an empty array when there are no matching features', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(photonResponse([])));
    await expect(searchPlaces('asdkfjaslkdfj')).resolves.toEqual([]);
  });
});
