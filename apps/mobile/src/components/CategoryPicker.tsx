import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
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
            <TouchableOpacity
              key={category}
              onPress={() => onChange(category)}
              className="flex-row items-center px-3 py-2 rounded-full border"
              style={{
                backgroundColor: isSelected ? config.color : config.bgColor,
                borderColor: isSelected ? config.color : config.bgColor,
              }}
            >
              <Text className="mr-1.5" style={{ fontSize: 14 }}>
                {config.emoji}
              </Text>
              <Text
                className="text-sm font-medium"
                style={{ color: isSelected ? "#fff" : config.textColor }}
              >
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
