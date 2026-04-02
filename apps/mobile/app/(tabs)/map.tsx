import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useRouter } from "expo-router";
import { useMapPins } from "@/hooks/useTrips";
import { getCategoryConfig } from "@/lib/categoryConfig";
import { formatCurrency } from "@/lib/formatters";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import type { TravelerCategory } from "@travel-checker/shared/src/types";

interface PinPreview {
  id: string;
  title: string;
  destination: string;
  country: string;
  travelerCategory: string;
  totalBudget: number | null;
  currency: string;
}

export default function MapScreen() {
  const router = useRouter();
  const { data: pins, isLoading } = useMapPins();
  const mapRef = useRef<MapView>(null);
  const [selectedPin, setSelectedPin] = useState<PinPreview | null>(null);

  const initialRegion = useMemo(() => {
    if (!pins?.length) {
      return { latitude: 45.8, longitude: 15.97, latitudeDelta: 60, longitudeDelta: 60 };
    }
    const lats = pins.map((p) => Number(p.latitude));
    const lngs = pins.map((p) => Number(p.longitude));
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(maxLat - minLat, 10) * 1.4,
      longitudeDelta: Math.max(maxLng - minLng, 10) * 1.4,
    };
  }, [pins]);

  const uniqueCountries = useMemo(() => {
    if (!pins) return 0;
    return new Set(pins.map((p) => p.countryCode)).size;
  }, [pins]);

  const handleMarkerPress = useCallback((pin: PinPreview) => {
    setSelectedPin(pin);
  }, []);

  const handlePreviewPress = useCallback(() => {
    if (selectedPin) {
      router.push(`/trip/${selectedPin.id}`);
    }
  }, [selectedPin, router]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <LoadingSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1">
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        className="flex-1"
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
        onPress={() => setSelectedPin(null)}
      >
        {pins?.map((pin) => {
          const cat = getCategoryConfig(pin.travelerCategory as TravelerCategory);
          return (
            <Marker
              key={pin.id}
              coordinate={{
                latitude: Number(pin.latitude),
                longitude: Number(pin.longitude),
              }}
              title={pin.destination}
              pinColor={cat.color}
              onPress={() =>
                handleMarkerPress({
                  id: pin.id,
                  title: pin.title,
                  destination: pin.destination,
                  country: pin.country,
                  travelerCategory: pin.travelerCategory,
                  totalBudget: pin.totalBudget ?? null,
                  currency: pin.currency ?? "EUR",
                })
              }
            />
          );
        })}
      </MapView>

      {/* Bottom stats bar */}
      <SafeAreaView
        edges={["bottom"]}
        className="absolute bottom-0 left-0 right-0 bg-white/95 border-t border-gray-200"
      >
        <View className="flex-row justify-around py-2 px-4">
          <View className="items-center">
            <Text className="text-lg font-bold text-gray-900">
              {pins?.length ?? 0}
            </Text>
            <Text className="text-xs text-gray-500">Trips</Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold text-gray-900">
              {uniqueCountries}
            </Text>
            <Text className="text-xs text-gray-500">Countries</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Selected pin preview */}
      {selectedPin && (
        <TouchableOpacity
          onPress={handlePreviewPress}
          activeOpacity={0.9}
          className="absolute bottom-24 left-4 right-4 bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
        >
          <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
            {selectedPin.title}
          </Text>
          <Text className="text-sm text-gray-500 mt-0.5">
            {selectedPin.destination}, {selectedPin.country}
          </Text>
          <View className="flex-row items-center mt-2">
            <View
              className="px-2 py-0.5 rounded-full mr-2"
              style={{
                backgroundColor: getCategoryConfig(
                  selectedPin.travelerCategory as TravelerCategory
                ).bgColor,
              }}
            >
              <Text
                className="text-xs font-medium"
                style={{
                  color: getCategoryConfig(
                    selectedPin.travelerCategory as TravelerCategory
                  ).textColor,
                }}
              >
                {
                  getCategoryConfig(
                    selectedPin.travelerCategory as TravelerCategory
                  ).label
                }
              </Text>
            </View>
            {selectedPin.totalBudget != null && (
              <Text className="text-sm font-semibold text-sky-600">
                {formatCurrency(selectedPin.totalBudget, selectedPin.currency)}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
