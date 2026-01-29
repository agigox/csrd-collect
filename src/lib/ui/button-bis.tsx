"use client";

import * as React from "react";
import { Button as RteButton } from "@rte-ds/react";
import { cn } from "@/lib/utils";

type IconPosition = "left" | "right";

type ButtonSize = "s" | "m" | "l";

interface ButtonBisProps extends React.ComponentProps<typeof RteButton> {
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
}

// Icon offset from edge based on button size
const ICON_OFFSET: Record<ButtonSize, string> = {
  s: "6px",
  m: "8px",
  l: "10px",
};

// Extra padding for icon space based on button size
const ICON_PADDING: Record<ButtonSize, string> = {
  s: "24px",
  m: "28px",
  l: "32px",
};

const ButtonBis = React.forwardRef<HTMLButtonElement, ButtonBisProps>(
  (
    { icon, iconPosition = "right", className, size = "m", style, ...props },
    ref,
  ) => {
    // If no icon, use the standard RTE Button
    if (!icon) {
      return (
        <RteButton
          ref={ref}
          size={size}
          className={className}
          style={style}
          {...props}
        />
      );
    }

    // With icon, wrap RteButton and position icon with CSS
    const paddingStyle = {
      ...style,
      ...(iconPosition === "right"
        ? { paddingRight: ICON_PADDING[size] }
        : { paddingLeft: ICON_PADDING[size] }),
    };

    const iconStyle: React.CSSProperties = {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      ...(iconPosition === "right"
        ? { right: ICON_OFFSET[size] }
        : { left: ICON_OFFSET[size] }),
    };

    return (
      <div className={cn("relative inline-flex", className)}>
        <RteButton ref={ref} size={size} style={paddingStyle} {...props} />
        <span style={iconStyle}>{icon}</span>
      </div>
    );
  },
);

ButtonBis.displayName = "ButtonBis";

export { ButtonBis };
export type { ButtonBisProps, IconPosition };
