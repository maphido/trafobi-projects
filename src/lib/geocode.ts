/**
 * Geocode an address to coordinates using the free Nominatim (OpenStreetMap) API.
 * Uses address + city + country for precise placement.
 * Rate limit: 1 request/second on the public server.
 */
export async function geocode(
  city: string,
  countryCode: string,
  address?: string | null
): Promise<{ latitude: number; longitude: number } | null> {
  if (!city) return null;

  // Build query: "address, city" for precision, fall back to just "city"
  const query = address ? `${address}, ${city}` : city;

  const params = new URLSearchParams({
    q: query,
    countrycodes: countryCode.toLowerCase(),
    format: "json",
    limit: "1",
  });

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      {
        headers: {
          "User-Agent":
            "TrafoBI-Projects/1.0 (projekte.transformative-bildung.org)",
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
    console.error(`Geocoding failed for "${query}, ${countryCode}"`);
    return null;
  }
}
