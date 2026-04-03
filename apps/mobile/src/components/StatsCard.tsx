import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { UserStatsDTO } from "@travel-checker/shared/src/types";
import { formatCurrency } from "@/lib/formatters";
import { useThemeStore } from "@/lib/theme";

interface StatsCardProps {
  stats: UserStatsDTO;
  displayName: string;
}

interface StatItemProps {
  value: string | number;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  textColor: string;
  labelColor: string;
  iconColor: string;
}

function StatItem({ value, label, icon, textColor, labelColor, iconColor }: StatItemProps) {
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <Ionicons name={icon} size={18} color={iconColor} style={{ marginBottom: 4 }} />
      <Text style={{ fontSize: 20, fontWeight: "700", color: textColor }}>{value}</Text>
      <Text style={{ fontSize: 11, color: labelColor, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

export function StatsCard({ stats, displayName }: StatsCardProps) {
  const { colors } = useThemeStore();

  return (
    <View
      style={{
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.cardBorder,
      }}
    >
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 13, color: colors.textMuted, marginBottom: 2 }}>
          Welcome back,
        </Text>
        <Text style={{ fontSize: 20, fontWeight: "700", color: colors.text, marginBottom: 16 }}>
          {displayName}
        </Text>

        <View
          style={{
            flexDirection: "row",
            backgroundColor: colors.accentBg,
            borderRadius: 12,
            padding: 12,
            borderWidth: 1,
            borderColor: colors.accentBorder,
          }}
        >
          <StatItem
            value={stats.trips}
            label="Trips"
            icon="airplane-outline"
            textColor={colors.text}
            labelColor={colors.textSecondary}
            iconColor={colors.accent}
          />
          <View style={{ width: 1, backgroundColor: colors.accentBorder, marginVertical: 4 }} />
          <StatItem
            value={stats.countries}
            label="Countries"
            icon="flag-outline"
            textColor={colors.text}
            labelColor={colors.textSecondary}
            iconColor={colors.accent}
          />
          <View style={{ width: 1, backgroundColor: colors.accentBorder, marginVertical: 4 }} />
          <StatItem
            value={stats.continents}
            label="Continents"
            icon="globe-outline"
            textColor={colors.text}
            labelColor={colors.textSecondary}
            iconColor={colors.accent}
          />
          <View style={{ width: 1, backgroundColor: colors.accentBorder, marginVertical: 4 }} />
          <StatItem
            value={formatCurrency(stats.totalBudget, "USD", true)}
            label="Spent"
            icon="wallet-outline"
            textColor={colors.text}
            labelColor={colors.textSecondary}
            iconColor={colors.accent}
          />
        </View>
      </View>
    </View>
  );
}
