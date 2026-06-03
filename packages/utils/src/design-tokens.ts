/**
 * JPrime Conference Design Tokens
 * 
 * This file contains the design tokens from DESIGN.md in TypeScript format.
 * These tokens are used throughout the application to maintain visual consistency.
 * 
 * Source: DESIGN.md YAML frontmatter
 */

// ========================================
// COLORS
// ========================================

export const colors = {
  // Primary palette - Magenta
  primary: {
    DEFAULT: "#E83283",
    strong: "#E92763",
    status: "#E91E63",
    dark: "#D71A5C",
  } as const,
  
  // Accent colors
  cyan: {
    DEFAULT: "#39CBFB",
    neon: "#39CBFB",
    light: "rgba(57, 203, 251, 0.2)",
  } as const,
  
  orange: "#FD7E14",
  teal: "#41D7A7",
  warning: "#FFC107",
  
  // Neutral palette
  neutral: {
    900: "#212529",  // Near Black - Primary text on light
    800: "#343A40",  // Dark Charcoal - Secondary text
    700: "#495057",
    600: "#666666",  // Medium Gray
    500: "#808080",  // Disabled Gray
    400: "#ADB5BD",  // Muted Gray
    300: "#CACACA",  // Light Gray
    200: "#E9E9E8",  // Lighter Gray
    100: "#DEE2E6",  // Border Gray
    50: "#F8F9FA",   // Light background
  } as const,
  
  // Surface colors
  white: "#FFFFFF",
  black: "#000000",
  
  // Glass surfaces
  glass: {
    DEFAULT: "rgba(255, 255, 255, 0.05)",
    strong: "rgba(255, 255, 255, 0.08)",
    border: "rgba(255, 255, 255, 0.1)",
    subtle: "rgba(255, 255, 255, 0.02)",
  } as const,
  
  // Semantic colors
  success: "#41D7A7",
  error: "#E83283",
  info: "#39CBFB",
} as const;

// Flatten colors for easier access
export type ColorKeys = keyof typeof colors;
export type NeutralKeys = keyof typeof colors.neutral;

// ========================================
// TYPOGRAPHY
// ========================================

export const typography = {
  // Font families
  fontFamily: {
    sans: "Poppins, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    secondary: "'Open Sans', 'Trebuchet MS', 'Lucida Grande', sans-serif",
    body: "Poppins, system-ui, -apple-system, sans-serif",
  } as const,
  
  // Font sizes and styles
  display: {
    fontSize: 38,
    lineHeight: 45.6,
    fontWeight: 700,
    letterSpacing: 0,
  } as const,
  
  h1: {
    fontSize: 24,
    lineHeight: 52,
    fontWeight: 700,
    letterSpacing: 0,
  } as const,
  
  h2: {
    fontSize: 22,
    lineHeight: 40,
    fontWeight: 400,
    letterSpacing: 0,
  } as const,
  
  h3: {
    fontSize: 16,
    lineHeight: 19.2,
    fontWeight: 700,
    letterSpacing: 0,
  } as const,
  
  h4: {
    fontSize: 14,
    lineHeight: 16.8,
    fontWeight: 700,
    letterSpacing: 0,
  } as const,
  
  body: {
    fontSize: 14,
    lineHeight: 25,
    fontWeight: 400,
    letterSpacing: 0,
  } as const,
  
  button: {
    fontSize: 20,
    lineHeight: 20,
    fontWeight: 400,
    letterSpacing: 0,
  } as const,
  
  caption: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: 400,
    letterSpacing: 0,
  } as const,
  
  input: {
    fontSize: 14,
    lineHeight: 26,
    fontWeight: 400,
    letterSpacing: 0,
  } as const,
} as const;

export type TypographyKeys = keyof typeof typography;

// ========================================
// SPACING
// ========================================

export const spacing = {
  base: 8,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 32,
  "3xl": 60,
  "4xl": 72,
  "5xl": 152,
  mega: 152,
} as const;

export type SpacingKeys = keyof typeof spacing;

// ========================================
// BORDER RADIUS
// ========================================

export const rounded = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  full: 9999,
} as const;

export type RoundedKeys = keyof typeof rounded;

// ========================================
// ELEVATION / SHADOWS
// ========================================

export const elevation = {
  none: "none",
  surface: "0 2px 8px 0 rgba(0, 0, 0, 0.1)",
  raised: "0 4px 16px 0 rgba(0, 0, 0, 0.15)",
  floating: "0 8px 24px 0 rgba(0, 0, 0, 0.2)",
  high: "0 4px 30px 0 rgba(0, 0, 0, 0.3)",
  glowPurple: "0 4px 15px 0 rgba(139, 92, 246, 0.4)",
  glowPurpleHover: "0 6px 20px 0 rgba(139, 92, 246, 0.6)",
  glowPurpleActive: "0 2px 10px 0 rgba(139, 92, 246, 0.3)",
  glowCyan: "0 0 20px 0 rgba(57, 203, 251, 0.3)",
  glowCyanFocus: "0 0 12px 0 rgba(57, 203, 251, 0.2)",
  glowWhite: "0 0 15px 0 rgba(255, 255, 255, 0.6)",
  glassShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
  glowError: "0 0 12px 0 rgba(232, 50, 131, 0.2)",
} as const;

export type ElevationKeys = keyof typeof elevation;

// ========================================
// LAYOUT
// ========================================

