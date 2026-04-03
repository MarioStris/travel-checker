import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type TouchableOpacityProps,
} from "react-native";
import { useThemeStore } from "@/lib/theme";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const SIZE_STYLES: Record<Size, { px: number; py: number; radius: number; fontSize: number }> = {
  sm: { px: 12, py: 8, radius: 12, fontSize: 14 },
  md: { px: 16, py: 12, radius: 16, fontSize: 16 },
  lg: { px: 24, py: 16, radius: 16, fontSize: 18 },
};

export function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const { colors } = useThemeStore();
  const s = SIZE_STYLES[size];
  const isDisabled = disabled ?? loading;

  const variants = {
    primary: {
      bg: colors.buttonPrimary,
      text: colors.buttonPrimaryText,
      border: "transparent",
    },
    secondary: {
      bg: colors.accentBg,
      text: colors.accent,
      border: colors.accentBorder,
    },
    outline: {
      bg: "transparent",
      text: colors.accent,
      border: colors.accent,
    },
    ghost: {
      bg: "transparent",
      text: colors.textSecondary,
      border: "transparent",
    },
    danger: {
      bg: "#ef4444",
      text: "#ffffff",
      border: "transparent",
    },
  };

  const v = variants[variant];

  return (
    <TouchableOpacity
      disabled={isDisabled}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          backgroundColor: v.bg,
          borderWidth: v.border !== "transparent" ? 1 : 0,
          borderColor: v.border,
          paddingHorizontal: s.px,
          paddingVertical: s.py,
          borderRadius: s.radius,
          alignSelf: fullWidth ? "stretch" : "flex-start",
          opacity: isDisabled ? 0.5 : 1,
        },
        style,
      ]}
      {...props}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === "primary" || variant === "danger" ? "#fff" : colors.accent}
        />
      )}
      <Text style={{ color: v.text, fontWeight: "600", fontSize: s.fontSize }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
