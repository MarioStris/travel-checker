import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { TravelerCategory } from "@travel-checker/shared/src/types";
import { ALL_CATEGORIES, getCategoryConfig } from "@/lib/categoryConfig";

interface CategoryPickerProps {
  value?: TravelerCategory | null;
  onChange: (category: TravelerCategory) => void;
  label?: string;
}

export function CategoryPicker({ value, onChange, label }: CategoryPickerProps) {
  return (
    <View>
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-3">{label}</Text>
      )}
      <View className="flex-row flex-wrap gap-2">
        {ALL_CATEGORIES.map((category) => {
          const config = getCategoryConfig(category);
          const isSelected = value === category;

          return (
            <Pressable
              key={category}
              onPress={() => onChange(category)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={config.label}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 2,
                minHeight: 44,
                backgroundColor: isSelected ? config.color : config.bgColor,
                borderColor: isSelected ? config.color : "transparent",
                gap: 6,
              }}
            >
              <Ionicons
                name={config.icon}
                size={16}
                color={isSelected ? "#fff" : config.textColor}
              />
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: isSelected ? "#fff" : config.textColor,
                }}
              >
                {config.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
