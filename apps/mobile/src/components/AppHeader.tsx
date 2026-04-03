import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCurrentUser } from "@/hooks/useUser";
import { useThemeStore } from "@/lib/theme";

interface AppHeaderProps {
  title?: string;
  onAvatarPress: () => void;
  leftAction?: React.ReactNode;
}

export function AppHeader({ title, onAvatarPress, leftAction }: AppHeaderProps) {
  const { data: user } = useCurrentUser();
  const { colors } = useThemeStore();

  return (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingTop: 4,
      paddingBottom: 12,
    }}>
      {leftAction ?? (title ? <Text style={{ fontSize: 22, fontWeight: "800", color: colors.text }}>{title}</Text> : <View />)}

      <Pressable
        onPress={onAvatarPress}
        accessibilityLabel="Open profile menu"
        accessibilityRole="button"
        style={({ pressed }) => ({
          width: 40,
          height: 40,
          borderRadius: 20,
          overflow: "hidden",
          opacity: pressed ? 0.7 : 1,
          borderWidth: 2,
          borderColor: colors.cardBorder,
        })}
      >
        {user?.avatarUrl ? (
          <Image
            source={{ uri: user.avatarUrl }}
            style={{ width: 36, height: 36, borderRadius: 18 }}
          />
        ) : (
          <View style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.skeleton,
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Ionicons name="person" size={18} color={colors.textSecondary} />
          </View>
        )}
      </Pressable>
    </View>
  );
}
