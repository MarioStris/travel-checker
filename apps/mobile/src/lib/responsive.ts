import { Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");

/** Screen size breakpoints */
export const BREAKPOINTS = {
  /** iPhone SE, small Android */
  small: 360,
  /** Standard phones */
  medium: 390,
  /** Large phones (Pro Max, etc.) */
  large: 428,
  /** Tablets */
  tablet: 768,
} as const;

/** Max content width for tablet/web */
export const MAX_CONTENT_WIDTH = 560;

/** Current screen is small phone (≤360px) */
export const isSmallScreen = width <= BREAKPOINTS.small;

/** Current screen is tablet or larger */
export const isTablet = width >= BREAKPOINTS.tablet;

/** Current screen is web */
export const isWeb = Platform.OS === "web";

/**
 * Returns responsive horizontal padding based on screen width.
 * Small: 12, Standard: 16, Large/Tablet: 20
 */
export function getHorizontalPadding(): number {
  if (isSmallScreen) return 12;
  if (isTablet) return 24;
  return 16;
}

/**
 * Scale a value down on small screens.
 * e.g. rs(48) → 44 on small, 48 on standard
 */
export function rs(value: number): number {
  if (isSmallScreen) return Math.round(value * 0.92);
  return value;
}
