import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateTripInput, UpdateTripInput } from "@travel-checker/shared/src/types";
import {
  fetchTrips,
  fetchTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  fetchMapPins,
  type TripsListParams,
} from "@/api/trips";

export const TRIP_KEYS = {
  all: ["trips"] as const,
  list: (params?: TripsListParams) => ["trips", "list", params] as const,
  detail: (id: string) => ["trips", "detail", id] as const,
  mapPins: ["trips", "mapPins"] as const,
};

export function useTrips(params?: TripsListParams) {
  return useQuery({
    queryKey: TRIP_KEYS.list(params),
    queryFn: () => fetchTrips(params),
    staleTime: 1000 * 60 * 5,
  });
}

export function useTripDetail(id: string) {
  return useQuery({
    queryKey: TRIP_KEYS.detail(id),
    queryFn: () => fetchTripById(id),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(id),
  });
}

export function useMapPins() {
  return useQuery({
    queryKey: TRIP_KEYS.mapPins,
    queryFn: fetchMapPins,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTripInput) => createTrip(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: TRIP_KEYS.all });
    },
  });
}

export function useUpdateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTripInput }) =>
      updateTrip(id, input),
    onSuccess: (data) => {
      queryClient.setQueryData(TRIP_KEYS.detail(data.id), data);
      void queryClient.invalidateQueries({ queryKey: TRIP_KEYS.list() });
    },
  });
}

export function useDeleteTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTrip(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: TRIP_KEYS.detail(id) });
      void queryClient.invalidateQueries({ queryKey: TRIP_KEYS.list() });
      void queryClient.invalidateQueries({ queryKey: TRIP_KEYS.mapPins });
    },
  });
}
