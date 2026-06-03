/**
 * useDesignTokens Hook
 * 
 * Provides access to JPrime design tokens for use in components.
 * This hook imports tokens from the design-tokens utility.
 */

import {
  colors,
  typography,
  spacing,
  rounded,
  elevation,
  layout,
  breakpoints,
  components,
  getColor,
  getSpacing,
  getRounded,
  getElevation,
  spacingToClass,
  roundedToClass,
} from "@jprime/utils";

export interface DesignTokens {
  colors: typeof colors;
  typography: typeof typography;
  spacing: typeof spacing;
  rounded: typeof rounded;
  elevation: typeof elevation;
  layout: typeof layout;
  breakpoints: typeof breakpoints;
  components: typeof components;
}

export interface DesignTokenHelpers {
  getColor: typeof getColor;
  getSpacing: typeof getSpacing;
  getRounded: typeof getRounded;
  getElevation: typeof getElevation;
  spacingToClass: typeof spacingToClass;
  roundedToClass: typeof roundedToClass;
}

export function useDesignTokens(): DesignTokens & DesignTokenHelpers {
  return {
    colors,
    typography,
    spacing,
    rounded,
    elevation,
    layout,
    breakpoints,
    components,
    getColor,
    getSpacing,
    getRounded,
    getElevation,
    spacingToClass,
    roundedToClass,
  };
}

// Convenience hook for getting a specific color
export function useColor(token: string): string {
  return getColor(token) || "#E83283"; // Default to primary
}

// Convenience hook for getting a specific spacing value
export function useSpacing(token: string): number {
  return getSpacing(token) || 8; // Default to base spacing
}
