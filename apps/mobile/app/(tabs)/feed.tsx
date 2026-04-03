import React, { useState } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AppHeader } from "@/components/AppHeader";
import { Sidebar } from "@/components/Sidebar";
import { NotificationBanner } from "@/components/NotificationBanner";
import { ContentContainer } from "@/components/ContentContainer";
import { EmptyState } from "@/components/EmptyState";
import { useThemeStore } from "@/lib/theme";

export default function FeedScreen() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useThemeStore();

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={[colors.gradientTop, colors.gradientMid, colors.gradientBottom]}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <AppHeader title="Feed" onAvatarPress={() => setSidebarOpen(true)} />
          <NotificationBanner />

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.accent} />
            }
          >
            <ContentContainer style={{ flex: 1, justifyContent: "center", paddingBottom: 120 }}>
              <EmptyState
                icon="people-outline"
                title="No posts yet"
                description="Connect with friends to see their travel adventures here."
                actionLabel="Find Friends"
                onAction={() => router.push("/search")}
              />
            </ContentContainer>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
      <Sidebar visible={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </View>
  );
}
