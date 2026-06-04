import React, { useState } from "react";
import {
  TextInput,
  TextInputProps,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";

export type InputVariant = "standard" | "glass" | "minimal";

interface InputProps extends TextInputProps {
  variant?: InputVariant;
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

const COLORS = {
  cyan: "#39CBFB",
  white: "#FFFFFF",
  errorRed: "#FF4444",
  glass: "rgba(255,255,255,0.07)",
  glassFocused: "rgba(255,255,255,0.11)",
  glassBorder: "rgba(255,255,255,0.13)",
  mutedText: "rgba(255,255,255,0.45)",
  labelText: "rgba(255,255,255,0.85)",
  hintText: "rgba(255,255,255,0.38)",
  dark: "#212529",
} as const;

const variantBase: Record<InputVariant, ViewStyle> = {
  standard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.15)",
    borderRadius: 10,
  },
  glass: {
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: 10,
  },
  minimal: {
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderColor: COLORS.glassBorder,
  },
};

const variantFocused: Record<InputVariant, ViewStyle> = {
  standard: {
    borderColor: COLORS.cyan,
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  glass: {
    backgroundColor: COLORS.glassFocused,
    borderColor: COLORS.cyan,
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  minimal: {
    borderColor: COLORS.cyan,
  },
};

const variantError: Record<InputVariant, ViewStyle> = {
  standard: { borderColor: COLORS.errorRed },
  glass: { borderColor: COLORS.errorRed },
  minimal: { borderColor: COLORS.errorRed },
};

const variantTextColor: Record<InputVariant, string> = {
  standard: "#212529",
  glass: COLORS.white,
  minimal: COLORS.white,
};

export const Input: React.FC<InputProps> = ({
  variant = "glass",
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  multiline,
  numberOfLines,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = !!error;

  const inputWrapperStyle = [
    styles.inputWrapper,
    variantBase[variant],
    isFocused && variantFocused[variant],
    hasError && variantError[variant],
    multiline && styles.multilineWrapper,
  ];

  const textColor = variantTextColor[variant];
  const placeholderColor = variant === "standard" ? "rgba(0,0,0,0.35)" : COLORS.mutedText;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}

      <View style={inputWrapperStyle}>
        {leftIcon && (
          <View style={styles.leftIconWrap}>{leftIcon}</View>
        )}

        <TextInput
          style={[
            styles.input,
            { color: textColor },
            leftIcon ? styles.inputWithLeft : null,
            rightIcon ? styles.inputWithRight : null,
            multiline && styles.multilineInput,
            style as TextStyle,
          ]}
          placeholderTextColor={placeholderColor}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={multiline}
          numberOfLines={numberOfLines}
          {...props}
        />

        {rightIcon && (
          <View style={styles.rightIconWrap}>{rightIcon}</View>
        )}
      </View>

      {hasError && error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {hint && !hasError && (
        <Text style={styles.hintText}>{hint}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.labelText,
    marginBottom: 7,
    letterSpacing: 0.1,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 46,
  },
  multilineWrapper: {
    alignItems: "flex-start",
    minHeight: 96,
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    fontWeight: "400",
  },
  inputWithLeft: {
    paddingLeft: 8,
  },
  inputWithRight: {
    paddingRight: 8,
  },
  multilineInput: {
    paddingTop: 11,
    textAlignVertical: "top",
  },
  leftIconWrap: {
    paddingLeft: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  rightIconWrap: {
    paddingRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 12,
    color: COLORS.errorRed,
    marginTop: 5,
    fontWeight: "500",
  },
  hintText: {
    fontSize: 12,
    color: COLORS.hintText,
    marginTop: 5,
  },
});

// Convenience exports
export const StandardInput: React.FC<Omit<InputProps, "variant">> = (props) => (
  <Input variant="standard" {...props} />
);

export const GlassInput: React.FC<Omit<InputProps, "variant">> = (props) => (
  <Input variant="glass" {...props} />
);

export const MinimalInput: React.FC<Omit<InputProps, "variant">> = (props) => (
  <Input variant="minimal" {...props} />
);
