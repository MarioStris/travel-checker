import type {
  PlacePrediction,
  PlaceDetails,
} from "@travel-checker/shared/src/types";
import { get } from "./client";

export async function fetchPlaceAutocomplete(
  query: string
): Promise<PlacePrediction[]> {
  if (!query.trim()) return [];
  const response = await get<{ predictions: PlacePrediction[] }>(
    `/api/places/autocomplete?q=${encodeURIComponent(query)}`
  );
  return response.predictions;
}

export async function fetchPlaceDetails(placeId: string): Promise<PlaceDetails> {
  return get<PlaceDetails>(
    `/api/places/details?placeId=${encodeURIComponent(placeId)}`
  );
}
