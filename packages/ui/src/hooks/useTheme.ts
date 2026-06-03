/**
 * useTheme Hook
 * 
 * Provides access to the JPrime theme configuration and utilities.
 */

import { useColorScheme } from "react-native";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeConfig {
  mode: ThemeMode;
  isDark: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
  };
}

export function useTheme(): ThemeConfig {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return {
    mode: colorScheme as ThemeMode,
    isDark,
    colors: {
      primary: "#E83283",
      secondary: "#39CBFB",
      background: isDark ? "#1A1D20" : "#FFFFFF",
      surface: isDark ? "rgba(255, 255, 255, 0.05)" : "#FFFFFF",
      text: isDark ? "#FFFFFF" : "#212529",
      textSecondary: isDark ? "#CACACA" : "#666666",
      border: isDark ? "rgba(255, 255, 255, 0.1)" : "#DEE2E6",
    },
  };
}
