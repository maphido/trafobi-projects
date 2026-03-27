/**
 * Geocode a city+country to coordinates using the free Nominatim (OpenStreetMap) API.
 * Rate limit: 1 request/second on the public server. Fine for our use case (geocode on approval only).
 */
export async function geocode(
  city: string,
  countryCode: string
): Promise<{ latitude: number; longitude: number } | null> {
  if (!city) return null;

  const params = new URLSearchParams({
    q: city,
    countrycodes: countryCode.toLowerCase(),
    format: "json",
    limit: "1",
  });

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      {
        headers: {
          // Nominatim requires a valid User-Agent identifying the application
          "User-Agent": "TrafoBI-Projects/1.0 (projekte.transformative-bildung.org)",
        },
      }
    );

    if (!res.ok) return null;

    const results = await res.json();
    if (!results.length) return null;

    const { lat, lon } = results[0];
    return {
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
    };
  } catch {
    console.error(`Geocoding failed for "${city}, ${countryCode}"`);
    return null;
  }
}
