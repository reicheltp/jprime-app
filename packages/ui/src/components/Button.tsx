import React from "react";
import {
  Pressable,
  Text,
  PressableProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "glass";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends PressableProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const COLORS = {
  magenta: "#E83283",
  magentaDark: "#C5226B",
  magentaGlow: "rgba(232,50,131,0.45)",
  cyan: "#39CBFB",
  white: "#FFFFFF",
  glass: "rgba(255,255,255,0.08)",
  glassBorder: "rgba(255,255,255,0.14)",
  ghostBorder: "rgba(255,255,255,0.22)",
  mutedText: "rgba(255,255,255,0.7)",
} as const;

const containerBase: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 10,
  overflow: "hidden",
};

const variantContainers: Record<ButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: COLORS.magenta,
    shadowColor: COLORS.magenta,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 14,
    elevation: 8,
  },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: COLORS.magenta,
  },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
  },
  glass: {
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
};

const variantText: Record<ButtonVariant, TextStyle> = {
  primary: { color: COLORS.white },
  secondary: { color: COLORS.magenta },
  ghost: { color: COLORS.mutedText },
  glass: { color: COLORS.white },
};

const sizePadding: Record<ButtonSize, ViewStyle> = {
  sm: { paddingHorizontal: 14, paddingVertical: 8, minHeight: 36 },
  md: { paddingHorizontal: 20, paddingVertical: 12, minHeight: 44 },
  lg: { paddingHorizontal: 28, paddingVertical: 15, minHeight: 52 },
};

const sizeFontSize: Record<ButtonSize, TextStyle> = {
  sm: { fontSize: 14 },
  md: { fontSize: 15 },
  lg: { fontSize: 17 },
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  style,
  textStyle,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  ...props
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        containerBase,
        variantContainers[variant],
        sizePadding[size],
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? COLORS.white : COLORS.magenta}
        />
      ) : (
        <>
          {leftIcon && (
            <Text style={[styles.iconGap, variantText[variant]]}>{leftIcon}</Text>
          )}
          <Text
            style={[
              styles.label,
              sizeFontSize[size],
              variantText[variant],
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {children}
          </Text>
          {rightIcon && (
            <Text style={[styles.iconGapLeft, variantText[variant]]}>{rightIcon}</Text>
          )}
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  label: {
    fontWeight: "700",
    letterSpacing: 0.3,
    textAlign: "center",
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.975 }],
  },
  disabled: {
    opacity: 0.4,
  },
  disabledText: {
    color: "rgba(255,255,255,0.4)",
  },
  iconGap: {
    marginRight: 8,
  },
  iconGapLeft: {
    marginLeft: 8,
  },
});

// Convenience exports
export const PrimaryButton: React.FC<Omit<ButtonProps, "variant">> = (props) => (
  <Button variant="primary" {...props} />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, "variant">> = (props) => (
  <Button variant="secondary" {...props} />
);

export const GhostButton: React.FC<Omit<ButtonProps, "variant">> = (props) => (
  <Button variant="ghost" {...props} />
);

export const GlassButton: React.FC<Omit<ButtonProps, "variant">> = (props) => (
  <Button variant="glass" {...props} />
);
