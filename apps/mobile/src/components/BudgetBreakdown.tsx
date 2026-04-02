import React from "react";
import { View, Text } from "react-native";
import type { BudgetDTO } from "@travel-checker/shared/src/types";
import { formatCurrency } from "@/lib/formatters";

interface BudgetBreakdownProps {
  budget: BudgetDTO;
}

interface BudgetRowProps {
  label: string;
  amount: number;
  total: number;
  currency: string;
  color: string;
}

function BudgetRow({ label, amount, total, currency, color }: BudgetRowProps) {
  const percentage = total > 0 ? (amount / total) * 100 : 0;

  return (
    <View className="mb-3">
      <View className="flex-row justify-between mb-1">
        <Text className="text-sm text-gray-600">{label}</Text>
        <Text className="text-sm font-medium text-gray-900">
          {formatCurrency(amount, currency)}
        </Text>
      </View>
      <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </View>
    </View>
  );
}

const BUDGET_CATEGORIES = [
  { key: "accommodation" as const, label: "Accommodation", color: "#0ea5e9" },
  { key: "food" as const, label: "Food & Dining", color: "#22c55e" },
  { key: "transport" as const, label: "Transport", color: "#f97316" },
  { key: "activities" as const, label: "Activities", color: "#a855f7" },
  { key: "other" as const, label: "Other", color: "#6b7280" },
];

export function BudgetBreakdown({ budget }: BudgetBreakdownProps) {
  return (
    <View className="bg-white rounded-2xl p-4 border border-gray-100">
      <View className="flex-row justify-between items-baseline mb-4">
        <Text className="text-base font-bold text-gray-900">Budget</Text>
        <Text className="text-xl font-bold text-sky-600">
          {formatCurrency(budget.total, budget.currency)}
        </Text>
      </View>

      {BUDGET_CATEGORIES.map((cat) => {
        const amount = budget[cat.key];
        if (amount === 0) return null;
        return (
          <BudgetRow
            key={cat.key}
            label={cat.label}
            amount={amount}
            total={budget.total}
            currency={budget.currency}
            color={cat.color}
          />
        );
      })}

      {budget.isApproximate && (
        <Text className="text-xs text-gray-400 mt-2">* Approximate values</Text>
      )}
    </View>
  );
}
