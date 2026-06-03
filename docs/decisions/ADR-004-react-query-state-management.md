---
id: ADR-004
title: Use React Query for Server State Management
status: accepted
date: 2026-06-03
deciders:
  - Paul
tags:
  - state-management
  - server-state
  - caching
  - offline
related: []
---

# ADR-004: Use React Query for Server State Management

## Context

The conference app needs to manage server state (API data: sessions, speakers, schedule), client state (UI and form state), and local persistence (offline support for saved sessions).

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **React Query** | **Purpose-built for server state, built-in caching, background updates, TS-first** | **Doesn't handle complex client state natively** |
| Redux Toolkit | Handles all state types, predictable | Boilerplate-heavy, overkill for server state |
| Zustand | Simple, minimal API | Less featureful for server state — no built-in caching |
| Apollo Client | Excellent for GraphQL | Overkill for REST APIs |
| SWR | Similar to React Query | Fewer features, smaller ecosystem |

## Decision

**React Query v5+** for server state, React `useState`/`useReducer` for client state, **AsyncStorage** for offline persistence.

## Rationale

- React Query's caching and background-refresh model maps perfectly to conference data
- No need for a separate global state library — server state is the dominant state type
- Simple `useQuery` / `useMutation` API with excellent TypeScript inference
- AsyncStorage integration allows offline-first behaviour without a separate sync library

## Cache Key Convention

```typescript
// Hierarchical keys enable granular invalidation
useQuery(["schedule", "sessions"], fetchSessions)
useQuery(["schedule", "session", sessionId], () => fetchSession(sessionId))
useQuery(["speakers", "all"], fetchSpeakers)
```

## Consequences

- **Good:** Automatic caching, background updates, loading/error states with no boilerplate
- **Bad:** Client state (non-server) still needs `useState`/Context, which can fragment state logic
- **Neutral:** Teams must adopt the `[domain, entity, id]` cache key convention consistently
