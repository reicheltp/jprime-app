---
id: SPEC-001
title: Session Browsing Tasks
feature: session-browsing
type: tasks
status: implemented
created: 2026-06-03
updated: 2026-06-04
---

# Tasks: Session Browsing

> Depends on SPEC-004 tasks 1–2 (workspace scaffold + shared types) being complete first.
> Reference design: SPEC-001-session-browsing.design.md

---

- [x] 1. Create base API client in `@jprime/api`
  - [x] Create `packages/api/src/clients/apiClient.ts` with a typed `apiFetch<T>(path)` wrapper
  - [x] Read base URL from an env variable (`EXPO_PUBLIC_API_URL`)
  - [x] Handle non-2xx responses by throwing a typed `ApiError`
  - _Requirements: SPEC-001 #2, #3 (loading and error states require consistent fetch behaviour)_

- [x] 2. Create `useSessions` and `useSession` hooks
  - [x] Create `packages/api/src/queries/sessions.ts`
  - [x] `useSessions()`: query key `['sessions']`, calls `GET /api/v1/sessions`, `staleTime: 60_000`
  - [x] `useSession(id)`: query key `['sessions', id]`, calls `GET /api/v1/sessions/:id`
  - [x] Export both from `packages/api/src/index.ts`
  - [x] Write unit tests with mocked `apiFetch` returning fixture data
  - _Requirements: SPEC-001 #1, #4_

- [x] 3. Create `FilterBar` component
  - [x] Create `packages/ui/src/components/FilterBar.tsx`
  - [x] Render day chips (one per unique session day, formatted as "Day 1" / "Day 2") and track pills (one per unique track)
  - [x] Active filter visually distinct from inactive
  - [x] "Clear" resets both `day` and `track` to null
  - [x] Write unit tests: selecting day updates callback, clear resets state
  - _Requirements: SPEC-001 #5, #6, #7_

- [x] 4. Create `SessionCard` component
  - [x] Create `packages/ui/src/components/SessionCard.tsx`
  - [x] Display: title, formatted time (HH:mm–HH:mm), room, track badge, speaker names
  - [x] Accept `isBookmarked: boolean` prop; render a bookmark indicator icon (read-only)
  - [x] Accept `onPress` callback
  - [x] Write snapshot test
  - _Requirements: SPEC-001 #1, #4_

- [x] 5. Create `EmptyState` component
  - [x] Create `packages/ui/src/components/EmptyState.tsx`
  - [x] Accept `message: string` and optional `action: { label: string; onPress: () => void }`
  - _Requirements: SPEC-001 edge case — empty filter result_

- [x] 6. Implement client-side session filtering
  - [x] Create `packages/utils/src/helpers/sessionFilters.ts`
  - [x] `filterSessions(sessions, { day, track })` — pure function returning filtered `Session[]`
  - [x] `deriveFilterOptions(sessions)` — returns `{ days: string[], tracks: string[] }` from the full list
  - [x] Write unit tests for all filter combinations including null (= all)
  - _Requirements: SPEC-001 #5, #6, #7_

- [x] 7. Add bookmarks filter to session filtering
  - [x] Extend `FilterState` interface with `bookmarksOnly: boolean`
  - [x] Update `filterSessions()` to accept optional `bookmarks: Set<string>` parameter
  - [x] Add filter logic for bookmarksOnly in `filterSessions()`
  - [x] Write unit tests for bookmarksOnly filter and combined filters
  - _Requirements: SPEC-001 #7_

- [x] 8. Update FilterBar to include bookmarks toggle
  - [x] Add "Bookmarked" chip to `FilterBar` component
  - [x] Update `hasActiveFilter` to include `bookmarksOnly`
  - [x] Update Clear button to reset `bookmarksOnly` to false
  - [x] Write unit tests for bookmarks filter interaction
  - _Requirements: SPEC-001 #7_

- [x] 9. Wire bookmarks filter into ScheduleScreen
  - [x] Initialize filter state with `bookmarksOnly: false`
  - [x] Pass `bookmarks` from `useBookmarks()` to `filterSessions()`
  - [x] Update Clear action to reset all three filters
  - _Requirements: SPEC-001 #7, #8_

- [x] 7. Build `ScheduleScreen`
  - [x] Create `apps/conference/app/(schedule)/_layout.tsx` (Stack navigator)
  - [x] Create `apps/conference/app/(schedule)/index.tsx`
  - [x] Call `useSessions()`; derive filter options via `deriveFilterOptions`
  - [x] Hold `FilterState` in component state; apply `filterSessions` before rendering
  - [x] Render `FilterBar`, then a `FlatList` of `SessionCard` items
  - [x] Pass `isBookmarked` from `useBookmarks()` (SPEC-002 hook — stub with empty set if not yet implemented)
  - [x] Show `EmptyState` when filtered list is empty
  - [x] Show skeleton / spinner while `isLoading`
  - [x] Show `ErrorState` with retry when `isError`
  - _Requirements: SPEC-001 #1, #2, #3, #5, #6, #7, #9_

- [x] 8. Build `SessionDetailScreen`
  - [x] Create `apps/conference/app/(schedule)/[sessionId].tsx`
  - [x] Read `sessionId` from route params; call `useSession(sessionId)`
  - [x] Render: title, type badge, track, room, formatted start/end time, description (if present)
  - [x] Render `BookmarkButton` (SPEC-002 — stub as placeholder if not yet implemented)
  - [x] Render speaker names as tappable links; navigate to `/(speakers)/[speakerId]` on tap
  - [x] Handle missing description gracefully (omit section)
  - [x] Show spinner while loading; `ErrorState` on error
  - _Requirements: SPEC-001 #4, #8; SPEC-003 #6 cross-link_

- [x] 9. Wire schedule into root navigation
  - [x] Add a "Schedule" tab entry in `apps/conference/app/_layout.tsx` (or tab navigator)
  - [x] Confirm navigation to schedule and back works end-to-end
  - _Requirements: SPEC-001 #1_
