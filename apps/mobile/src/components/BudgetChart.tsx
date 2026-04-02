import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { formatCurrency } from "@/lib/formatters";

interface BudgetCategory {
  key: string;
  label: string;
  emoji: string;
  amount: number;
  color: string;
}

interface BudgetChartProps {
  categories: BudgetCategory[];
  total: number;
  currency?: string;
}

function AnimatedBar({
  category,
  total,
  index,
  currency,
}: {
  category: BudgetCategory;
  total: number;
  index: number;
  currency: string;
}) {
  const width = useSharedValue(0);
  const percentage = total > 0 ? (category.amount / total) * 100 : 0;

  useEffect(() => {
    width.value = withDelay(
      index * 80,
      withTiming(percentage, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
  }, [percentage, index, width]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View className="mb-3">
      <View className="flex-row items-center justify-between mb-1">
        <View className="flex-row items-center flex-1">
          <Text className="text-base mr-1.5">{category.emoji}</Text>
          <Text className="text-sm text-gray-600">{category.label}</Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-xs text-gray-400 mr-2">
            {Math.round(percentage)}%
          </Text>
          <Text className="text-sm font-semibold text-gray-900">
            {formatCurrency(category.amount, currency)}
          </Text>
        </View>
      </View>
      <View className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <Animated.View
          className="h-full rounded-full"
          style={[barStyle, { backgroundColor: category.color }]}
        />
      </View>
    </View>
  );
}

const DEFAULT_CATEGORIES: Omit<BudgetCategory, "amount">[] = [
  { key: "accommodation", label: "Accommodation", emoji: "🏨", color: "#0ea5e9" },
  { key: "food", label: "Food & Dining", emoji: "🍽️", color: "#22c55e" },
  { key: "transport", label: "Transport", emoji: "🚗", color: "#f97316" },
  { key: "activities", label: "Activities", emoji: "🎯", color: "#a855f7" },
  { key: "other", label: "Other", emoji: "📦", color: "#6b7280" },
];

export function BudgetChart({ categories, total, currency = "EUR" }: BudgetChartProps) {
  const nonZero = categories.filter((c) => c.amount > 0);

  if (nonZero.length === 0) {
    return (
      <View className="items-center py-6">
        <Text className="text-gray-400 text-sm">No budget data</Text>
      </View>
    );
  }

  return (
    <View>
      <View className="flex-row justify-between items-baseline mb-4">
        <Text className="text-base font-bold text-gray-900">Budget</Text>
        <Text className="text-xl font-bold text-sky-600">
          {formatCurrency(total, currency)}
        </Text>
      </View>
      {nonZero.map((cat, i) => (
        <AnimatedBar
          key={cat.key}
          category={cat}
          total={total}
          index={i}
          currency={currency}
        />
      ))}
    </View>
  );
}

export function budgetToCategories(budget: {
  accommodation: number;
  food: number;
  transport: number;
  activities: number;
  other: number;
}): BudgetCategory[] {
  return DEFAULT_CATEGORIES.map((cat) => ({
    ...cat,
    amount: budget[cat.key as keyof typeof budget] ?? 0,
  }));
}
