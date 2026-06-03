---
id: SPEC-002
title: My Schedule Design
feature: my-schedule
type: design
status: approved
created: 2026-06-03
updated: 2026-06-03
---

# Design: My Schedule

## Overview

Bookmarks are stored on-device using `AsyncStorage`. React Query is used for both reading and mutating the bookmark list (treating local storage as the "server") so the rest of the app can use the same hooks pattern it uses for remote data. Conflict detection runs as a pure client-side computation on the bookmarked sessions.

---

## Architecture

```
apps/conference/app/(schedule)/
└── my-schedule.tsx          # MyScheduleScreen

packages/api/src/
└── queries/
    └── bookmarks.ts         # useBookmarks(), useToggleBookmark()

packages/utils/src/
└── helpers/
    └── conflictDetection.ts # detectConflicts(sessions): Set<string>
```

Bookmark data never touches the remote API in Phase 1. The `@jprime/api` package's bookmark hooks use `AsyncStorage` as their backing store, not `fetch`.

---

## Components and Interfaces

### `MyScheduleScreen` (`app/(schedule)/my-schedule.tsx`)

Reads bookmarked sessions via `useBookmarks()`. Joins with full session data from `useSessions()` to get up-to-date times and details. Passes the merged list through `detectConflicts()` to compute the conflict set, then renders `SessionCard` for each, with a conflict badge where applicable.

```typescript
// Conceptual data flow
const { data: allSessions } = useSessions()
const { data: bookmarkIds } = useBookmarks()

const bookmarkedSessions = allSessions.filter(s => bookmarkIds.has(s.id))
const conflictIds = detectConflicts(bookmarkedSessions)
```

### React Query hooks (`packages/api/src/queries/bookmarks.ts`)

```typescript
// Returns a Set<string> of bookmarked session IDs
export function useBookmarks(): UseQueryResult<Set<string>>

// Toggles a session in/out of bookmarks; invalidates ['bookmarks']
export function useToggleBookmark(): UseMutationResult<void, unknown, string>
```

Cache key: `['bookmarks']`

Both hooks use a thin `BookmarkStore` helper that wraps `AsyncStorage`:

```typescript
// packages/api/src/queries/bookmarks.ts (internal)
const BookmarkStore = {
  async load(): Promise<Set<string>>,
  async toggle(sessionId: string): Promise<void>,
}
```

The `queryFn` calls `BookmarkStore.load()`. The mutation calls `BookmarkStore.toggle(id)` then `queryClient.invalidateQueries({ queryKey: ['bookmarks'] })`. This keeps the pattern identical to remote queries — components don't know or care that the data is local.

### `BookmarkButton` (`packages/ui/src/components/BookmarkButton.tsx`)

```typescript
interface BookmarkButtonProps {
  sessionId: string
  size?: 'sm' | 'md'
}
```

Internally calls `useBookmarks()` and `useToggleBookmark()`. Self-contained — drop it anywhere on a session detail screen. Shows a loading state while the mutation is in flight.

### `conflictDetection` (`packages/utils/src/helpers/conflictDetection.ts`)

```typescript
export function detectConflicts(sessions: Session[]): Set<string> {
  const conflicts = new Set<string>()
  for (let i = 0; i < sessions.length; i++) {
    for (let j = i + 1; j < sessions.length; j++) {
      if (overlaps(sessions[i], sessions[j])) {
        conflicts.add(sessions[i].id)
        conflicts.add(sessions[j].id)
      }
    }
  }
  return conflicts
}

function overlaps(a: Session, b: Session): boolean {
  return a.startTime < b.endTime && b.startTime < a.endTime
}
```

O(n²) is acceptable for a maximum of 50 bookmarked sessions.

---

## Data Models

```typescript
// Stored in AsyncStorage under key: '@jprime/bookmarks'
// Format: JSON array of session ID strings
// Example: ["session-42", "session-17"]
type StoredBookmarks = string[]
```

The in-memory representation is `Set<string>` for O(1) lookup when rendering session cards.

### Future migration path (auth integration)

When authentication is added, the migration is:
1. On login, read local `StoredBookmarks`
2. POST them to the new server-side bookmarks endpoint
3. Swap `BookmarkStore` implementation to call the API instead of `AsyncStorage`
4. Keep the same `useBookmarks()` / `useToggleBookmark()` hook signatures — no component changes needed

---

## Error Handling

| Scenario | Behaviour |
|----------|-----------|
| `AsyncStorage` read failure | `useBookmarks` returns error state; UI shows "Could not load your schedule" with retry |
| Toggle mutation failure | Optimistic update is rolled back; toast message "Could not save — try again" |
| Session no longer in API | Stale bookmark ID is retained in storage; joined list will simply omit the session silently |

---

## Testing Strategy

- Unit test `detectConflicts()` with overlapping, non-overlapping, and adjacent sessions
- Unit test `BookmarkStore.toggle()` with mocked `AsyncStorage`
- Integration test `BookmarkButton` — verify toggle calls mutation and UI updates
- Integration test `MyScheduleScreen` — conflict badges appear when two bookmarked sessions overlap

---

## Decision Log

| Decision | Rationale |
|----------|-----------|
| React Query for local storage | Uniform hook pattern across remote and local data; built-in loading/error states; easy to swap to remote when auth lands |
| `Set<string>` as in-memory format | O(1) `has()` lookup when rendering potentially large session lists |
| Optimistic updates for toggle | Immediate visual feedback is critical for a fast-feeling bookmark action |
| `detectConflicts` as pure utility | Pure function is trivial to unit test and has no side effects |
| No separate "bookmarks" screen route | My Schedule is a tab alongside the conference schedule; same domain, same route group `(schedule)` |
