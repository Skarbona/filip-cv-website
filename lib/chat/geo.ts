export interface Place {
  city: string;
  country: string;
}

function currentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation is not available"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10_000,
      maximumAge: 600_000,
    });
  });
}

/**
 * Asks the browser for the visitor's position (the browser shows its own permission prompt)
 * and turns it into a city with BigDataCloud's free client-side API.
 * Coordinates are rounded to about 1 km first and are not stored anywhere.
 */
export async function locateCity(signal?: AbortSignal): Promise<Place> {
  const { coords } = await currentPosition();
  const params = new URLSearchParams({
    latitude: coords.latitude.toFixed(2),
    longitude: coords.longitude.toFixed(2),
    localityLanguage: "en",
  });
  const response = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?${params}`,
    { signal }
  );
  if (!response.ok) throw new Error(`Reverse geocoding failed with ${response.status}`);
  const data: { city?: string; locality?: string; countryName?: string } = await response.json();
  return { city: data.city || data.locality || "", country: data.countryName || "" };
}
