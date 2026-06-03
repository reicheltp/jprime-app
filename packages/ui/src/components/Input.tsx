/**
 * JPrime Input Component
 * 
 * A reusable text input component that follows the JPrime design system.
 * Features glass-morphism styling, focus states, and error handling.
 */

import React, { useState } from "react";
import {
  TextInput,
  TextInputProps,
  View,
  Text,
  Pressable,
} from "react-native";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type InputVariant = "standard" | "glass" | "minimal";

interface InputProps extends TextInputProps {
  variant?: InputVariant;
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  hintClassName?: string;
}

// Variant styles
const variantStyles: Record<InputVariant, string> = {
  standard: "bg-white border border-neutral-100 text-neutral-900 placeholder:text-neutral-400",
  glass: "glass glass-border text-white placeholder:text-white/50",
  minimal: "bg-transparent border-0 text-neutral-900 placeholder:text-neutral-400",
};

// Focus styles for each variant
const focusStyles: Record<InputVariant, string> = {
  standard: "focus:border-cyan focus:shadow-glow-cyan-focus",
  glass: "focus:border-cyan focus:shadow-glow-cyan-focus focus:bg-glass-strong",
  minimal: "focus:border-cyan focus:border-b-2",
};

// Error styles
const errorStyles: Record<InputVariant, string> = {
  standard: "border-error shadow-glow-error",
  glass: "border-error shadow-glow-error",
  minimal: "border-error border-b-2",
};

export const Input: React.FC<InputProps> = ({
  variant = "glass",
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  containerClassName,
  inputClassName,
  labelClassName,
  errorClassName,
  hintClassName,
  className,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const baseStyles = "rounded-md h-11 transition-all duration-200";
  const variantStyle = variantStyles[variant];
  const focusStyle = focusStyles[variant];
  const hasError = !!error;
  const errorStyle = hasError ? errorStyles[variant] : "";

  const inputStyles = twMerge(
    clsx(
      baseStyles,
      variantStyle,
      focusStyle,
      errorStyle,
      "px-4 py-2",
      className,
      inputClassName
    )
  );

  return (
    <View className={twMerge(clsx("mb-4", containerClassName))}>
      {label && (
        <Text
          className={twMerge(
            clsx(
              "text-body font-medium mb-2 text-neutral-700",
              labelClassName
            )
          )}
        >
          {label}
        </Text>
      )}

      <View className="relative">
        {leftIcon && (
          <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
            {leftIcon}
          </View>
        )}

        <TextInput
          className={inputStyles}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          style={[
            { paddingLeft: leftIcon ? 40 : 16 },
            { paddingRight: rightIcon ? 40 : 16 },
          ]}
          {...props}
        />

        {rightIcon && (
          <View className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
            {rightIcon}
          </View>
        )}
      </View>

      {hasError && error && (
        <Text
          className={twMerge(
            clsx(
              "text-caption text-error mt-1",
              errorClassName
            )
          )}
        >
          {error}
        </Text>
      )}

      {hint && !hasError && (
        <Text
          className={twMerge(
            clsx(
              "text-caption text-neutral-400 mt-1",
              hintClassName
            )
          )}
        >
          {hint}
        </Text>
      )}
    </View>
  );
};

// Specific input variants for convenience
export const StandardInput: React.FC<Omit<InputProps, "variant">> = (
  props
) => <Input variant="standard" {...props} />;

export const GlassInput: React.FC<Omit<InputProps, "variant">> = (props) => (
  <Input variant="glass" {...props} />
);

export const MinimalInput: React.FC<Omit<InputProps, "variant">> = (
  props
) => <Input variant="minimal" {...props} />;
