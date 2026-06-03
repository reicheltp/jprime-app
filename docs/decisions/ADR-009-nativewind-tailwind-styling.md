---
id: ADR-009
title: Use Tailwind CSS via NativeWind for Styling
status: accepted
date: 2026-06-03
deciders:
  - Paul
tags:
  - styling
  - tailwind
  - nativewind
  - design-system
related:
  - ADR-010-design-md-design-system.md
---

# ADR-009: Use Tailwind CSS via NativeWind for Styling

## Context

We need a styling approach that works consistently across web and native platforms, is maintainable, follows a design system, and performs well at runtime.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| StyleSheet API | Built-in, no dependencies | No web parity, verbose |
| Styled Components | Familiar, dynamic styles | Runtime overhead, web/native divergence |
| **Tailwind CSS + NativeWind** | **Consistent web/native styling, utility-first, no runtime overhead on native** | **Utility classes can make JSX verbose** |
| Tamagui | Cross-platform UI kit + styling | Heavy dependency, steep learning curve |
| Unistyles | Native performance, cross-platform | Smaller ecosystem |

## Decision

**Tailwind CSS v4 via NativeWind v5** — utility-first styling with the same class names on web and native.

Design tokens are defined in `DESIGN.md` YAML frontmatter, referenced in `packages/utils/src/design-tokens.ts`, and expressed as CSS custom properties in `global.css` via the Tailwind v4 `@theme` block. No `tailwind.config.js` — Tailwind v4 is CSS-first.

## Rationale

- Tailwind is the industry standard for utility-first CSS; NativeWind brings it to React Native
- Same `className` API on both web and native — no mental context switching
- NativeWind v5 is Metro-only: no Babel plugin required, faster cold starts
- Tailwind v4 CSS-first config (`@theme` block) keeps all token definitions in one file
- Design tokens defined in `DESIGN.md` are the single source of truth (see ADR-010)

## Architecture

```
DESIGN.md (YAML frontmatter)
    ↓
packages/utils/src/design-tokens.ts (TypeScript)
    ↓
apps/conference/app/global.css (@theme block + utilities)
    ↓
Components (via className)
```

## Usage

```tsx
// Using DESIGN.md tokens via Tailwind classes
<View className="flex-1 justify-center items-center bg-white p-6">
  <Text className="text-primary text-h2 font-bold">JPrime</Text>
  <Button variant="primary" className="bg-primary shadow-glow-purple">
    Sign In
  </Button>
</View>
```

## Shared UI Components

Reusable components in `@jprime/ui` package implement DESIGN.md specifications:

- **Button**: primary, secondary, ghost, glass variants
- **Card**: standard, glass, neon, gradient variants  
- **Input**: glass, standard, minimal variants with error/focus states
- **Badge**: success, warning, error, info variants

## Consequences

- **Good:** Consistent design system across platforms; fast iteration; no native runtime overhead; design tokens are now machine-readable in DESIGN.md
- **Bad:** Utility class names can make JSX verbose for complex layouts
- **Neutral:** `DESIGN.md` is now the single source of truth for design tokens. `tailwind.config.js` and TypeScript utilities are derived from it and must be kept synchronized. See ADR-010 for the DESIGN.md integration approach.

## Files

- `DESIGN.md` - Design system specification with YAML frontmatter
- `apps/conference/metro.config.js` - NativeWind v5 Metro configuration (no second arg needed)
- `apps/conference/postcss.config.mjs` - PostCSS with `@tailwindcss/postcss`
- `apps/conference/app/global.css` - Tailwind v4 `@theme` block + custom utilities
- `apps/conference/nativewind-env.d.ts` - TypeScript reference to `react-native-css/types`
- `packages/utils/src/design-tokens.ts` - TypeScript design tokens
- `packages/ui/src/components/` - Shared UI components using design tokens
