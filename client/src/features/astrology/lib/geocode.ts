export type Place = {
  label: string;
  latitude: number;
  longitude: number;
};

type PhotonFeature = {
  geometry: { coordinates: [number, number] };
  properties: {
    name?: string;
    city?: string;
    state?: string;
    country?: string;
  };
};

function toLabel(properties: PhotonFeature['properties']): string {
  return [properties.name, properties.city, properties.state, properties.country]
    .filter(Boolean)
    .join(', ');
}

/**
 * Autocomplete against Photon (photon.komoot.io) — a free, keyless geocoder.
 * Third-party, so it does its own fetch rather than going through lib/http.
 * `signal` lets the caller cancel stale in-flight requests as the user types.
 */
export async function searchPlaces(query: string, signal?: AbortSignal): Promise<Place[]> {
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lang=en`;
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error('Place lookup failed.');

  const data = (await response.json()) as { features: PhotonFeature[] };
  return data.features.map((feature) => ({
    label: toLabel(feature.properties),
    // GeoJSON coordinates are [longitude, latitude].
    latitude: feature.geometry.coordinates[1],
    longitude: feature.geometry.coordinates[0],
  }));
}
