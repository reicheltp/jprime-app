/**
 * JPrime Card Component
 * 
 * A reusable card component that follows the JPrime design system.
 * Supports standard, glass, and neon variants.
 */

import React from "react";
import {
  View,
  ViewProps,
  Pressable,
  PressableProps,
} from "react-native";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type CardVariant = "standard" | "glass" | "neon" | "gradient";

interface CardProps extends ViewProps {
  variant?: CardVariant;
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  onPress?: () => void;
  pressable?: boolean;
}

// Variant styles
const variantStyles: Record<CardVariant, string> = {
  standard: "bg-white border border-neutral-100 shadow-surface hover:shadow-raised",
  glass: "glass glass-border shadow-glass-shadow",
  neon: "bg-glass-subtle border-2 border-cyan shadow-glow-cyan",
  gradient: "bg-gradient-primary",
};

// Default padding for each variant
const paddingStyles: Record<CardVariant, string> = {
  standard: "p-5",
  glass: "p-5",
  neon: "p-4",
  gradient: "p-5",
};

// Border radius for each variant
const roundedStyles: Record<CardVariant, string> = {
  standard: "rounded-lg",
  glass: "rounded-lg",
  neon: "rounded-md",
  gradient: "rounded-lg",
};

export const Card: React.FC<CardProps> = ({
  variant = "standard",
  children,
  className,
  innerClassName,
  onPress,
  pressable = false,
  ...props
}) => {
  const baseStyles = "transition-shadow duration-200";
  const variantStyle = variantStyles[variant];
  const paddingStyle = paddingStyles[variant];
  const roundedStyle = roundedStyles[variant];

  const combinedStyles = twMerge(
    clsx(baseStyles, variantStyle, roundedStyle, className)
  );

  const innerStyles = twMerge(clsx(paddingStyle, innerClassName));

  if (pressable && onPress) {
    return (
      <Pressable
        className={combinedStyles}
        onPress={onPress}
        {...props}
      >
        <View className={innerStyles}>{children}</View>
      </Pressable>
    );
  }

  return (
    <View className={combinedStyles} {...props}>
      <View className={innerStyles}>{children}</View>
    </View>
  );
};

// Specific card variants for convenience
export const StandardCard: React.FC<Omit<CardProps, "variant">> = (
  props
) => <Card variant="standard" {...props} />;

export const GlassCard: React.FC<Omit<CardProps, "variant">> = (props) => (
  <Card variant="glass" {...props} />
);

export const NeonCard: React.FC<Omit<CardProps, "variant">> = (props) => (
  <Card variant="neon" {...props} />
);

export const GradientCard: React.FC<Omit<CardProps, "variant">> = (
  props
) => <Card variant="gradient" {...props} />;
