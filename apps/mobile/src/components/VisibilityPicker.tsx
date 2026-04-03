import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import type { TripVisibility } from "@/types/social";
import { useThemeStore } from "@/lib/theme";

interface Option {
  value: TripVisibility;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  description: string;
}

const OPTIONS: Option[] = [
  {
    value: "public",
    icon: "globe-outline",
    label: "Public",
    description: "Anyone can see this trip",
  },
  {
    value: "network",
    icon: "people-outline",
    label: "Friends Only",
    description: "Only your friends can see this trip",
  },
  {
    value: "private",
    icon: "lock-closed-outline",
    label: "Private",
    description: "Only you can see this trip",
  },
];

interface Props {
  value: TripVisibility;
  onChange: (v: TripVisibility) => void;
}

export function VisibilityPicker({ value, onChange }: Props) {
  const { colors } = useThemeStore();

  function handleSelect(option: TripVisibility) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(option);
  }

  return (
    <View>
      {OPTIONS.map((option) => {
        const isSelected = value === option.value;

        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => handleSelect(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${option.label}: ${option.description}`}
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 14,
              borderRadius: 12,
              borderWidth: 1,
              marginBottom: 10,
              borderColor: isSelected ? colors.accent : colors.inputBorder,
              backgroundColor: isSelected ? colors.accentBg : colors.inputBg,
            }}
          >
            <Ionicons
              name={option.icon}
              size={22}
              color={isSelected ? colors.accent : colors.textSecondary}
              style={{ marginRight: 12 }}
            />

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: colors.text,
                }}
              >
                {option.label}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.textSecondary,
                }}
              >
                {option.description}
              </Text>
            </View>

            {isSelected && (
              <Ionicons
                name="checkmark-circle"
                size={22}
                color={colors.accent}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
