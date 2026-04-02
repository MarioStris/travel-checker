import React from "react";
import { View, Text } from "react-native";
import type { TravelerCategory } from "@travel-checker/shared/src/types";
import { getCategoryConfig } from "@/lib/categoryConfig";

interface MapPinProps {
  category: TravelerCategory;
  selected?: boolean;
}

export function MapPin({ category, selected = false }: MapPinProps) {
  const config = getCategoryConfig(category);

  return (
    <View className="items-center">
      <View
        className={`
          items-center justify-center rounded-full
          ${selected ? "w-12 h-12" : "w-9 h-9"}
          shadow-md
        `}
        style={{
          backgroundColor: config.color,
          shadowColor: config.color,
          shadowOpacity: 0.4,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <Text style={{ fontSize: selected ? 20 : 16 }}>{config.emoji}</Text>
      </View>
      <View
        className="w-2 h-2 rotate-45 -mt-1"
        style={{ backgroundColor: config.color }}
      />
    </View>
  );
}