export const layout = {
  maxWidth: 1440,
  containerPadding: {
    desktop: 32,
    tablet: 20,
    mobile: 16,
  } as const,
  gutter: {
    desktop: 16,
    tablet: 12,
    mobile: 8,
  } as const,
} as const;

// ========================================
// BREAKPOINTS
// ========================================

export const breakpoints = {
  mobile: "320px-639px",
  tablet: "640px-1023px",
  desktop: "1024px-1439px",
  largeDesktop: "1440px+",
} as const;

// ========================================
// COMPONENT TOKENS
// ========================================

export const components = {
  button: {
    primary: {
      backgroundColor: colors.primary.DEFAULT,
      textColor: colors.white,
      rounded: rounded.md,
      padding: "12px 24px",
      typography: typography.button,
      shadow: elevation.glowPurple,
    } as const,
    secondary: {
      backgroundColor: "transparent",
      textColor: colors.white,
      borderColor: colors.primary.DEFAULT,
      borderWidth: 1,
      rounded: rounded.md,
      padding: "10px 20px",
      typography: typography.button,
    } as const,
    glass: {
      backgroundColor: colors.glass.DEFAULT,
      textColor: colors.white,
      borderColor: colors.glass.border,
      borderWidth: 1,
      rounded: rounded.md,
      padding: "4px 12px",
      typography: typography.button,
    } as const,
  } as const,
  
  card: {
    standard: {
      backgroundColor: colors.white,
      borderColor: colors.neutral[100],
      borderWidth: 1,
      rounded: rounded.lg,
      padding: spacing.xl,
      shadow: elevation.surface,
    } as const,
    glass: {
      backgroundColor: colors.glass.DEFAULT,
      borderColor: colors.glass.border,
      borderWidth: 1,
      rounded: rounded.lg,
      padding: `${spacing.xl} ${spacing.lg}`,
      shadow: elevation.glassShadow,
      backdropFilter: "blur(10px)",
    } as const,
    neon: {
      backgroundColor: colors.glass.subtle,
      borderColor: colors.cyan.DEFAULT,
      borderWidth: 2,
      rounded: rounded.md,
      padding: spacing.lg,
      shadow: elevation.glowCyan,
    } as const,
  } as const,
  
  input: {
    standard: {
      backgroundColor: colors.glass.DEFAULT,
      textColor: colors.white,
      borderColor: colors.glass.border,
      borderWidth: 1,
      rounded: rounded.md,
      height: 43,
      padding: `${spacing.sm} ${spacing.lg}`,
      typography: typography.input,
    } as const,
    focus: {
      borderColor: colors.cyan.DEFAULT,
      shadow: elevation.glowCyanFocus,
      backgroundColor: colors.glass.strong,
    } as const,
    error: {
      borderColor: colors.primary.DEFAULT,
      shadow: elevation.glowError,
    } as const,
  } as const,
  
  badge: {
    success: {
      backgroundColor: colors.teal,
      textColor: colors.white,
      rounded: rounded.sm,
      padding: `${spacing.xs} ${spacing.md}`,
      typography: typography.caption,
      fontWeight: 600,
    } as const,
    warning: {
      backgroundColor: colors.warning,
      textColor: colors.neutral[900],
      rounded: rounded.sm,
      padding: `${spacing.xs} ${spacing.md}`,
      typography: typography.caption,
      fontWeight: 600,
    } as const,
    error: {
      backgroundColor: colors.primary.DEFAULT,
      textColor: colors.white,
      rounded: rounded.sm,
      padding: `${spacing.xs} ${spacing.md}`,
      typography: typography.caption,
      fontWeight: 600,
    } as const,
  } as const,
} as const;

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Get a color value by key
 */
export function getColor(key: ColorKeys): string;
export function getColor(key: string): string | undefined;
export function getColor(key: string): string | undefined {
  if (key in colors) {
    const value = (colors as any)[key];
    return typeof value === 'string' ? value : value.DEFAULT;
  }
  return undefined;
}

/**
 * Get spacing value by key
 */
export function getSpacing(key: SpacingKeys): number;
export function getSpacing(key: string): number | undefined;
export function getSpacing(key: string): number | undefined {
  return (spacing as any)[key];
}

/**
 * Get rounded value by key
 */
export function getRounded(key: RoundedKeys): number;
export function getRounded(key: string): number | undefined;
export function getRounded(key: string): number | undefined {
  return (rounded as any)[key];
}

/**
 * Get elevation value by key
 */
export function getElevation(key: ElevationKeys): string;
export function getElevation(key: string): string | undefined;
export function getElevation(key: string): string | undefined {
  return (elevation as any)[key];
}

/**
 * Convert spacing key to Tailwind class
 */
export function spacingToClass(key: SpacingKeys): string {
  const map: Record<SpacingKeys, string> = {
    base: "2",
    xs: "1",
    sm: "2",
    md: "3",
    lg: "4",
    xl: "5",
    "2xl": "8",
    "3xl": "15",
    "4xl": "18",
    "5xl": "38",
    mega: "38",
  };
  return `p-${map[key]}`;
}

/**
 * Convert rounded key to Tailwind class
 */
export function roundedToClass(key: RoundedKeys): string {
  const map: Record<RoundedKeys, string> = {
    none: "none",
    sm: "sm",
    md: "md",
    lg: "lg",
    full: "full",
  };
  return `rounded-${map[key]}`;
}
