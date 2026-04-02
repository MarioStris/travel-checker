import type {
  TripDTO,
  CreateTripInput,
  UpdateTripInput,
  MapPin,
} from "@travel-checker/shared/src/types";
import { get, post, patch, del } from "./client";

export interface TripsListParams {
  page?: number;
  limit?: number;
  category?: string;
  country?: string;
}

export interface MapPinResponse {
  id: string;
  tripId: string;
  destination: string;
  country: string;
  latitude: number;
  longitude: number;
  travelerCategory: string;
  coverPhotoUrl: string | null;
}

interface TripsListResponse {
  trips: TripDTO[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export async function fetchTrips(params?: TripsListParams): Promise<TripDTO[]> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.category) query.set("category", params.category);
  if (params?.country) query.set("country", params.country);

  const qs = query.toString();
  const response = await get<TripsListResponse>(`/api/trips${qs ? `?${qs}` : ""}`);
  return response.trips;
}

export async function fetchTripById(id: string): Promise<TripDTO> {
  return get<TripDTO>(`/api/trips/${id}`);
}

export async function createTrip(input: CreateTripInput): Promise<TripDTO> {
  return post<TripDTO>("/api/trips", input);
}

export async function updateTrip(
  id: string,
  input: UpdateTripInput
): Promise<TripDTO> {
  return patch<TripDTO>(`/api/trips/${id}`, input);
}

export async function deleteTrip(id: string): Promise<void> {
  return del<void>(`/api/trips/${id}`);
}

export async function fetchMapPins(): Promise<MapPinResponse[]> {
  return get<MapPinResponse[]>("/api/trips/map/pins");
}
