import React from "react";
import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import { useRouter } from "expo-router";
import type { TripDTO } from "@travel-checker/shared/src/types";
import { getCategoryConfig } from "@/lib/categoryConfig";
import { formatDateRange } from "@/lib/formatters";

interface TripCardProps {
  trip: TripDTO;
  onPress?: () => void;
}

export function TripCard({ trip, onPress }: TripCardProps) {
  const router = useRouter();
  const categoryConfig = getCategoryConfig(trip.travelerCategory);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/trip/${trip.id}`);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-3"
    >
      {trip.coverPhotoUrl ? (
        <Image
          source={{ uri: trip.coverPhotoUrl }}
          className="w-full h-36"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-36 bg-gradient-to-br from-sky-400 to-sky-600 items-center justify-center">
          <Text className="text-4xl">{categoryConfig.emoji}</Text>
        </View>
      )}

      <View className="p-3">
        <View className="flex-row items-center justify-between mb-1">
          <Text
            className="text-base font-bold text-gray-900 flex-1 mr-2"
            numberOfLines={1}
          >
            {trip.title}
          </Text>
          <View
            className="px-2 py-0.5 rounded-full"
            style={{ backgroundColor: categoryConfig.bgColor }}
          >
            <Text
              className="text-xs font-medium"
              style={{ color: categoryConfig.textColor }}
            >
              {categoryConfig.label}
            </Text>
          </View>
        </View>

        <Text className="text-sm text-gray-500 mb-1">
          {trip.destination}, {trip.country}
        </Text>

        <Text className="text-xs text-gray-400">
          {formatDateRange(trip.startDate, trip.endDate)}
        </Text>
      </View>
    </Pressable>
  );
}
