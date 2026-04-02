import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { fetchPlaceAutocomplete, fetchPlaceDetails } from "@/api/places";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function usePlacesAutocomplete(query: string) {
  const debouncedQuery = useDebounce(query, 350);

  return useQuery({
    queryKey: ["places", "autocomplete", debouncedQuery],
    queryFn: () => fetchPlaceAutocomplete(debouncedQuery),
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 1000 * 60 * 5,
    placeholderData: [],
  });
}

export function usePlaceDetails(placeId: string | null) {
  return useQuery({
    queryKey: ["places", "details", placeId],
    queryFn: () => fetchPlaceDetails(placeId!),
    enabled: Boolean(placeId),
    staleTime: 1000 * 60 * 30,
  });
}
