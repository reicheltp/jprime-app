---
id: SPEC-000
title: <Feature Name> Design
feature: <feature-slug>
type: design
status: draft
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Design: <Feature Name>

> Prerequisite: `SPEC-000-<feature-slug>.md` must be `status: approved`.

## Overview

One paragraph describing the feature and the design approach chosen.

## Architecture

How this feature fits into the overall app structure. Which packages are affected?

```
packages/types      → <new types>
packages/api        → <new queries / mutations>
apps/conference/app → <new screens / routes>
```

## Components and Interfaces

### New Types (`@jprime/types`)

```typescript
export interface Entity {
  id: string
  // ...
}
```

### API Hooks (`@jprime/api`)

```typescript
export function useEntities(): UseQueryResult<Entity[]>
export function useSaveEntity(): UseMutationResult<...>
```

### Screens / Routes (`apps/conference/app/`)

| Route | File | Purpose |
|-------|------|---------|
| `/domain` | `(domain)/index.tsx` | List view |
| `/domain/[id]` | `(domain)/[id].tsx` | Detail view |

## Data Models

Describe API response shapes and any local storage structures.

## Error Handling

| Scenario | Handling |
|----------|---------|
| Network error | Show retry UI, serve cached data |
| Empty state | Show empty state illustration |

## Testing Strategy

- Unit: which functions/hooks need unit tests?
- Integration: which user flows need integration tests?
- Edge cases from requirements to cover explicitly

## Decision Log

Document design decisions made during this phase:

```
Decision: <title>
Context: <why a choice was needed>
Options: <what was considered>
Chosen: <what was decided and why>
```
