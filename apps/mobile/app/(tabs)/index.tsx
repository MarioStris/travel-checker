import React, { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTrips } from "@/hooks/useTrips";
import { useCurrentUser, useUserStats } from "@/hooks/useUser";
import { AnimatedTripCard } from "@/components/AnimatedTripCard";
import { StatsCard } from "@/components/StatsCard";
import { EmptyState } from "@/components/EmptyState";
import { TripCardSkeleton, StatsSkeleton } from "@/components/LoadingSkeleton";
import * as Haptics from "expo-haptics";
import type { TripDTO } from "@travel-checker/shared/src/types";

export default function HomeScreen() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: stats, isLoading: statsLoading } = useUserStats();
  const {
    data: trips,
    isLoading: tripsLoading,
    refetch,
    isRefetching,
  } = useTrips();

  const handleRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const handleAddTrip = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/add-trip");
  };

  const displayName = user?.displayName ?? "Traveler";

  const renderHeader = () => (
    <View>
      <View className="px-4 pt-2 pb-4 flex-row items-center justify-between">
        <Text className="text-xl font-bold text-gray-900">My Trips</Text>
        <TouchableOpacity
          onPress={handleAddTrip}
          className="bg-sky-500 px-4 py-2 rounded-xl"
        >
          <Text className="text-white font-semibold text-sm">+ Add</Text>
        </TouchableOpacity>
      </View>

      {statsLoading || userLoading ? (
        <StatsSkeleton />
      ) : stats ? (
        <StatsCard stats={stats} displayName={displayName} />
      ) : null}
    </View>
  );

  if (tripsLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        {renderHeader()}
        <View className="px-4">
          {[1, 2, 3].map((i) => (
            <TripCardSkeleton key={i} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList<TripDTO>
        data={trips ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View className="px-4">
            <AnimatedTripCard trip={item} index={index} />
          </View>
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            emoji="✈️"
            title="No trips yet"
            description="Start tracking your adventures! Add your first trip and build your travel story."
            actionLabel="Add Your First Trip"
            onAction={handleAddTrip}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor="#0ea5e9"
          />
        }
        contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
