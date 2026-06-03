# jprime-app: Mobile Conference App - Agent Instructions

**Version 1.0.0**  
**Last Updated:** 2026-06-03  
**Type:** Monorepo (Bun Workspaces)  

> **Note:** This document is primarily for AI agents and LLMs working on this codebase. Humans may also find it useful, but guidance is optimized for automation and consistency.

---

## Abstract

This is a **monorepo** for a **mobile conference application** built with:
- **Framework:** Expo (with EAS, local builds enabled)
- **Navigation:** Expo Router
- **State Management:** React Query
- **Language:** TypeScript
- **Package Manager:** Bun
- **Testing:** Bun's integrated testing
- **CI/CD:** GitHub Actions

The app targets **web-first** with full Android and iOS support.

Code is organized **by domain** (feature-based architecture).

---

## Table of Contents

1. [Monorepo Structure](#1-monorepo-structure)
2. [Technology Stack](#2-technology-stack)
3. [Architecture Principles](#3-architecture-principles)
4. [Code Organization](#4-code-organization)
5. [Development Workflow](#5-development-workflow)
6. [Testing Strategy](#6-testing-strategy)
7. [Spec-Driven Development](#7-spec-driven-development)
8. [Expo-Specific Guidelines](#8-expo-specific-guidelines)
9. [TypeScript Guidelines](#9-typescript-guidelines)
10. [Performance Considerations](#10-performance-considerations)
11. [Documentation Rules](#11-documentation-rules)

---

## 1. Monorepo Structure

```
jprime-app/
├── AGENTS.md                    # This file
├── README.md                    # Human documentation
├── package.json                 # Root: Bun workspaces config
├── bunfig.toml                 # Bun configuration
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI
├── apps/
│   └── conference/             # Main Expo application
│       ├── package.json
│       ├── tsconfig.json
│       ├── app/                 # Expo Router app directory
│       │   ├── _layout.tsx      # Root layout
│       │   ├── index.tsx       # Home screen
│       │   └── (domain)/        # Domain-organized routes
│       ├── assets/              # Static assets
│       └── expo-env.d.ts        # Expo env types
├── packages/
│   ├── ui/                     # Shared UI components
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── components/    # Reusable components
│   │       ├── hooks/          # React hooks
│   │       └── index.ts       # Package exports
│   │
│   ├── api/                    # API clients & React Query
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── clients/       # API clients
│   │       ├── queries/       # React Query hooks
│   │       └── types/         # API types
│   │
│   ├── types/                 # Shared TypeScript types
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       └── index.ts
│   │
│   └── utils/                 # Shared utilities
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── constants/
│           ├── helpers/
│           └── index.ts
│
├── docs/
│   ├── README.md               # Documentation index
│   ├── architecture.md         # Decision register (links to ADRs)
│   ├── glossary.md             # Domain terminology
│   ├── features.md             # Feature status matrix
│   ├── specs/                  # Spec-driven development (flat)
│   │   ├── SPEC-NNN-slug.md            # Requirements (EARS format)
│   │   ├── SPEC-NNN-slug.design.md     # Design document
│   │   └── SPEC-NNN-slug.tasks.md      # Implementation checklist
│   └── decisions/             # ADRs (Architecture Decision Records)
│
└── tooling/
    └── scripts/               # Build/deployment scripts
```

---

## 2. Technology Stack

| Category | Technology | Version | Notes |
|----------|------------|---------|-------|
| Framework | Expo | SDK 50+ | With EAS support |
| Navigation | Expo Router | v3+ | File-based routing |
| State Mgmt | @tanstack/react-query | v5+ | Server state caching |
| Language | TypeScript | 5.3+ | Strict mode |
| Package Manager | Bun | 1.1+ | Workspaces |
| Testing | Bun Test | Built-in | Integrated testing |
| Styling | Tailwind CSS | v4 | Via NativeWind |
| CI/CD | GitHub Actions | - | - |
| Linting | ESLint | - | - |
| Formatting | Prettier | - | - |

---

## 3. Architecture Principles

### 3.1 Domain-Driven Organization
- **Organize by domain/feature**, not by technical layer
- Each domain folder contains: components, hooks, types, utils specific to that domain
- Shared code goes in `packages/`
- Avoid circular dependencies

### 3.2 Platform Agnostic Core
- Business logic in `packages/` works across web, iOS, Android
- Platform-specific code in `apps/conference/` with clear boundaries
- Use feature flags for platform-specific behavior

### 3.3 Type Safety
- **Strict TypeScript** everywhere
- No `any` types without justification
- API responses fully typed
- Component props explicitly typed

### 3.4 React Query First
- All server state via React Query
- Prefer `useQuery` over manual fetching
- Cache keys follow convention: `[domain, entity, id]`
- Use `useMutation` for write operations

### 3.5 Expo Router Conventions
- File-based routing in `apps/conference/app/`
- `(group)` for route groups
- `_layout.tsx` for shared layouts
- Dynamic routes: `[param]` or `[...param]`

### 3.6 Visual Quality Is a Primary Goal

The look and feel of the app is a **first-class requirement**, equal in importance to correctness and performance. A screen that works but looks unfinished is **not done**.

**Rules:**

- **Design.md is the spec.** Every screen must match the cyberpunk/neon aesthetic defined in [`Design.md`](../Design.md). Consult it before writing any UI code.
- **No placeholder UI in committed code.** Flat, unstyled layouts — plain white backgrounds, default system fonts, missing colors — must be fixed before committing. Treat visual debt the same as broken tests.
- **Dark theme always.** All screens use `backgroundColor: '#212529'` (or darker). Light backgrounds are only acceptable for explicitly light-mode surfaces. Never rely on the system default.
- **StyleSheet over CSS utilities for native components.** CSS utility classes (`.glass`, `.card-glass`, etc.) do not reliably apply in React Native. Always use `StyleSheet.create` with explicit `rgba` values. See `Design.md` > Glass Cards > React Native Implementation Note.
- **Ionicons for all icons.** No emoji characters as UI icons. Use `@expo/vector-icons` Ionicons consistently across the app.
- **All bottom-tab screens must declare `tabBarIcon`.** Missing icons show platform-default triangles, which is unacceptable. Define `tabBarIcon` with an `Ionicons` component for every `Tabs.Screen`.
- **Touch targets ≥ 44×44 pt** on all interactive elements (Design.md §8).
- **Visual review before task completion.** Run the app and look at the screen before marking work done. The visual state is the acceptance criterion.

---

## 4. Code Organization

### 4.1 Apps Directory
```
apps/conference/
├── app/
│   ├── _layout.tsx           # Root layout with providers
│   ├── index.tsx            # Home screen
│   ├── (auth)/               # Authentication domain
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (schedule)/           # Schedule domain
│   │   ├── _layout.tsx
│   │   ├── index.tsx         # Schedule list
│   │   └── [sessionId].tsx   # Session detail
│   └── (speakers)/           # Speakers domain
│       ├── _layout.tsx
│       └── index.tsx
├── assets/
│   ├── fonts/
│   ├── images/
│   └── icons/
├── components/               # App-specific components
├── hooks/                   # App-specific hooks
├── lib/                     # App-specific utilities
├── providers/               # App providers (QueryClient, etc.)
└── styles/                  # Global styles
```

### 4.2 Packages Directory

#### @jprime/ui
Shared React/React Native components:
- Buttons, inputs, cards, modals
- Design system primitives
- Platform-agnostic styling

#### @jprime/api
API layer:
- Axios/Fetch clients
- React Query hooks
- API type definitions
- Error handling utilities

#### @jprime/types
Shared TypeScript types:
- API response types
- Domain models
- Utility types

#### @jprime/utils
Shared utilities:
- Date/formatting helpers
- Validation schemas (Zod)
- Constants
- Generic hooks

---

## 5. Development Workflow

### 5.1 Scripts

**Root level:**
```bash
# Run across all workspaces
bun run dev      # Start all dev servers
bun run build    # Build all packages
bun run test     # Run all tests
bun run lint     # Lint all packages
bun run typecheck # Type-check all packages

# Expo specific
bun run expo:dev      # Start Expo dev server
bun run expo:android  # Build Android
bun run expo:ios      # Build iOS
bun run expo:web      # Start web dev server
```

**Workspace level:**
```bash
# From apps/conference/
bun run dev      # Start Expo
bun run build    # Build for production
bun run test     # Run tests
bun run lint     # Lint
```

### 5.2 Adding Dependencies

**Root level (dev tools):**
```bash
bun add -d -w eslint prettier typescript
```

**Workspace level:**
```bash
# Add to apps/conference
bun add react-native expo

# Add to packages/ui
cd packages/ui
bun add react-native-svg
```

### 5.3 Workspace Navigation

Use `bun run --cwd` to run commands in specific workspace:
```bash
bun run --cwd apps/conference expo start
```

---

## 6. Testing Strategy

### 6.1 Test Types

| Type | Location | Runner | Purpose |
|------|----------|--------|---------|
| Unit | `*.test.ts` | Bun Test | Component/utility tests |
| Integration | `*.test.ts` | Bun Test | Multi-component tests |
| E2E | `e2e/*.test.ts` | Bun Test | User flow tests |

### 6.2 Test File Convention

```
# Co-located tests (preferred)
packages/ui/src/components/Button.tsx
packages/ui/src/components/Button.test.ts

# Or in __tests__ directory
packages/api/src/clients/__tests__/userClient.test.ts
```

### 6.3 Test Structure

```typescript
import { describe, expect, it } from "bun:test"
import { render } from "@testing-library/react-native"
import { Button } from "./Button"

describe("Button", () => {
  it("renders correctly", () => {
    const { getByText } = render(<Button>Press me</Button>)
    expect(getByText("Press me")).toBeDefined()
  })

  it("calls onPress when pressed", () => {
    const onPress = vi.fn()
    const { getByText } = render(<Button onPress={onPress}>Press</Button>)
    fireEvent.press(getByText("Press"))
    expect(onPress).toHaveBeenCalled()
  })
})
```

### 6.4 Testing React Native

Use `@testing-library/react-native` with Bun's test runner. For native modules, use platform-specific mocks.

---

## 7. Spec-Driven Development

This project follows **three-phase spec-driven development**. All three files for a feature share the same `SPEC-NNN-slug` prefix and live flat in `docs/specs/`.

### File Naming

| File | Phase | Content |
|------|-------|---------|
| `SPEC-NNN-slug.md` | Requirements | What the feature must do (EARS format) |
| `SPEC-NNN-slug.design.md` | Design | How the feature will be built |
| `SPEC-NNN-slug.tasks.md` | Tasks | Ordered implementation checklist |

Use [docs/specs/SPEC-000-template.md](docs/specs/SPEC-000-template.md) as a starting point.

### Phase Gating

A phase must reach `status: approved` in its YAML frontmatter before the next phase begins:

```
Requirements → approved → Design begins → approved → Tasks begin → completed
```

### 7.1 Phase 1: Requirements

- **File:** `docs/specs/SPEC-NNN-slug.md`
- **Format:** EARS (Easy Approach to Requirements Syntax)

**Example:** `docs/specs/SPEC-001-session-management.md`

```markdown
---
id: SPEC-001
title: Session Management Requirements
feature: session-management
type: requirements
status: draft
created: 2026-06-03
updated: 2026-06-03
---

## Feature: Session Management

**User Story:** As a conference attendee, I want to browse and save sessions to my schedule so I can plan my day.

### Acceptance Criteria

1. **WHEN** user views the schedule **THEN** system SHALL display all conference sessions
2. **WHEN** user taps a session **THEN** system SHALL navigate to session detail view
3. **WHEN** user taps "Add to Schedule" on a session **THEN** system SHALL save session to user's schedule
4. **WHEN** user has saved a session **AND** views their schedule **THEN** system SHALL display saved sessions
5. **WHEN** user removes a session from schedule **THEN** system SHALL remove it from user's saved sessions

### Edge Cases

- User not authenticated: Prompt to login before saving
- Session at capacity: Show "Full" indicator
- Conflicting sessions: Warn user before adding

### Constraints

- Offline support required
- Max 100 sessions per user
```

### 7.2 Phase 2: Design

- **File:** `docs/specs/SPEC-NNN-slug.design.md`
- **Format:** Design document with architecture, interfaces, data models, and inline decision log

**Example:** `docs/specs/SPEC-001-session-management.design.md`

```markdown
---
id: SPEC-001
title: Session Management Design
feature: session-management
type: design
status: draft
created: 2026-06-03
updated: 2026-06-03
---
```

Required sections: Overview, Architecture, Components and Interfaces, Data Models, Error Handling, Testing Strategy, Decision Log.

### 7.3 Phase 3: Tasks

- **File:** `docs/specs/SPEC-NNN-slug.tasks.md`
- **Format:** Ordered checklist referencing acceptance criteria by number

**Example:** `docs/specs/SPEC-001-session-management.tasks.md`

```markdown
---
id: SPEC-001
title: Session Management Tasks
feature: session-management
type: tasks
status: draft
created: 2026-06-03
updated: 2026-06-03
---

- [ ] 1. Create Session type in @jprime/types
  - [ ] Define Session interface
  - [ ] Define SessionStatus enum
  - _Requirements: SPEC-001 #1_

- [ ] 2. Create API client for sessions
  - [ ] GET /sessions endpoint
  - [ ] POST /sessions/:id/save endpoint
  - [ ] DELETE /sessions/:id/save endpoint
  - _Requirements: SPEC-001 #1, #2, #3_
```

### 7.4 Workflow

1. **Before coding:** Create `SPEC-NNN-slug.md`, get to `approved`; add a row to `docs/features.md`
2. **Design:** Create `SPEC-NNN-slug.design.md`, get to `approved`
3. **Implement:** Create `SPEC-NNN-slug.tasks.md`, work through it
4. **Verify:** Check all acceptance criteria from the requirements file
5. **Document:** Add an ADR to `docs/decisions/` for any significant technical decisions made during design

---

## 8. Expo-Specific Guidelines

### 8.1 Expo Configuration

`apps/conference/app.json` (or `expo.config.ts`):
```typescript
{
  "name": "JPrime Conference",
  "slug": "jprime-conference",
  "version": "1.0.0",
  "orientation": "portrait",
  "icon": "./assets/images/icon.png",
  "userInterfaceStyle": "automatic",
  "splash": {
    "image": "./assets/images/splash.png",
    "resizeMode": "contain",
    "backgroundColor": "#ffffff"
  },
  "assetBundlePatterns": ["**/*"],
  "ios": {
    "supportsTablet": true,
    "bundleIdentifier": "com.jprime.conference"
  },
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/images/adaptive-icon.png",
      "backgroundColor": "#ffffff"
    },
    "package": "com.jprime.conference"
  },
  "web": {
    "favicon": "./assets/images/favicon.png"
  },
  "plugins": [
    "expo-router"
  ],
  "experiments": {
    "tsconfigPaths": true
  }
}
```

### 8.2 Expo Router

- Use file-based routing in `apps/conference/app/`
- Group routes by domain: `(auth)`, `(schedule)`, `(speakers)`
- Use `_layout.tsx` for shared layouts and providers
- Dynamic routes: `[param].tsx` or `[...param].tsx`

**Root layout example:**
```tsx
// apps/conference/app/_layout.tsx
import { Stack } from "expo-router"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@jprime/api"

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "JPrime" }} />
      </Stack>
    </QueryClientProvider>
  )
}
```

### 8.3 Platform-Specific Code

Use platform extensions or feature flags:

```tsx
// Platform-specific component
import { Platform } from "react-native"

function PlatformSpecificComponent() {
  if (Platform.OS === "web") {
    return <WebComponent />
  }
  return <MobileComponent />
}

// Or use file extensions
// MyComponent.web.tsx (web only)
// MyComponent.native.tsx (native only)
// MyComponent.tsx (shared)
```

### 8.4 EAS Configuration

`apps/conference/eas.json`:
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "distribution": "store"
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "../secrets/android-service-account.json"
      },
      "ios": {
        "ascAppId": "1234567890",
        "appleId": "team@jprime.com"
      }
    }
  }
}
```

---

## 9. TypeScript Guidelines

### 9.1 tsconfig Base

All packages extend from a common base:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  },
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### 9.2 Expo-Specific TypeScript

`apps/conference/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "preserve",
    "allowJs": true,
    "baseUrl": ".",
    "paths": {
      "@jprime/*": ["../../packages/*/src"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}
```

### 9.3 Package TypeScript

`packages/*/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

---

## 10. Performance Considerations

### 10.1 React Native Performance

- Use `React.memo` for expensive components
- Use `useMemo`/`useCallback` judiciously
- Avoid inline functions in render
- Use FlatList/SectionList for long lists
- Optimize images: appropriate sizes, caching

### 10.2 React Query Performance

- Set appropriate `staleTime` and `cacheTime`
- Use `keepPreviousData` for paginated queries
- Prefetch queries when navigating
- Use `select` to transform data before caching

### 10.3 Bun-Specific

- Use Bun's native modules where possible
- Leverage Bun's fast test runner
- Use `bun:test` for unit tests
- Use `bun --hot` for development (when supported)

---

## 11. Documentation Rules

### 11.1 YAML Frontmatter

Every file in `docs/` **must** begin with a YAML frontmatter block. This allows agents and tooling to scan all docs without reading full content.

**Required fields for all docs:**

```yaml
---
title: <Human-readable title>
description: <One-line summary — used to decide relevance without reading the body>
type: <see types below>
last_updated: YYYY-MM-DD
status: <see lifecycle below>
---
```

**Valid `type` values:**

| Type | Used for |
|------|---------|
| `index` | Directory README files |
| `architecture` | Architecture overview / decision register |
| `adr` | Architecture Decision Record |
| `requirements` | `SPEC-NNN` requirements file |
| `design` | `SPEC-NNN` design file |
| `tasks` | `SPEC-NNN` tasks file |
| `glossary` | Term definitions |
| `feature-matrix` | Feature status overview |

### 11.2 ADR Naming

Architecture Decision Records live in `docs/decisions/` and follow:

```
ADR-NNN-kebab-case-slug.md
```

- `NNN` is a zero-padded three-digit sequence number (001, 002, …)
- Copy `docs/decisions/ADR-000-template.md` to start a new ADR
- Set `status: proposed` until a human approves it
- Link related ADRs via the `related:` frontmatter list field

### 11.3 Spec Naming

Feature specs live in `docs/specs/` (flat — no subdirectories):

```
SPEC-NNN-slug.md           ← requirements
SPEC-NNN-slug.design.md    ← design
SPEC-NNN-slug.tasks.md     ← tasks
```

All three files share the same `id: SPEC-NNN` and `feature: slug` frontmatter fields. The naming convention is the cross-link — no explicit `related_*` fields are needed.

### 11.4 Status Lifecycle

```
draft → in-review → approved → implemented
```

| Status | Meaning |
|--------|---------|
| `draft` | Work in progress — unstable, do not implement against |
| `in-review` | Awaiting human sign-off — may change |
| `approved` | Stable — safe to implement against |
| `implemented` | Shipped — historical record only |

A spec phase must be `approved` before the next phase begins. Update [docs/features.md](docs/features.md) whenever a phase status changes.

### 11.5 Glossary

All domain terms used in types, variables, routes, and specs must match definitions in [docs/glossary.md](docs/glossary.md). When introducing a new domain concept, add it to the glossary first.

---

## References

1. [Expo Documentation](https://docs.expo.dev/)
2. [Expo Router Documentation](https://docs.expo.dev/router)
3. [React Query Documentation](https://tanstack.com/query/latest)
4. [Bun Documentation](https://bun.sh/docs)
5. [TypeScript Documentation](https://www.typescriptlang.org/docs/)
6. [Spec-Driven Development](https://github.com/kiro-team/spec-driven-development)

---

## Questions for Humans

When in doubt, **ASK THE HUMAN**. Key decisions that require human input:

1. **New dependencies** - Confirm before adding to root or workspace
2. **Architecture changes** - Discuss major structural decisions
3. **API design** - Review endpoint designs and data models
4. **UI/UX decisions** - Confirm visual and interaction patterns
5. **Deployment** - Human approval required for production builds
6. **Security** - Always flag authentication/authorization concerns
7. **Data models** - Confirm schema changes

**Asking format:**
```
[QUESTION: category] Description of question or decision needed.

**Options:**
1. Option A - Pros/cons
2. Option B - Pros/cons

**Recommendation:** Preferred option with rationale
```

---

**Maintained by:** AI Agents with Human Oversight  
**Last Reviewed:** 2026-06-03
