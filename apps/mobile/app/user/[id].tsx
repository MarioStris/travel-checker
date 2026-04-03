import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useUserProfile, useSendFriendRequest } from "@/hooks/useSocial";
import { useThemeStore } from "@/lib/theme";
import { AnimatedTripCard } from "@/components/AnimatedTripCard";
import { ContentContainer } from "@/components/ContentContainer";
import type { FriendStatus } from "@/types/social";

function FriendButton({
  status,
  onSend,
  loading,
}: {
  status: FriendStatus;
  onSend: () => void;
  loading: boolean;
}) {
  const { colors } = useThemeStore();

  if (status === "accepted") {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.accentBg,
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.accentBorder,
          gap: 6,
        }}
      >
        <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
        <Text style={{ color: colors.accent, fontWeight: "600", fontSize: 15 }}>
          Friends
        </Text>
      </View>
    );
  }

  if (status === "pending_sent") {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.inputBg,
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.inputBorder,
          gap: 6,
        }}
      >
        <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
        <Text style={{ color: colors.textSecondary, fontWeight: "600", fontSize: 15 }}>
          Request Sent
        </Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={onSend}
      disabled={loading}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.buttonPrimary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 6,
        opacity: pressed || loading ? 0.7 : 1,
      })}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.buttonPrimaryText} />
      ) : (
        <Ionicons name="person-add" size={18} color={colors.buttonPrimaryText} />
      )}
      <Text
        style={{
          color: colors.buttonPrimaryText,
          fontWeight: "600",
          fontSize: 15,
        }}
      >
        Add Friend
      </Text>
    </Pressable>
  );
}

export default function UserProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useThemeStore();
  const { data: profile, isLoading } = useUserProfile(id);
  const sendRequest = useSendFriendRequest();

  const handleSendRequest = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    sendRequest.mutate(id);
  };

  if (isLoading || !profile) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 10,
        }}
      >
        <Text
          style={{ fontSize: 18, fontWeight: "700", color: colors.text, flex: 1 }}
          numberOfLines={1}
        >
          {profile.displayName}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Profile card */}
        <View
          style={{
            alignItems: "center",
            paddingVertical: 24,
            marginHorizontal: 16,
            backgroundColor: colors.card,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.cardBorder,
            marginBottom: 16,
          }}
        >
          {profile.avatarUrl ? (
            <Image
              source={{ uri: profile.avatarUrl }}
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                borderWidth: 3,
                borderColor: colors.accent,
                marginBottom: 12,
              }}
            />
          ) : (
            <View
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: colors.accentBg,
                borderWidth: 3,
                borderColor: colors.accent,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <Ionicons name="person" size={40} color={colors.accent} />
            </View>
          )}

          <Text style={{ fontSize: 22, fontWeight: "700", color: colors.text }}>
            {profile.displayName}
          </Text>
          {profile.username && (
            <Text style={{ fontSize: 14, color: colors.textMuted, marginTop: 2 }}>
              @{profile.username}
            </Text>
          )}
          {profile.bio && (
            <Text
              style={{
                fontSize: 14,
                color: colors.textSecondary,
                marginTop: 8,
                textAlign: "center",
                paddingHorizontal: 24,
                lineHeight: 20,
              }}
            >
              {profile.bio}
            </Text>
          )}

          {/* Stats row */}
          <View
            style={{
              flexDirection: "row",
              marginTop: 16,
              gap: 24,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 20, fontWeight: "700", color: colors.text }}>
                {profile.tripsCount}
              </Text>
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>Trips</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 20, fontWeight: "700", color: colors.text }}>
                {profile.countriesCount}
              </Text>
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>Countries</Text>
            </View>
            {profile.mutualFriends > 0 && (
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 20, fontWeight: "700", color: colors.text }}>
                  {profile.mutualFriends}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary }}>Mutual</Text>
              </View>
            )}
          </View>

          {/* Friend action button */}
          <View style={{ marginTop: 20 }}>
            <FriendButton
              status={profile.friendStatus}
              onSend={handleSendRequest}
              loading={sendRequest.isPending}
            />
          </View>
        </View>

        {/* Public trips */}
        <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>
            Public Trips
          </Text>
        </View>

        {profile.publicTrips.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 32 }}>
            <Ionicons name="airplane-outline" size={36} color={colors.textMuted} />
            <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 8 }}>
              No public trips yet
            </Text>
          </View>
        ) : (
          profile.publicTrips.map((trip, index) => (
            <ContentContainer key={trip.id}>
              <AnimatedTripCard trip={trip} index={index} />
            </ContentContainer>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
