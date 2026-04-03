import React, { useState } from "react";
import { View, Text, Image, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePendingRequests, useRespondToRequest } from "@/hooks/useSocial";
import { useThemeStore } from "@/lib/theme";
import type { FriendRequestDTO } from "@/types/social";

function Avatar({ request, colors }: { request: FriendRequestDTO; colors: ReturnType<typeof useThemeStore>["colors"] }) {
  const avatarUrl = request.fromUser.avatarUrl;

  if (avatarUrl) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        style={{ width: 36, height: 36, borderRadius: 18 }}
        accessibilityLabel={`${request.fromUser.displayName}'s avatar`}
      />
    );
  }

  return (
    <View
      style={{
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.inputBg,
        borderWidth: 1,
        borderColor: colors.inputBorder,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons name="person" size={18} color={colors.textSecondary} />
    </View>
  );
}

function RequestItem({
  request,
  index,
  total,
  colors,
  onAccept,
  onDecline,
  isPending,
}: {
  request: FriendRequestDTO;
  index: number;
  total: number;
  colors: ReturnType<typeof useThemeStore>["colors"];
  onAccept: () => void;
  onDecline: () => void;
  isPending: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        flex: 1,
      }}
    >
      <Avatar request={request} colors={colors} />

      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Text
            style={{ fontSize: 13, fontWeight: "600", color: colors.text }}
            numberOfLines={1}
          >
            {request.fromUser.displayName}
          </Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary }}>
            wants to be your friend
          </Text>
        </View>

        {total > 1 && (
          <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 1 }}>
            {index + 1} of {total}
          </Text>
        )}
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Pressable
          onPress={onDecline}
          disabled={isPending}
          accessibilityLabel={`Decline friend request from ${request.fromUser.displayName}`}
          accessibilityRole="button"
          style={({ pressed }) => ({
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 8,
            backgroundColor: "transparent",
            opacity: pressed || isPending ? 0.5 : 1,
          })}
        >
          <Text style={{ fontSize: 13, fontWeight: "500", color: colors.textSecondary }}>
            Decline
          </Text>
        </Pressable>

        <Pressable
          onPress={onAccept}
          disabled={isPending}
          accessibilityLabel={`Accept friend request from ${request.fromUser.displayName}`}
          accessibilityRole="button"
          style={({ pressed }) => ({
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 8,
            backgroundColor: colors.buttonPrimary,
            opacity: pressed || isPending ? 0.6 : 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          })}
        >
          {isPending ? (
            <ActivityIndicator size="small" color={colors.buttonPrimaryText} />
          ) : null}
          <Text style={{ fontSize: 13, fontWeight: "600", color: colors.buttonPrimaryText }}>
            Accept
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export function NotificationBanner() {
  const { colors } = useThemeStore();
  const { data: requests } = usePendingRequests();
  const { mutate: respond, isPending } = useRespondToRequest();
  const [currentIndex, setCurrentIndex] = useState(0);

  const pending = (requests ?? []).filter((r: FriendRequestDTO) => r.status === "pending");

  if (pending.length === 0) {
    return null;
  }

  const safeIndex = Math.min(currentIndex, pending.length - 1);
  const current = pending[safeIndex];

  function handleAccept() {
    respond(
      { requestId: current.id, action: "accept" },
      {
        onSuccess: () => {
          if (safeIndex > 0) setCurrentIndex(safeIndex - 1);
        },
      }
    );
  }

  function handleDecline() {
    respond(
      { requestId: current.id, action: "decline" },
      {
        onSuccess: () => {
          if (safeIndex > 0) setCurrentIndex(safeIndex - 1);
        },
      }
    );
  }

  function handlePrev() {
    if (safeIndex > 0) setCurrentIndex(safeIndex - 1);
  }

  function handleNext() {
    if (safeIndex < pending.length - 1) setCurrentIndex(safeIndex + 1);
  }

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      accessibilityLabel={`${pending.length} pending friend request${pending.length > 1 ? "s" : ""}`}
      style={{
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        paddingHorizontal: 12,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
      }}
    >
      {pending.length > 1 && (
        <Pressable
          onPress={handlePrev}
          disabled={safeIndex === 0}
          accessibilityLabel="Previous request"
          accessibilityRole="button"
          style={{ padding: 2, opacity: safeIndex === 0 ? 0.3 : 1 }}
        >
          <Ionicons name="chevron-back" size={16} color={colors.textSecondary} />
        </Pressable>
      )}

      <View style={{ flex: 1 }}>
        <RequestItem
          request={current}
          index={safeIndex}
          total={pending.length}
          colors={colors}
          onAccept={handleAccept}
          onDecline={handleDecline}
          isPending={isPending}
        />
      </View>

      {pending.length > 1 && (
        <Pressable
          onPress={handleNext}
          disabled={safeIndex === pending.length - 1}
          accessibilityLabel="Next request"
          accessibilityRole="button"
          style={{ padding: 2, opacity: safeIndex === pending.length - 1 ? 0.3 : 1 }}
        >
          <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
        </Pressable>
      )}
    </View>
  );
}
