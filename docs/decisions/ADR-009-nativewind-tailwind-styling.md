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
related: []
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

**Tailwind CSS v4 via NativeWind** — utility-first styling with the same class names on web and native.

## Rationale

- Tailwind is the industry standard for utility-first CSS; NativeWind brings it to React Native
- Same `className` API on both web and native — no mental context switching
- No runtime style computation on native (compiled to `StyleSheet.create`)
- Design tokens (colours, spacing, typography) are centralized in `tailwind.config.js`

## Usage

```tsx
<View className="flex-1 justify-center items-center bg-white p-6">
  <Text className="text-xl font-bold text-gray-900">Hello World</Text>
</View>
```

## Consequences

- **Good:** Consistent design system across platforms; fast iteration; no native runtime overhead
- **Bad:** Utility class names can make JSX verbose for complex layouts
- **Neutral:** `tailwind.config.js` is the single source of truth for design tokens and must be kept up-to-date
