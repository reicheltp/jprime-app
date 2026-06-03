---
id: ADR-010
title: DESIGN.md as Single Source of Truth for Design System
status: accepted
date: 2026-06-03
deciders:
  - Paul
  - AI Assistant (Mistral Vibe)
tags:
  - design-system
  - design-tokens
  - documentation
  - ai-assisted-development
related:
  - ADR-009-nativewind-tailwind-styling.md
superseded_by: ~
---

# ADR-010: DESIGN.md as Single Source of Truth for Design System

## Context

As we build a sophisticated design system for JPrime Conference with neon accents, glass-morphism, and cyberpunk aesthetics, we need a way to:
1. Document design decisions for human designers and developers
2. Provide machine-readable tokens for AI agents and tools
3. Synchronize design tokens across Tailwind CSS, TypeScript, and React Native
4. Maintain consistency as the design system evolves

Previously, design tokens were scattered across documentation (prose), Tailwind config, and component files. This led to:
- Inconsistencies between documentation and implementation
- Difficulty for AI agents to understand the full design system
- Manual synchronization required when tokens changed
- No single source of truth

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **DESIGN.md with YAML frontmatter** | **Single file, human + machine readable, industry emerging standard, portable across tools** | **New format, requires YAML parsing** |
| Separate JSON tokens file | Machine-readable, familiar format | No human documentation in one place, two files to maintain |
| Figma Variables only | Designer-friendly, visual | Not accessible to developers without Figma, no code integration |
| Style Dictionary | Robust, industry standard | Heavy setup, complex for small projects |
| Multiple markdown files | Flexible, can be detailed | No machine-readability, hard to sync with code |

## Decision

