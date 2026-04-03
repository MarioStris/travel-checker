import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { useThemeStore } from "@/lib/theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const { colors } = useThemeStore();

  const borderColor = error
    ? "#ef4444"
    : focused
    ? colors.accent
    : colors.inputBorder;

  return (
    <View style={[{ width: "100%" }, containerStyle]}>
      {label && (
        <Text style={{ fontSize: 13, fontWeight: "500", color: colors.textSecondary, marginBottom: 6 }}>
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.inputBg,
          borderWidth: 1,
          borderColor,
          borderRadius: 16,
          paddingHorizontal: 16,
          minHeight: props.multiline ? undefined : 48,
          paddingVertical: props.multiline ? 12 : 0,
        }}
      >
        {leftIcon && <View style={{ marginRight: 8 }}>{leftIcon}</View>}
        <TextInput
          style={{
            flex: 1,
            fontSize: 16,
            color: colors.text,
          }}
          placeholderTextColor={colors.textMuted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={{ marginLeft: 8 }}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{error}</Text>}
      {hint && !error && (
        <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 4 }}>{hint}</Text>
      )}
    </View>
  );
}
