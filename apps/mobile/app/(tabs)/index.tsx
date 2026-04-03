import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTrips } from "@/hooks/useTrips";
import { useCurrentUser, useUserStats } from "@/hooks/useUser";
import { AnimatedTripCard } from "@/components/AnimatedTripCard";
import { StatsCard } from "@/components/StatsCard";
import { EmptyState } from "@/components/EmptyState";
import { ContentContainer } from "@/components/ContentContainer";
import { AppHeader } from "@/components/AppHeader";
import { Sidebar } from "@/components/Sidebar";
import { NotificationBanner } from "@/components/NotificationBanner";
import { TripCardSkeleton, StatsSkeleton } from "@/components/LoadingSkeleton";
import * as Haptics from "expo-haptics";
import { useThemeStore } from "@/lib/theme";
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

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { colors } = useThemeStore();
  const displayName = user?.displayName ?? "Traveler";

  const addButton = (
    <Pressable
      onPress={handleAddTrip}
      accessibilityLabel="Add new trip"
      accessibilityRole="button"
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: pressed ? colors.accentBg : colors.accentBg,
        borderWidth: 1,
        borderColor: colors.accentBorder,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 5,
        minHeight: 40,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Ionicons name="add" size={16} color={colors.accent} />
      <Text style={{ color: colors.accent, fontWeight: "600", fontSize: 13 }}>Add</Text>
    </Pressable>
  );

  const renderHeader = () => (
    <>
      <NotificationBanner />
      <ContentContainer>
        {statsLoading || userLoading ? (
          <StatsSkeleton />
        ) : stats ? (
          <StatsCard stats={stats} displayName={displayName} />
        ) : null}
      </ContentContainer>
    </>
  );

  if (tripsLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <LinearGradient
          colors={[colors.gradientTop, colors.gradientMid, colors.gradientBottom]}
          style={{ flex: 1 }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <AppHeader leftAction={addButton} onAvatarPress={() => setSidebarOpen(true)} />
            {renderHeader()}
            <ContentContainer>
              {[1, 2, 3].map((i) => (
                <TripCardSkeleton key={i} />
              ))}
            </ContentContainer>
          </SafeAreaView>
        </LinearGradient>
        <Sidebar visible={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={[colors.gradientTop, colors.gradientMid, colors.gradientBottom]}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <AppHeader leftAction={addButton} onAvatarPress={() => setSidebarOpen(true)} />
          <FlatList<TripDTO>
            data={trips ?? []}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <ContentContainer>
                <AnimatedTripCard trip={item} index={index} />
              </ContentContainer>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={
              <EmptyState
                icon="airplane-outline"
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
                tintColor={colors.accent}
              />
            }
            contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </LinearGradient>
      <Sidebar visible={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </View>
  );
}
