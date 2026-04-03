import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import type { PlaceDetails } from "@travel-checker/shared/src/types";
import { usePlacesAutocomplete, usePlaceDetails } from "@/hooks/usePlaces";
import { Input } from "./Input";

interface PlacesAutocompleteProps {
  value?: string;
  onSelectPlace: (place: PlaceDetails) => void;
  placeholder?: string;
  label?: string;
}

export function PlacesAutocomplete({
  value,
  onSelectPlace,
  placeholder = "Search destination...",
  label,
}: PlacesAutocompleteProps) {
  const [query, setQuery] = useState(value ?? "");
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: predictions, isLoading } = usePlacesAutocomplete(query);
  const { data: placeDetails } = usePlaceDetails(selectedPlaceId);

  React.useEffect(() => {
    if (placeDetails && selectedPlaceId) {
      onSelectPlace(placeDetails);
      setShowResults(false);
      setSelectedPlaceId(null);
    }
  }, [placeDetails, selectedPlaceId]);

  const handleSelectPrediction = (placeId: string, description: string) => {
    if (blurTimeout.current) clearTimeout(blurTimeout.current);
    setQuery(description);
    setSelectedPlaceId(placeId);
  };

  return (
    <View className="relative">
      <Input
        label={label}
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          setShowResults(true);
        }}
        placeholder={placeholder}
        onFocus={() => {
          if (blurTimeout.current) clearTimeout(blurTimeout.current);
          setShowResults(true);
        }}
        onBlur={() => {
          blurTimeout.current = setTimeout(() => setShowResults(false), 200);
        }}
        rightIcon={
          isLoading ? <ActivityIndicator size="small" color="#0ea5e9" /> : null
        }
      />

      {showResults && predictions && predictions.length > 0 && (
        <View className="absolute top-full left-0 right-0 z-50 mt-1 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <FlatList
            data={predictions}
            keyExtractor={(item) => item.placeId}
            scrollEnabled={false}
            keyboardShouldPersistTaps="always"
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  handleSelectPrediction(item.placeId, item.description)
                }
                style={({ pressed }) => ({
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: "#f9fafb",
                  backgroundColor: pressed ? "#f9fafb" : "transparent",
                })}
              >
                <Text className="text-sm font-medium text-gray-900">
                  {item.mainText}
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5">
                  {item.secondaryText}
                </Text>
              </Pressable>
            )}
          />
        </View>
      )}
    </View>
  );
}
