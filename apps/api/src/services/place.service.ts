const PLACES_BASE = 'https://maps.googleapis.com/maps/api/place';

export type PlacePrediction = {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
};

export type PlaceDetails = {
  name: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
  country: string;
  countryCode: string;
  city: string;
};

export async function autocomplete(
  query: string,
  apiKey: string,
): Promise<PlacePrediction[]> {
  const params = new URLSearchParams({
    input: query,
    types: '(cities)',
    key: apiKey,
  });

  const res = await fetch(`${PLACES_BASE}/autocomplete/json?${params}`);
  if (!res.ok) throw new Error(`Google Places autocomplete failed: ${res.status}`);

  const data = await res.json() as { predictions: GooglePrediction[] };

  return (data.predictions ?? []).map((p) => ({
    placeId: p.place_id,
    description: p.description,
    mainText: p.structured_formatting?.main_text ?? '',
    secondaryText: p.structured_formatting?.secondary_text ?? '',
  }));
}

export async function getPlaceDetails(
  placeId: string,
  apiKey: string,
): Promise<PlaceDetails | null> {
  const params = new URLSearchParams({
    place_id: placeId,
    fields: 'geometry,address_components,name,formatted_address',
    key: apiKey,
  });

  const res = await fetch(`${PLACES_BASE}/details/json?${params}`);
  if (!res.ok) throw new Error(`Google Places details failed: ${res.status}`);

  const data = await res.json() as GoogleDetailsResponse;
  if (data.status !== 'OK') return null;

  const result = data.result;
  const location = result.geometry?.location;
  const components = result.address_components ?? [];
  const country = components.find((c) => c.types.includes('country'));

  return {
    name: result.name,
    formattedAddress: result.formatted_address,
    latitude: location?.lat ?? 0,
    longitude: location?.lng ?? 0,
    country: country?.long_name ?? '',
    countryCode: country?.short_name ?? '',
    city: result.name,
  };
}

// Internal Google API types
type GooglePrediction = {
  place_id: string;
  description: string;
  structured_formatting?: { main_text: string; secondary_text: string };
};

type GoogleAddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type GoogleDetailsResponse = {
  status: string;
  result: {
    name: string;
    formatted_address: string;
    geometry?: { location: { lat: number; lng: number } };
    address_components?: GoogleAddressComponent[];
  };
};
