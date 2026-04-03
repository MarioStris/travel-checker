import React, { useEffect } from "react";
import { View, type ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useThemeStore } from "@/lib/theme";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = "100%",
  height = 16,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const opacity = useSharedValue(0.3);
  const { colors } = useThemeStore();

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          borderRadius,
          backgroundColor: colors.skeleton,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function LoadingSkeleton() {
  return (
    <View className="px-4 pt-4">
      <Skeleton height={200} borderRadius={16} />
      <View className="mt-4 gap-3">
        <Skeleton height={20} width="70%" />
        <Skeleton height={16} width="50%" />
        <Skeleton height={14} width="30%" />
      </View>
    </View>
  );
}

export function TripCardSkeleton() {
  const { colors } = useThemeStore();

  return (
    <View style={{ borderRadius: 20, overflow: "hidden", marginBottom: 12, borderWidth: 1, borderColor: colors.cardBorder, backgroundColor: colors.card }}>
      <Skeleton height={144} borderRadius={0} />
      <View className="p-3 gap-2">
        <Skeleton height={18} width="70%" />
        <Skeleton height={14} width="50%" />
        <Skeleton height={12} width="40%" />
      </View>
    </View>
  );
}

export function StatsSkeleton() {
  const { colors } = useThemeStore();

  return (
    <View style={{ borderRadius: 16, padding: 20, marginHorizontal: 16, marginBottom: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder }}>
      <Skeleton height={14} width="40%" borderRadius={4} />
      <View className="mt-1 mb-4">
        <Skeleton height={22} width="60%" borderRadius={4} />
      </View>
      <View className="flex-row gap-4">
        {[1, 2, 3, 4].map((i) => (
          <View key={i} className="flex-1 items-center gap-1">
            <Skeleton height={26} width="60%" borderRadius={4} />
            <Skeleton height={12} width="80%" borderRadius={4} />
          </View>
        ))}
      </View>
    </View>
  );
}
