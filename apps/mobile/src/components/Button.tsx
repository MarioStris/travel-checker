import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type TouchableOpacityProps,
} from "react-native";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, { container: string; text: string }> = {
  primary: {
    container: "bg-sky-500 active:bg-sky-600",
    text: "text-white font-semibold",
  },
  secondary: {
    container: "bg-sky-100 active:bg-sky-200",
    text: "text-sky-700 font-semibold",
  },
  outline: {
    container: "border border-sky-500 bg-transparent active:bg-sky-50",
    text: "text-sky-500 font-semibold",
  },
  ghost: {
    container: "bg-transparent active:bg-gray-100",
    text: "text-gray-700 font-medium",
  },
  danger: {
    container: "bg-red-500 active:bg-red-600",
    text: "text-white font-semibold",
  },
};

const sizeStyles: Record<Size, { container: string; text: string }> = {
  sm: { container: "px-3 py-2 rounded-xl", text: "text-sm" },
  md: { container: "px-4 py-3 rounded-2xl", text: "text-base" },
  lg: { container: "px-6 py-4 rounded-2xl", text: "text-lg" },
};

export function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const v = variantStyles[variant];
  const s = sizeStyles[size];
  const isDisabled = disabled ?? loading;

  return (
    <TouchableOpacity
      className={`
        ${v.container} ${s.container}
        ${fullWidth ? "w-full" : "self-start"}
        ${isDisabled ? "opacity-50" : ""}
        flex-row items-center justify-center gap-2
        ${className ?? ""}
      `}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === "primary" || variant === "danger" ? "#fff" : "#0ea5e9"}
        />
      )}
      <Text className={`${v.text} ${s.text}`}>{title}</Text>
    </TouchableOpacity>
  );
}
