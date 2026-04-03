import React from "react";
import { View, Text, Image, Pressable, Platform, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import type { TripDTO } from "@travel-checker/shared/src/types";
import { getCategoryConfig } from "@/lib/categoryConfig";
import { formatDateRange } from "@/lib/formatters";
import { useThemeStore } from "@/lib/theme";

interface TripCardProps {
  trip: TripDTO;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TripCard({ trip, onPress }: TripCardProps) {
  const router = useRouter();
  const categoryConfig = getCategoryConfig(trip.travelerCategory);
  const { colors } = useThemeStore();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/trip/${trip.id}`);
    }
  };

  const daysCount = Math.max(
    1,
    Math.ceil(
      (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={() => { scale.value = withSpring(0.97, { damping: 15, stiffness: 300 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }); }}
      style={[
        animatedStyle,
        {
          borderRadius: 20,
          overflow: "hidden",
          marginBottom: 16,
          borderWidth: 1,
          borderColor: colors.cardBorder,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${trip.title}, ${trip.destination}`}
    >
      <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={{ backgroundColor: colors.card }}>
      {/* Cover image / placeholder */}
      <View style={{ position: "relative" }}>
        {trip.coverPhotoUrl ? (
          <Image
            source={{ uri: trip.coverPhotoUrl }}
            style={{ width: "100%", height: 180 }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              width: "100%",
              height: 180,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: `${categoryConfig.color}25`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name={categoryConfig.icon} size={32} color={categoryConfig.color} />
            </View>
          </View>
        )}

        {/* Category badge overlay */}
        <View
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 20,
            gap: 4,
          }}
        >
          <Ionicons name={categoryConfig.icon} size={12} color={categoryConfig.color} />
          <Text style={{ fontSize: 11, fontWeight: "700", color: "#fff" }}>
            {categoryConfig.label}
          </Text>
        </View>

        {/* Days badge overlay */}
        <View
          style={{
            position: "absolute",
            bottom: 12,
            left: 12,
            backgroundColor: "rgba(0,0,0,0.6)",
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: "600", color: "#fff" }}>
            {daysCount} {daysCount === 1 ? "day" : "days"}
          </Text>
        </View>

        {/* Public indicator */}
        {trip.isPublic && (
          <View
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: 6,
              borderRadius: 12,
            }}
          >
            <Ionicons name="globe-outline" size={14} color="#fff" />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={{ padding: 16 }}>
        <Text
          style={{ fontSize: 17, fontWeight: "700", color: colors.text, marginBottom: 8 }}
          numberOfLines={1}
        >
          {trip.title}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
          <Ionicons name="location-outline" size={15} color={categoryConfig.color} />
          <Text style={{ fontSize: 14, color: colors.textSecondary, marginLeft: 6, flex: 1 }} numberOfLines={1}>
            {trip.destination}, {trip.country}
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
            <Text style={{ fontSize: 13, color: colors.textMuted, marginLeft: 6 }}>
              {formatDateRange(trip.startDate, trip.endDate)}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </View>
        </View>
      </View>
      </View>
    </AnimatedPressable>
  );
}
