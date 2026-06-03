---
id: SPEC-001
title: Session Browsing Tasks
feature: session-browsing
type: tasks
status: draft
created: 2026-06-03
updated: 2026-06-03
---

# Tasks: Session Browsing

> Depends on SPEC-004 tasks 1–2 (workspace scaffold + shared types) being complete first.
> Reference design: SPEC-001-session-browsing.design.md

---

- [ ] 1. Create base API client in `@jprime/api`
  - [ ] Create `packages/api/src/clients/apiClient.ts` with a typed `apiFetch<T>(path)` wrapper
  - [ ] Read base URL from an env variable (`EXPO_PUBLIC_API_URL`)
  - [ ] Handle non-2xx responses by throwing a typed `ApiError`
  - _Requirements: SPEC-001 #2, #3 (loading and error states require consistent fetch behaviour)_

- [ ] 2. Create `useSessions` and `useSession` hooks
  - [ ] Create `packages/api/src/queries/sessions.ts`
  - [ ] `useSessions()`: query key `['sessions']`, calls `GET /api/v1/sessions`, `staleTime: 60_000`
  - [ ] `useSession(id)`: query key `['sessions', id]`, calls `GET /api/v1/sessions/:id`
  - [ ] Export both from `packages/api/src/index.ts`
  - [ ] Write unit tests with mocked `apiFetch` returning fixture data
  - _Requirements: SPEC-001 #1, #4_

- [ ] 3. Create `FilterBar` component
  - [ ] Create `packages/ui/src/components/FilterBar.tsx`
  - [ ] Render day chips (one per unique session day, formatted as "Day 1" / "Day 2") and track pills (one per unique track)
  - [ ] Active filter visually distinct from inactive
  - [ ] "Clear" resets both `day` and `track` to null
  - [ ] Write unit tests: selecting day updates callback, clear resets state
  - _Requirements: SPEC-001 #5, #6, #7_

- [ ] 4. Create `SessionCard` component
  - [ ] Create `packages/ui/src/components/SessionCard.tsx`
  - [ ] Display: title, formatted time (HH:mm–HH:mm), room, track badge, speaker names
  - [ ] Accept `isBookmarked: boolean` prop; render a bookmark indicator icon (read-only)
  - [ ] Accept `onPress` callback
  - [ ] Write snapshot test
  - _Requirements: SPEC-001 #1, #4_

- [ ] 5. Create `EmptyState` component
  - [ ] Create `packages/ui/src/components/EmptyState.tsx`
  - [ ] Accept `message: string` and optional `action: { label: string; onPress: () => void }`
  - _Requirements: SPEC-001 edge case — empty filter result_

- [ ] 6. Implement client-side session filtering
  - [ ] Create `packages/utils/src/helpers/sessionFilters.ts`
  - [ ] `filterSessions(sessions, { day, track })` — pure function returning filtered `Session[]`
  - [ ] `deriveFilterOptions(sessions)` — returns `{ days: string[], tracks: string[] }` from the full list
  - [ ] Write unit tests for all filter combinations including null (= all)
  - _Requirements: SPEC-001 #5, #6, #7_

- [ ] 7. Build `ScheduleScreen`
  - [ ] Create `apps/conference/app/(schedule)/_layout.tsx` (Stack navigator)
  - [ ] Create `apps/conference/app/(schedule)/index.tsx`
  - [ ] Call `useSessions()`; derive filter options via `deriveFilterOptions`
  - [ ] Hold `FilterState` in component state; apply `filterSessions` before rendering
  - [ ] Render `FilterBar`, then a `FlatList` of `SessionCard` items
  - [ ] Pass `isBookmarked` from `useBookmarks()` (SPEC-002 hook — stub with empty set if not yet implemented)
  - [ ] Show `EmptyState` when filtered list is empty
  - [ ] Show skeleton / spinner while `isLoading`
  - [ ] Show `ErrorState` with retry when `isError`
  - _Requirements: SPEC-001 #1, #2, #3, #5, #6, #7, #9_

- [ ] 8. Build `SessionDetailScreen`
  - [ ] Create `apps/conference/app/(schedule)/[sessionId].tsx`
  - [ ] Read `sessionId` from route params; call `useSession(sessionId)`
  - [ ] Render: title, type badge, track, room, formatted start/end time, description (if present)
  - [ ] Render `BookmarkButton` (SPEC-002 — stub as placeholder if not yet implemented)
  - [ ] Render speaker names as tappable links; navigate to `/(speakers)/[speakerId]` on tap
  - [ ] Handle missing description gracefully (omit section)
  - [ ] Show spinner while loading; `ErrorState` on error
  - _Requirements: SPEC-001 #4, #8; SPEC-003 #6 cross-link_

- [ ] 9. Wire schedule into root navigation
  - [ ] Add a "Schedule" tab entry in `apps/conference/app/_layout.tsx` (or tab navigator)
  - [ ] Confirm navigation to schedule and back works end-to-end
  - _Requirements: SPEC-001 #1_
