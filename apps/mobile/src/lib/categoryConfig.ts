import type { TravelerCategory } from "@travel-checker/shared/src/types";

export interface CategoryConfig {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  emoji: string;
}

export const CATEGORY_CONFIG: Record<TravelerCategory, CategoryConfig> = {
  solo: {
    label: "Solo Traveler",
    color: "#3b82f6",
    bgColor: "#eff6ff",
    textColor: "#1d4ed8",
    emoji: "🧳",
  },
  couple: {
    label: "Couple",
    color: "#ec4899",
    bgColor: "#fdf2f8",
    textColor: "#be185d",
    emoji: "💑",
  },
  family: {
    label: "Family",
    color: "#22c55e",
    bgColor: "#f0fdf4",
    textColor: "#15803d",
    emoji: "👨‍👩‍👧‍👦",
  },
  backpacker: {
    label: "Backpacker",
    color: "#f97316",
    bgColor: "#fff7ed",
    textColor: "#c2410c",
    emoji: "🎒",
  },
  luxury: {
    label: "Luxury",
    color: "#eab308",
    bgColor: "#fefce8",
    textColor: "#a16207",
    emoji: "✨",
  },
  digital_nomad: {
    label: "Digital Nomad",
    color: "#a855f7",
    bgColor: "#faf5ff",
    textColor: "#7e22ce",
    emoji: "💻",
  },
  adventure: {
    label: "Adventure",
    color: "#ef4444",
    bgColor: "#fef2f2",
    textColor: "#b91c1c",
    emoji: "🏔️",
  },
  cultural: {
    label: "Cultural",
    color: "#14b8a6",
    bgColor: "#f0fdfa",
    textColor: "#0f766e",
    emoji: "🏛️",
  },
  group: {
    label: "Group",
    color: "#6366f1",
    bgColor: "#eef2ff",
    textColor: "#4338ca",
    emoji: "👥",
  },
  business: {
    label: "Business",
    color: "#6b7280",
    bgColor: "#f9fafb",
    textColor: "#374151",
    emoji: "💼",
  },
};

export function getCategoryConfig(category: TravelerCategory): CategoryConfig {
  return CATEGORY_CONFIG[category];
}

export const ALL_CATEGORIES = Object.keys(CATEGORY_CONFIG) as TravelerCategory[];
