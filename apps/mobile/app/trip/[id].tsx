import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Haptics from "expo-haptics";
import { useTripDetail, useDeleteTrip } from "@/hooks/useTrips";
import { BudgetChart, budgetToCategories } from "@/components/BudgetChart";
import { PhotoGrid } from "@/components/PhotoGrid";
import { getCategoryConfig } from "@/lib/categoryConfig";
import { formatDateRange, getTripDuration, formatCurrency } from "@/lib/formatters";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { TripReactions } from "@/components/TripReactions";
import { TripComments } from "@/components/TripComments";
import { useThemeStore } from "@/lib/theme";
import type { TravelerCategory } from "@travel-checker/shared/src/types";

type TabKey = "overview" | "map" | "photos" | "budget";

type IoniconsName = keyof typeof Ionicons.glyphMap;

const TABS: { key: TabKey; label: string; icon: IoniconsName }[] = [
  { key: "overview", label: "Overview", icon: "list-outline" },
  { key: "map", label: "Map", icon: "map-outline" },
  { key: "photos", label: "Photos", icon: "camera-outline" },
  { key: "budget", label: "Budget", icon: "wallet-outline" },
];

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: trip, isLoading } = useTripDetail(id);
  const deleteMutation = useDeleteTrip();
  const { colors } = useThemeStore();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  const confirmDelete = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        router.back();
      },
      onError: (err) => {
        setShowDeleteConfirm(false);
        Alert.alert("Error", err.message);
      },
    });
  }, [id, deleteMutation, router]);

  const switchTab = useCallback((tab: TabKey) => {
    void Haptics.selectionAsync();
    setActiveTab(tab);
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <LoadingSkeleton />
      </SafeAreaView>
    );
  }

  if (!trip) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-500">Trip not found</Text>
      </SafeAreaView>
    );
  }

  const category = getCategoryConfig(trip.travelerCategory as TravelerCategory);
  const duration = getTripDuration(trip.startDate, trip.endDate);
  const photoCount = trip.photos?.length ?? 0;

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        {trip.coverPhotoUrl ? (
          <Image source={{ uri: trip.coverPhotoUrl }} className="w-full h-56" resizeMode="cover" />
        ) : (
          <View className="w-full h-56 items-center justify-center" style={{ backgroundColor: category.color }}>
            <Ionicons name="airplane" size={56} color="rgba(255,255,255,0.8)" />
          </View>
        )}

        {/* Back & Actions overlay */}
        <SafeAreaView edges={["top"]} className="absolute top-0 left-0 right-0 flex-row justify-between px-4 pt-2">
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "rgba(0,0,0,0.4)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </Pressable>
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => router.push(`/trip/edit/${id}`)}
              accessibilityRole="button"
              accessibilityLabel="Edit trip"
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "rgba(0,0,0,0.4)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="create-outline" size={20} color="#fff" />
            </Pressable>
            <Pressable
              onPress={handleDelete}
              accessibilityRole="button"
              accessibilityLabel="Delete trip"
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "rgba(0,0,0,0.4)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="trash-outline" size={20} color="#fff" />
            </Pressable>
          </View>
        </SafeAreaView>

        <View style={{ paddingHorizontal: 16, marginTop: -24, paddingBottom: 32, maxWidth: 560, width: "100%", alignSelf: "center" }}>
          {/* Title card */}
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <Text className="text-xl font-bold text-gray-900">{trip.title}</Text>
            <Text className="text-sm text-gray-500 mt-1">{trip.destination}, {trip.country}</Text>
            <View className="flex-row flex-wrap items-center mt-3 gap-2">
              <View className="px-2.5 py-1 rounded-full" style={{ backgroundColor: category.bgColor }}>
                <Text className="text-xs font-medium" style={{ color: category.textColor }}>
                  {category.emoji} {category.label}
                </Text>
              </View>
              <View className="bg-gray-100 px-2.5 py-1 rounded-full">
                <Text className="text-xs text-gray-600">{formatDateRange(trip.startDate, trip.endDate)}</Text>
              </View>
              <View className="bg-gray-100 px-2.5 py-1 rounded-full">
                <Text className="text-xs text-gray-600">{duration} {duration === 1 ? "day" : "days"}</Text>
              </View>
              {trip.season && (
                <View className="bg-gray-100 px-2.5 py-1 rounded-full">
                  <Text className="text-xs text-gray-600 capitalize">{trip.season}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Tab bar */}
          <View className="flex-row bg-white rounded-2xl mt-3 border border-gray-100 overflow-hidden">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <Pressable
                  key={tab.key}
                  onPress={() => switchTab(tab.key)}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    alignItems: "center",
                    borderBottomWidth: isActive ? 2 : 0,
                    borderBottomColor: "#0284c7",
                    minHeight: 52,
                  }}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isActive }}
                  accessibilityLabel={tab.label}
                >
                  <Ionicons
                    name={tab.icon}
                    size={20}
                    color={isActive ? "#0284c7" : "#9ca3af"}
                  />
                  <Text
                    style={{
                      fontSize: 11,
                      marginTop: 2,
                      fontWeight: isActive ? "600" : "400",
                      color: isActive ? "#0284c7" : "#9ca3af",
                    }}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Tab content */}
          <View className="mt-3">
            {activeTab === "overview" && <OverviewTab trip={trip} category={category} />}
            {activeTab === "map" && <MapTab latitude={Number(trip.latitude)} longitude={Number(trip.longitude)} destination={trip.destination} />}
            {activeTab === "photos" && <PhotosTab tripId={id} photos={trip.photos ?? []} onManage={() => router.push(`/trip/photos/${id}`)} />}
            {activeTab === "budget" && <BudgetTab trip={trip} />}
          </View>

          {/* Reactions */}
          <View
            style={{
              marginTop: 16,
              backgroundColor: colors.card,
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.cardBorder,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.textSecondary, marginBottom: 10 }}>
              Reactions
            </Text>
            <TripReactions tripId={id} />
          </View>

          {/* Comments */}
          <View
            style={{
              marginTop: 12,
              backgroundColor: colors.card,
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.cardBorder,
            }}
          >
            <TripComments tripId={id} />
          </View>
        </View>
      </ScrollView>

      {/* Delete Confirm Modal */}
      <Modal visible={showDeleteConfirm} transparent animationType="fade">
        <Pressable
          onPress={() => setShowDeleteConfirm(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
          }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              borderRadius: 24,
              padding: 32,
              width: "100%",
              maxWidth: 360,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 24,
              elevation: 10,
            }}
          >
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: "#fee2e2",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text style={{ fontSize: 32 }}>🗑️</Text>
            </View>
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#111827", textAlign: "center", marginBottom: 8 }}>
              Delete this trip?
            </Text>
            <Text style={{ fontSize: 14, color: "#6b7280", textAlign: "center", marginBottom: 24 }}>
              This action cannot be undone. All trip data, photos, and budget info will be permanently removed.
            </Text>
            <Pressable
              onPress={confirmDelete}
              disabled={deleteMutation.isPending}
              style={{
                backgroundColor: deleteMutation.isPending ? "#fca5a5" : "#ef4444",
                width: "100%",
                paddingVertical: 16,
                borderRadius: 16,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
                {deleteMutation.isPending ? "Deleting..." : "Yes, Delete Trip"}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setShowDeleteConfirm(false)}
              disabled={deleteMutation.isPending}
              style={{ width: "100%", paddingVertical: 12, borderRadius: 16, alignItems: "center" }}
            >
              <Text style={{ color: "#6b7280", fontSize: 16, fontWeight: "500" }}>Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

/* --- Tab Components --- */

function OverviewTab({ trip, category }: { trip: { accommodation?: { name: string; type: string; rating?: number | null; url?: string | null } | null; description?: string | null }; category: ReturnType<typeof getCategoryConfig> }) {
  return (
    <>
      {trip.accommodation && (
        <View className="bg-white rounded-2xl p-4 border border-gray-100 mb-3">
          <Text className="text-base font-bold text-gray-900 mb-2">Accommodation</Text>
          <Text className="text-sm text-gray-700">{trip.accommodation.name}</Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-xs text-gray-400 capitalize">{trip.accommodation.type}</Text>
            {trip.accommodation.rating && (
              <Text className="text-xs text-yellow-500 ml-2">{"★".repeat(trip.accommodation.rating)}</Text>
            )}
          </View>
        </View>
      )}
      {trip.description && (
        <View className="bg-white rounded-2xl p-4 border border-gray-100">
          <Text className="text-base font-bold text-gray-900 mb-2">Story</Text>
          <Text className="text-sm text-gray-600 leading-5">{trip.description}</Text>
        </View>
      )}
      {!trip.accommodation && !trip.description && (
        <View className="items-center py-8">
          <Text className="text-gray-400 text-sm">No details added yet</Text>
        </View>
      )}
    </>
  );
}

function MapTab({ latitude, longitude, destination }: { latitude: number; longitude: number; destination: string }) {
  return (
    <View className="bg-white rounded-2xl overflow-hidden border border-gray-100" style={{ height: 280 }}>
      <MapView
        provider={PROVIDER_GOOGLE}
        className="flex-1"
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
      >
        <Marker coordinate={{ latitude, longitude }} title={destination} />
      </MapView>
    </View>
  );
}

function PhotosTab({ tripId, photos, onManage }: { tripId: string; photos: { id: string; url: string; thumbnailUrl: string | null; caption: string | null; sortOrder: number; width: number | null; height: number | null; sizeBytes: number | null; createdAt: string; tripId: string }[]; onManage: () => void }) {
  return (
    <View className="bg-white rounded-2xl p-4 border border-gray-100">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-base font-bold text-gray-900">Photos ({photos.length})</Text>
        <TouchableOpacity onPress={onManage} accessibilityRole="button" accessibilityLabel="Manage photos">
          <Text className="text-sky-500 text-sm font-medium">Manage</Text>
        </TouchableOpacity>
      </View>
      <PhotoGrid tripId={tripId} photos={photos} editable />
    </View>
  );
}

function BudgetTab({ trip }: { trip: { budget?: { accommodation: number; food: number; transport: number; activities: number; other: number; total: number; currency: string; isApproximate: boolean } | null } }) {
  if (!trip.budget) {
    return (
      <View className="bg-white rounded-2xl p-4 border border-gray-100 items-center py-8">
        <Text className="text-2xl mb-2">💰</Text>
        <Text className="text-gray-400 text-sm">No budget recorded</Text>
      </View>
    );
  }

  const categories = budgetToCategories(trip.budget);

  return (
    <View className="bg-white rounded-2xl p-4 border border-gray-100">
      <BudgetChart categories={categories} total={trip.budget.total} currency={trip.budget.currency} />
      {trip.budget.isApproximate && (
        <Text className="text-xs text-gray-400 mt-2">* Approximate values</Text>
      )}
    </View>
  );
}
