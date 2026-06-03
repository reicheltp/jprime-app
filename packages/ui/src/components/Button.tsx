/**
 * JPrime Button Component
 * 
 * A reusable button component that follows the JPrime design system.
 * Supports primary, secondary, and glass variants.
 */

import React from "react";
import {
  Pressable,
  Text,
  PressableProps,
  TextProps,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "glass";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends PressableProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Variant styles for Tailwind classes
const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary hover:bg-primary-strong active:bg-primary-dark",
  secondary: "bg-transparent border-2 border-primary text-primary hover:bg-primary/10 active:bg-primary/20",
  ghost: "bg-transparent border border-neutral-100 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 active:bg-neutral-100",
  glass: "glass glass-border text-white hover:bg-glass-strong active:bg-glass-strong",
};

// Size styles
const sizeStyles: Record<ButtonSize, { container: string; text: string }> = {
  sm: {
    container: "px-3 py-1.5",
    text: "text-sm",
  },
  md: {
    container: "px-5 py-2.5",
    text: "text-base",
  },
  lg: {
    container: "px-6 py-3",
    text: "text-lg",
  },
};

// Shadow styles for each variant
const shadowStyles: Record<ButtonVariant, string> = {
  primary: "shadow-glow-purple",
  secondary: "",
  ghost: "",
  glass: "shadow-glass-shadow",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className,
  textClassName,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const baseStyles = "rounded-md font-medium transition-all duration-200 flex-row items-center justify-center";
  const shadowStyle = shadowStyles[variant];
  const sizeStyle = sizeStyles[size];

  const combinedStyles = twMerge(
    clsx(
      baseStyles,
      variantStyles[variant],
      sizeStyle.container,
      shadowStyle,
      disabled && "opacity-50 cursor-not-allowed",
      className
    )
  );

  const textStyles = twMerge(
    clsx(
      "text-inherit font-medium",
      sizeStyle.text,
      disabled && "text-neutral-400",
      textClassName
    )
  );

  return (
    <Pressable
      className={combinedStyles}
      disabled={disabled || loading}
      {...props}
    >
      {leftIcon && !loading && <>{leftIcon}</>}
      {loading ? (
        <Text className={textStyles}>Loading...</Text>
      ) : (
        <Text className={textStyles}>{children}</Text>
      )}
      {rightIcon && !loading && <>{rightIcon}</>}
    </Pressable>
  );
};

// Specific button variants for convenience
export const PrimaryButton: React.FC<Omit<ButtonProps, "variant">> = (
  props
) => <Button variant="primary" {...props} />;

export const SecondaryButton: React.FC<Omit<ButtonProps, "variant">> = (
  props
) => <Button variant="secondary" {...props} />;

export const GhostButton: React.FC<Omit<ButtonProps, "variant">> = (props) => (
  <Button variant="ghost" {...props} />
);

export const GlassButton: React.FC<Omit<ButtonProps, "variant">> = (props) => (
  <Button variant="glass" {...props} />
);
