import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { UserStatsDTO } from "@travel-checker/shared/src/types";
import { formatCurrency } from "@/lib/formatters";

interface StatsCardProps {
  stats: UserStatsDTO;
  displayName: string;
}

interface StatItemProps {
  value: string | number;
  label: string;
}

function StatItem({ value, label }: StatItemProps) {
  return (
    <View className="items-center flex-1">
      <Text className="text-2xl font-bold text-white">{value}</Text>
      <Text className="text-xs text-sky-100 mt-0.5">{label}</Text>
    </View>
  );
}

export function StatsCard({ stats, displayName }: StatsCardProps) {
  return (
    <LinearGradient
      colors={["#0284c7", "#0ea5e9", "#38bdf8"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="rounded-2xl p-5 mx-4 mb-4"
    >
      <Text className="text-sm text-sky-100 mb-1">Welcome back,</Text>
      <Text className="text-xl font-bold text-white mb-4">{displayName}</Text>

      <View className="flex-row">
        <StatItem value={stats.trips} label="Trips" />
        <View className="w-px bg-sky-400 opacity-50 my-1" />
        <StatItem value={stats.countries} label="Countries" />
        <View className="w-px bg-sky-400 opacity-50 my-1" />
        <StatItem value={stats.continents} label="Continents" />
        <View className="w-px bg-sky-400 opacity-50 my-1" />
        <StatItem
          value={formatCurrency(stats.totalBudget, "USD", true)}
          label="Spent"
        />
      </View>
    </LinearGradient>
  );
}
