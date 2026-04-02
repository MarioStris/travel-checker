import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Haptics from "expo-haptics";
import { useTripDetail, useDeleteTrip } from "@/hooks/useTrips";
import { BudgetChart, budgetToCategories } from "@/components/BudgetChart";
import { PhotoGrid } from "@/components/PhotoGrid";
import { getCategoryConfig } from "@/lib/categoryConfig";
import { formatDateRange, getTripDuration, formatCurrency } from "@/lib/formatters";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import type { TravelerCategory } from "@travel-checker/shared/src/types";

type TabKey = "overview" | "map" | "photos" | "budget";

const TABS: { key: TabKey; label: string; emoji: string }[] = [
  { key: "overview", label: "Overview", emoji: "📋" },
  { key: "map", label: "Map", emoji: "🗺️" },
  { key: "photos", label: "Photos", emoji: "📷" },
  { key: "budget", label: "Budget", emoji: "💰" },
];

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: trip, isLoading } = useTripDetail(id);
  const deleteMutation = useDeleteTrip();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  const handleDelete = useCallback(() => {
    Alert.alert("Delete Trip", "Are you sure? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          deleteMutation.mutate(id, {
            onSuccess: () => router.back(),
            onError: (err) => Alert.alert("Error", err.message),
          });
        },
      },
    ]);
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
            <Text className="text-6xl">{category.emoji}</Text>
          </View>
        )}

        {/* Back & Actions overlay */}
        <SafeAreaView edges={["top"]} className="absolute top-0 left-0 right-0 flex-row justify-between px-4 pt-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-black/40 w-10 h-10 rounded-full items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text className="text-white text-lg">{"<"}</Text>
          </TouchableOpacity>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => router.push(`/trip/edit/${id}`)}
              className="bg-black/40 w-10 h-10 rounded-full items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="Edit trip"
            >
              <Text className="text-white">E</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              className="bg-black/40 w-10 h-10 rounded-full items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="Delete trip"
            >
              <Text className="text-white">X</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View className="px-4 -mt-6 pb-8">
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
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => switchTab(tab.key)}
                className={`flex-1 py-3 items-center ${activeTab === tab.key ? "border-b-2 border-sky-500" : ""}`}
                accessibilityRole="tab"
                accessibilityState={{ selected: activeTab === tab.key }}
              >
                <Text className="text-base">{tab.emoji}</Text>
                <Text className={`text-xs mt-0.5 ${activeTab === tab.key ? "text-sky-600 font-semibold" : "text-gray-400"}`}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab content */}
          <View className="mt-3">
            {activeTab === "overview" && <OverviewTab trip={trip} category={category} />}
            {activeTab === "map" && <MapTab latitude={Number(trip.latitude)} longitude={Number(trip.longitude)} destination={trip.destination} />}
            {activeTab === "photos" && <PhotosTab tripId={id} photos={trip.photos ?? []} onManage={() => router.push(`/trip/photos/${id}`)} />}
            {activeTab === "budget" && <BudgetTab trip={trip} />}
          </View>
        </View>
      </ScrollView>
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
