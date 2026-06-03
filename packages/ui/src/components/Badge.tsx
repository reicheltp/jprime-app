/**
 * JPrime Badge Component
 * 
 * A reusable badge/status component that follows the JPrime design system.
 */

import React from "react";
import { Text, TextProps, View, ViewProps } from "react-native";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type BadgeVariant = "success" | "warning" | "error" | "info" | "primary" | "secondary" | "glass";

interface BadgeProps extends ViewProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  textClassName?: string;
  size?: "sm" | "md" | "lg";
}

// Variant styles
const variantStyles: Record<BadgeVariant, { container: string; text: string }> = {
  success: {
    container: "bg-teal",
    text: "text-white",
  },
  warning: {
    container: "bg-warning",
    text: "text-neutral-900",
  },
  error: {
    container: "bg-error",
    text: "text-white",
  },
  info: {
    container: "bg-cyan",
    text: "text-white",
  },
  primary: {
    container: "bg-primary",
    text: "text-white",
  },
  secondary: {
    container: "bg-neutral-200",
    text: "text-neutral-800",
  },
  glass: {
    container: "bg-glass-strong border border-glass-border",
    text: "text-neutral-300",
  },
};

// Size styles
const sizeStyles: Record<"sm" | "md" | "lg", { container: string; text: string }> = {
  sm: {
    container: "px-2 py-0.5",
    text: "text-xs",
  },
  md: {
    container: "px-3 py-1",
    text: "text-caption",
  },
  lg: {
    container: "px-4 py-1.5",
    text: "text-sm",
  },
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "primary",
  children,
  textClassName,
  size = "md",
  className,
  ...props
}) => {
  const baseStyles = "rounded-sm font-semibold";
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  const containerStyles = twMerge(
    clsx(baseStyles, variantStyle.container, sizeStyle.container, className)
  );

  const textStyles = twMerge(
    clsx(variantStyle.text, sizeStyle.text, "font-semibold", textClassName)
  );

  return (
    <View className={containerStyles} {...props}>
      <Text className={textStyles}>{children}</Text>
    </View>
  );
};

// Specific badge variants for convenience
export const SuccessBadge: React.FC<Omit<BadgeProps, "variant">> = (
  props
) => <Badge variant="success" {...props} />;

export const WarningBadge: React.FC<Omit<BadgeProps, "variant">> = (
  props
) => <Badge variant="warning" {...props} />;

export const ErrorBadge: React.FC<Omit<BadgeProps, "variant">> = (props) => (
  <Badge variant="error" {...props} />
);

export const InfoBadge: React.FC<Omit<BadgeProps, "variant">> = (props) => (
  <Badge variant="info" {...props} />
);
