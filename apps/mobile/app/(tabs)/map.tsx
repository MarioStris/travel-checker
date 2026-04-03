import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useRouter } from "expo-router";
import { useMapPins } from "@/hooks/useTrips";
import { getCategoryConfig } from "@/lib/categoryConfig";
import { formatCurrency } from "@/lib/formatters";
import { Ionicons } from "@expo/vector-icons";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { Sidebar } from "@/components/Sidebar";
import { useCurrentUser } from "@/hooks/useUser";
import { useThemeStore } from "@/lib/theme";
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
  const { data: user } = useCurrentUser();
  const { colors } = useThemeStore();
  const mapRef = useRef<MapView>(null);
  const [selectedPin, setSelectedPin] = useState<PinPreview | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
        <LoadingSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
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

      {/* Floating avatar button — top right */}
      <SafeAreaView
        edges={["top"]}
        style={{ position: "absolute", top: 0, right: 0 }}
        pointerEvents="box-none"
      >
        <Pressable
          onPress={() => setSidebarOpen(true)}
          accessibilityLabel="Open profile menu"
          accessibilityRole="button"
          style={({ pressed }) => ({
            width: 44,
            height: 44,
            borderRadius: 22,
            overflow: "hidden",
            opacity: pressed ? 0.7 : 1,
            borderWidth: 2,
            borderColor: "rgba(255,255,255,0.9)",
            marginTop: 8,
            marginRight: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 4,
          })}
        >
          {user?.avatarUrl ? (
            <Image
              source={{ uri: user.avatarUrl }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          ) : (
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.tabBar,
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Ionicons name="person" size={18} color={colors.textSecondary} />
            </View>
          )}
        </Pressable>
      </SafeAreaView>

      {/* Bottom stats bar — above the floating tab bar */}
      <View
        style={{
          position: "absolute",
          bottom: 92,
          left: 16,
          right: 16,
          backgroundColor: colors.tabBar,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.tabBarBorder,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-around", paddingVertical: 10, paddingHorizontal: 16 }}>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>
              {pins?.length ?? 0}
            </Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary }}>Trips</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>
              {uniqueCountries}
            </Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary }}>Countries</Text>
          </View>
        </View>
      </View>

      {/* Selected pin preview */}
      {selectedPin && (
        <TouchableOpacity
          onPress={handlePreviewPress}
          activeOpacity={0.9}
          style={{
            position: "absolute",
            bottom: 156,
            left: 16,
            right: 16,
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.12,
            shadowRadius: 8,
            elevation: 6,
            borderWidth: 1,
            borderColor: colors.cardBorder,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text }} numberOfLines={1}>
            {selectedPin.title}
          </Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 2 }}>
            {selectedPin.destination}, {selectedPin.country}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 12,
                marginRight: 8,
                backgroundColor: getCategoryConfig(
                  selectedPin.travelerCategory as TravelerCategory
                ).bgColor,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "500",
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
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.accent }}>
                {formatCurrency(selectedPin.totalBudget, selectedPin.currency)}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      )}

      <Sidebar visible={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </View>
  );
}
