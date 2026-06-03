---
id: ADR-014
title: Storybook for Component Development
description: Add Storybook to develop and document shared UI components in isolation
status: proposed
date: 2026-06-04
deciders:
  - paul
  - AI assistant
tags:
  - tooling
  - ui
  - developer-experience
superseded_by: ~
related:
  - ADR-009-nativewind-tailwind-styling.md
  - ADR-006-domain-driven-organization.md
---

# ADR-014: Storybook for Component Development

## Context

The project uses a shared `@jprime/ui` package with 12+ React/React Native components (Button, Card, Badge, SpeakerCard, SessionCard, etc.) that are consumed by the Expo conference app. These components use NativeWind for styling and need to work consistently across web and native platforms.

Currently, components are developed in isolation within the app or in screens, making it difficult to:
- Visually verify component states and variations
- Document component props and usage examples
- Test components across web and native platforms
- Maintain visual consistency in the design system

Expo SDK 56 with React Native 0.85.3 and React 19.2.3 is fully compatible with Storybook's latest versions, including `@storybook/react-native-web-vite` for web previews.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Option A: Storybook (chosen)** | Industry standard, excellent DX, supports web + native, integrates with NativeWind, component documentation built-in | Additional dependencies (~50MB), setup time (~1 hour), learning curve |
| Option B: Standalone component sandbox | Lightweight, no dependencies | No documentation features, manual setup, no standard tooling |
| Option C: Expo storybook route | Integrated with app, no separate server | Clutters app code, not isolated, harder to maintain |
| Option D: Do nothing | Zero cost | No component isolation, slower development, no visual documentation |

## Decision

**Add Storybook with `@storybook/react-native-web-vite`** — Implement Storybook as a standalone development tool scoped to the `@jprime/ui` package, enabling isolated component development, visual documentation, and cross-platform preview (web + native).

## Rationale

1. **Project architecture aligns perfectly**: The shared `@jprime/ui` package is exactly what Storybook is designed for — a component library that needs to work across platforms
2. **NativeWind compatibility**: Storybook works well with NativeWind/Tailwind when properly configured with `modulesToTranspile` and babel plugins
3. **Web-first strategy**: Expo's web support means we can develop and preview components in the browser with full styling fidelity
4. **Scalability**: As the component library grows (expected 20-30+ components), Storybook will scale to document and test them all
5. **Developer experience**: Visual documentation reduces onboarding time and encourages consistent usage of design system components
6. **Low risk**: Storybook is a dev dependency only, doesn't affect production builds

## Consequences

### Good
- **Isolated development**: Components can be developed without running the full Expo app
- **Visual regression testing**: Easy to spot styling inconsistencies
- **Living documentation**: Storybook stories serve as usage examples
- **Cross-platform verification**: Test components on web before native builds
- **Design system enforcement**: Encourages consistent component usage
- **Faster iteration**: Changes visible immediately in browser

### Bad
- **Additional dependencies**: ~50MB added to dev dependencies
- **Setup complexity**: Requires configuration for NativeWind, Tailwind, and Bun workspaces
- **Maintenance overhead**: Stories need to be kept up-to-date with component changes
- **Version compatibility**: Need to ensure Storybook, Expo, React Native, and NativeWind versions remain compatible

### Neutral
- **Separate process**: Storybook runs as a separate dev server (port 6006 by default)
- **Learning curve**: Team needs to learn Storybook conventions

## Implementation Plan

### Phase 1: Setup (Estimated: 1 hour)

1. **Install Storybook dependencies** in root package.json:
   ```bash
   bun add -d @storybook/react-native-web-vite @storybook/addon-essentials @storybook/addon-interactions @storybook/addon-links @storybook/testing-library
   ```

2. **Initialize Storybook** in `packages/ui/`:
   ```bash
   cd packages/ui
   npx -p @storybook/cli sb init --type react_native
   ```

3. **Configure for NativeWind/Tailwind**:
   - Update `tailwind.config.js` to include Storybook paths:
     ```js
     content: [
       "./.storybook/**/*.{js,jsx,ts,tsx}",
       "./src/**/*.{js,jsx,ts,tsx}",
     ]
     ```
   - Ensure `nativewind/babel` plugin is in babel.config.js

4. **Create `.storybook/main.js`** for Bun workspaces:
   ```js
   const path = require('path');
   
   module.exports = {
     stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
     addons: [
       '@storybook/addon-essentials',
       '@storybook/addon-interactions',
       '@storybook/addon-links',
     ],
     framework: {
       name: '@storybook/react-native-web-vite',
       options: {
         modulesToTranspile: ['@jprime/ui', 'react-native-reanimated'],
         pluginReactOptions: {
           babel: {
             plugins: ['nativewind/babel'],
           },
         },
       },
     },
     viteFinal: async (config) => {
       // Ensure NativeWind styles are processed
       return config;
     },
   };
   ```

5. **Create preview configuration** in `.storybook/preview.js`:
   ```js
   import '../src/styles/global.css'; // Or wherever Tailwind directives are
   
   export const parameters = {
     actions: { argTypesRegex: '^on[A-Z].*' },
     controls: {
       matchers: {
         color: /(background|color)$/i,
         date: /Date$/i,
       },
     },
   };
   ```

### Phase 2: Component Stories (Estimated: 2-4 hours)

Create story files for each component in `@jprime/ui`:

```tsx
// packages/ui/src/components/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    onPress: { action: 'pressed' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};
```

Repeat for all components:
- Badge
- BookmarkButton
- Card
- EmptyState
- FilterBar
- Input
- SessionCard
- SessionListItem
- SpeakerAvatar
- SpeakerCard
- (future components)

### Phase 3: Integration & Automation (Estimated: 1 hour)

1. **Add npm scripts** to root package.json:
   ```json
   {
     "scripts": {
       "storybook": "bun run --cwd packages/ui storybook dev -p 6006",
       "storybook:build": "bun run --cwd packages/ui storybook build"
     }
   }
   ```

2. **Create `packages/ui/.storybook` directory** with:
   - `main.js` (configuration)
   - `preview.js` (global decorators, parameters)
   - `manager.js` (optional: custom branding)

3. **Add global.css import** to ensure Tailwind directives are processed

### Phase 4: Documentation & Onboarding (Estimated: 1 hour)

1. Add Storybook usage guide to project README
2. Document story creation conventions
3. Create template for new component stories
4. Add Storybook to development workflow documentation

## Success Metrics

- [ ] All existing `@jprime/ui` components have Storybook stories
- [ ] Storybook loads successfully on web (http://localhost:6006)
- [ ] NativeWind styles render correctly in Storybook
- [ ] CI/CD includes Storybook build verification
- [ ] Team can develop components in isolation without running Expo
- [ ] Component documentation is accessible to all developers

## Rollback Plan

If Storybook causes issues or doesn't provide expected value:
1. Remove Storybook dependencies from package.json files
2. Delete `.storybook` directories
3. Remove story files (*.stories.tsx)
4. Remove Storybook-related scripts

This is a dev-only tool, so rollback has zero impact on production.

## References

- [Storybook React Native Web Vite Docs](https://storybook.js.org/docs/get-started/frameworks/react-native-web-vite)
- [Expo + Storybook Guide](https://storybook.js.org/tutorials/intro-to-storybook/react-native/en/get-started/)
- [NativeWind + Storybook Template](https://github.com/kimchouard/expo-nativewind-storybook-template)
- [Expo SDK 56 Changelog](https://expo.dev/changelog/sdk-56)
