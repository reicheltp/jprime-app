---
id: SPEC-001
title: Session Browsing Design
feature: session-browsing
type: design
status: approved
created: 2026-06-03
updated: 2026-06-03
---

# Design: Session Browsing

## Overview

A schedule screen lists all conference sessions grouped by day, filterable by track. Tapping a session opens a detail screen. All data is fetched from the Conference Data API (SPEC-004) via React Query hooks in `@jprime/api`.

---

## Architecture

```
apps/conference/app/(schedule)/
├── _layout.tsx          # Stack navigator for the schedule domain
├── index.tsx            # ScheduleScreen — list + filters
└── [sessionId].tsx      # SessionDetailScreen

packages/api/src/
├── queries/
│   └── sessions.ts      # useSessions(), useSession(id)
└── clients/
    └── apiClient.ts     # base fetch wrapper

packages/types/src/
└── index.ts             # Session, Speaker types (defined in SPEC-004 design)

packages/ui/src/
└── components/
    ├── SessionCard.tsx
    ├── FilterBar.tsx
    └── EmptyState.tsx
```

---

## Components and Interfaces

### `ScheduleScreen` (`app/(schedule)/index.tsx`)

Owns filter state. Passes filtered sessions to `SessionList`.

```typescript
type FilterState = {
  day: string | null    // ISO date or null (= all days)
  track: string | null  // track name or null (= all tracks)
}
```

Derives available days/tracks from the full unfiltered session list — no separate API call.

### `SessionDetailScreen` (`app/(schedule)/[sessionId].tsx`)

Reads `sessionId` from route params. Calls `useSession(sessionId)`. Renders full session details including tappable speaker links (navigates to SPEC-003 speaker detail).

### React Query hooks (`packages/api/src/queries/sessions.ts`)

```typescript
// Fetch all sessions; filtering is done client-side
export function useSessions(): UseQueryResult<Session[]>

// Fetch single session by ID
export function useSession(id: string): UseQueryResult<Session>
```

Cache keys follow project convention:
- `['sessions']` — full list
- `['sessions', id]` — single session

`staleTime: 60_000` (1 minute) — aligns with API cache TTL (SPEC-004).

### `FilterBar` (`packages/ui/src/components/FilterBar.tsx`)

```typescript
interface FilterBarProps {
  days: string[]           // derived from session list
  tracks: string[]         // derived from session list
  value: FilterState
  onChange: (f: FilterState) => void
}
```

Renders day chips (Day 1 / Day 2) and track pills. A "clear" action resets both to `null`.

### `SessionCard` (`packages/ui/src/components/SessionCard.tsx`)

```typescript
interface SessionCardProps {
  session: Session
  isBookmarked: boolean    // passed in from SPEC-002 bookmark store
  onPress: () => void
}
```

Displays: title, time, room, track badge, speaker names. Bookmark indicator is read-only here — the toggle lives on the detail screen.

---

## Data Models

Session type is defined in `@jprime/types` — see SPEC-004 design. No additional types required for this feature.

---

## Navigation Flow

```
Tab: Schedule
  └── (schedule)/index       ← ScheduleScreen
        └── tap session
              └── (schedule)/[sessionId]   ← SessionDetailScreen
                    └── tap speaker name
                          └── (speakers)/[speakerId]   ← SPEC-003
```

Filter state is held in component-local state on `ScheduleScreen`. When navigating back from detail, Expo Router preserves the screen instance (stack navigator), so filters are retained — satisfying SPEC-001 AC #9.

---

## Error Handling

| State | UI behaviour |
|-------|-------------|
| Loading (initial) | Skeleton cards / spinner |
| Loading (background refresh) | Stale data shown; subtle indicator |
| Error (network) | `ErrorState` component with "Try again" retry button |
| Empty (after filter) | `EmptyState` with "No sessions found. Clear filters." |

React Query's `isLoading`, `isError`, `isFetching` flags drive these states.

---

## Testing Strategy

- Unit test `FilterBar` — snapshot + filter change callbacks
- Unit test client-side filter logic (pure function that filters `Session[]` by day and track)
- Integration test `ScheduleScreen` with a mocked `useSessions` returning fixture data
- Integration test filter interactions (select day, select track, clear)

---

## Decision Log

| Decision | Rationale |
|----------|-----------|
| Client-side filtering | ~100 sessions fit easily in memory; avoids re-fetching on every filter change — better UX, lower API load |
| Filter state in component (not URL) | Simple; Expo Router stack preserves screen state on back-navigation anyway |
| `staleTime: 60_000` | Matches API cache TTL; avoids hammering the API during conference day |
| Bookmark indicator on SessionCard (read-only) | Keeps card simple; full toggle affordance on the detail screen where context is clear |