**DESIGN.md with YAML frontmatter** — following the emerging [Google DESIGN.md specification](https://github.com/google-labs-code/design.md).

The DESIGN.md file contains:
1. **YAML frontmatter**: Machine-readable design tokens (colors, typography, spacing, rounded, elevation, components, layout, breakpoints)
2. **Markdown body**: Human-readable documentation, rationale, and usage guidelines

## Rationale

### Why DESIGN.md with YAML?

1. **Single Source of Truth**: One file contains both human documentation and machine-readable tokens
2. **AI-Agent Friendly**: AI tools (like Mistral Vibe) can parse the YAML to understand and apply the design system
3. **Portable**: The file can be shared across projects and tools
4. **Emerging Standard**: Google's DESIGN.md spec is gaining adoption in the AI-assisted development community
5. **Backward Compatible**: Existing prose documentation remains valid

### Token Reference Syntax

The YAML uses `{path.to.token}` references to create relationships between tokens:

```yaml
colors:
  primary: "#E83283"
  
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
```

This allows tokens to reference each other, creating a maintainable hierarchy.

## Architecture

### File Structure

```
jprime-app/
├── DESIGN.md                    # ✅ Single source of truth
│   ├── YAML frontmatter         # Machine-readable tokens
│   └── Markdown body           # Human documentation
│
├── apps/conference/
│   ├── tailwind.config.js      # ✅ Generated from DESIGN.md
│   ├── global.css              # ✅ CSS variables from DESIGN.md
│   └── app/                    # App screens using tokens
│
└── packages/
    ├── utils/
    │   └── src/design-tokens.ts # ✅ TypeScript tokens from DESIGN.md
    └── ui/
        └── src/components/     # ✅ Components using design tokens
```

### Token Flow

```
DESIGN.md (YAML)
    │
    ├──► packages/utils/src/design-tokens.ts (TypeScript)
    │       └──► Type-safe token access in components
    │
    ├──► apps/conference/tailwind.config.js (Tailwind theme)
    │       └──► Tailwind classes in JSX
    │
    └──► apps/conference/app/global.css (CSS variables)
            └──► Custom CSS utilities and @layer theme
```

### DESIGN.md Structure

The file follows the Google DESIGN.md specification:

```yaml
---
version: alpha
name: JPrime Conference
description: Cyberpunk-inspired design system...

# Token Groups
colors: { primary: "#E83283", cyan: "#39CBFB", ... }
typography: { font-family-sans: "Poppins, ...", ... }
spacing: { base: 8px, sm: 8px, md: 12px, ... }
rounded: { none: 0px, sm: 4px, md: 8px, ... }
elevation: { glow-purple: "0 4px 15px rgba(139,92,246,0.4)", ... }

# Component Tokens
components:
  button-primary: { backgroundColor: "{colors.primary}", ... }
  card-glass: { backgroundColor: "{colors.glass}", ... }

# Layout
layout: { max-width: 1440px, ... }
breakpoints: { mobile: "320px-639px", ... }

---

# Human Documentation
## Visual Theme & Atmosphere
## Colors
## Typography
... (existing prose documentation)
```

## Implementation

### Current Status (2026-06-03)

✅ **DESIGN.md** - Updated with comprehensive YAML frontmatter
✅ **tailwind.config.js** - All design tokens implemented
✅ **global.css** - CSS variables and custom utilities
✅ **design-tokens.ts** - TypeScript type-safe tokens
✅ **UI Components** - Button, Card, Input, Badge using tokens
✅ **Screens** - Home and Login using JPrime design system

### Token Groups Defined

| Group | Count | Status |
|-------|-------|--------|
| Colors | 20+ | ✅ Complete |
| Typography | 8 levels | ✅ Complete |
| Spacing | 9 scales | ✅ Complete |
| Rounded | 5 levels | ✅ Complete |
| Elevation | 10 shadows | ✅ Complete |
| Components | 10+ definitions | ✅ Complete |
| Layout | 6 values | ✅ Complete |
| Breakpoints | 4 ranges | ✅ Complete |

### Example Tokens

**Colors:**
- `primary`: #E83283 (Magenta)
- `cyan`: #39CBFB (Neon cyan)
- `glass`: rgba(255, 255, 255, 0.05)
- `neutral-900`: #212529

**Typography:**
- `display`: 38px / 45.6px line-height / 700 weight
- `h1`: 24px / 52px / 700
- `body`: 14px / 25px / 400

**Spacing:**
- `xs`: 4px
- `sm`: 8px
- `md`: 12px
- `lg`: 16px
- `xl`: 20px

## Usage Examples

### In DESIGN.md (Reference)
```yaml
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "{spacing.md} {spacing.xl}"
```

### In TypeScript
```typescript
import { colors, spacing } from "@jprime/utils";

const buttonStyle = {
  backgroundColor: colors.primary.DEFAULT,
  padding: spacing.md,
};
```

### In Tailwind/React Native
```tsx
import { Button, GlassCard } from "@jprime/ui";

<GlassCard className="p-6 border-2 border-cyan shadow-glow-cyan">
  <Text className="text-h2 text-white">Welcome</Text>
  <Button variant="primary">Sign In</Button>
</GlassCard>
```

## Consequences

### Good

- **Single Source of Truth**: DESIGN.md is now the canonical location for all design decisions
- **AI-Assisted Development**: AI agents can read and apply the design system consistently
- **Portable**: The DESIGN.md file can be used across different AI tools and platforms
- **Type-Safe**: TypeScript utilities provide compile-time checking of token usage
- **Maintainable**: Token references (`{colors.primary}`) create relationships that are easy to update
- **Consistent**: All platforms (iOS, Android, Web) use the same design tokens

### Bad

- **YAML Parsing Required**: Tools need to parse YAML frontmatter to extract tokens
- **Synchronization Needed**: tailwind.config.js and design-tokens.ts need to be updated when DESIGN.md changes (though this could be automated)
- **Learning Curve**: Team members need to understand the DESIGN.md format

### Neutral

- **File Size**: DESIGN.md is now ~600 lines with YAML + prose (still manageable)
- **Tooling Maturity**: DESIGN.md spec is still emerging (alpha version)
- **Migration**: Existing projects need to be updated to adopt the new format

## Future Improvements

1. **Automated Token Generation**: Create a script to auto-generate tailwind.config.js and design-tokens.ts from DESIGN.md
2. **Design Token Validation**: Add WCAG contrast checking based on color tokens
3. **Visual Design Token Explorer**: Build a UI to browse and test design tokens
4. **Change Detection**: Add GitHub Actions to detect when DESIGN.md changes and flag files that need updating
5. **Figma Integration**: Sync DESIGN.md tokens with Figma variables

## References

- [Google DESIGN.md Specification](https://github.com/google-labs-code/design.md)
- [DESIGN.md Format Documentation](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md)
- [Design.md Files - Foundational Patterns](https://fiftyfiveandfive.com/resources/design-md-files-and-the-foundational-patterns-of-ai-assisted-design/)
