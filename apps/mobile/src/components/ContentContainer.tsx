import React from "react";
import { View, type ViewProps } from "react-native";
import { MAX_CONTENT_WIDTH, getHorizontalPadding } from "@/lib/responsive";

interface ContentContainerProps extends ViewProps {
  children: React.ReactNode;
  /** Disable horizontal padding */
  noPadding?: boolean;
}

/**
 * Wraps content with maxWidth constraint for tablet/web
 * and responsive horizontal padding for all screen sizes.
 */
export function ContentContainer({ children, noPadding, style, ...props }: ContentContainerProps) {
  const px = noPadding ? 0 : getHorizontalPadding();

  return (
    <View
      style={[
        {
          width: "100%",
          maxWidth: MAX_CONTENT_WIDTH,
          alignSelf: "center",
          paddingHorizontal: px,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
