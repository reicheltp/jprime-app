---
id: SPEC-002
title: My Schedule Tasks
feature: my-schedule
type: tasks
status: implemented
created: 2026-06-03
updated: 2026-06-04
---

# Tasks: My Schedule

> Depends on SPEC-001 tasks 1–2 (API client + `useSessions`) and SPEC-004 task 2 (shared types).
> Reference design: SPEC-002-my-schedule.design.md

---

- [x] 1. Add AsyncStorage dependency
  - [x] Install `@react-native-async-storage/async-storage` in `apps/conference`
  - [x] Verify it is listed in `apps/conference/package.json`
  - _Requirements: SPEC-002 #2, #9 (persistence)_

- [x] 2. Implement `BookmarkStore`
  - [x] Create `packages/api/src/queries/bookmarks.ts`
  - [x] Implement `BookmarkStore.load(): Promise<Set<string>>` — reads `@jprime/bookmarks` key from AsyncStorage, parses JSON array, returns `Set<string>`
  - [x] Implement `BookmarkStore.toggle(sessionId: string): Promise<void>` — loads current set, adds or removes the id, writes back
  - [x] Write unit tests with mocked AsyncStorage: load empty, load existing, toggle add, toggle remove
  - _Requirements: SPEC-002 #2, #3, #4, #9_

- [x] 3. Create `useBookmarks` hook
  - [x] Add `useBookmarks(): UseQueryResult<Set<string>>` to `packages/api/src/queries/bookmarks.ts`
  - [x] Query key: `['bookmarks']`; `queryFn`: `BookmarkStore.load()`
  - [x] Export from `packages/api/src/index.ts`
  - _Requirements: SPEC-002 #1, #3, #5_

- [x] 4. Create `useToggleBookmark` mutation
  - [x] Add `useToggleBookmark(): UseMutationResult` to `packages/api/src/queries/bookmarks.ts`
  - [x] `mutationFn`: calls `BookmarkStore.toggle(sessionId)`
  - [x] `onMutate`: optimistic update — update `['bookmarks']` cache immediately
  - [x] `onError`: roll back optimistic update
  - [x] `onSettled`: invalidate `['bookmarks']` to sync with storage
  - [x] Write integration test: toggle adds id; toggle again removes it; optimistic rollback on error
  - _Requirements: SPEC-002 #2, #3, #4_

- [x] 5. Implement `detectConflicts` utility
  - [x] Create `packages/utils/src/helpers/conflictDetection.ts`
  - [x] `detectConflicts(sessions: Session[]): Set<string>` — O(n²) pairwise overlap check
  - [x] `overlaps(a, b)`: `a.startTime < b.endTime && b.startTime < a.endTime`
  - [x] Write unit tests: no sessions, non-overlapping, fully overlapping, adjacent (touching but not overlapping), partial overlap, three-way conflict
  - [x] Export from `packages/utils/src/index.ts`
  - _Requirements: SPEC-002 #7, #8_

- [x] 6. Create `BookmarkButton` component
  - [x] Create `packages/ui/src/components/BookmarkButton.tsx`
  - [x] Calls `useBookmarks()` and `useToggleBookmark()` internally
  - [x] Renders filled icon when bookmarked, outline icon when not
  - [x] Shows loading/disabled state while mutation is in flight
  - [x] Accepts `sessionId: string` and optional `size: 'sm' | 'md'`
  - [x] Write unit test: renders correct icon state; calls toggle on press
  - _Requirements: SPEC-002 #1, #2, #3, #4_

- [x] 7. Build `MyScheduleScreen`
  - [x] Create `apps/conference/app/(schedule)/my-schedule.tsx`
  - [x] Call `useSessions()` and `useBookmarks()`
  - [x] Join: filter `allSessions` to those whose ID is in the bookmark set
  - [x] Run `detectConflicts(bookmarkedSessions)` to compute `conflictIds`
  - [x] Render `FlatList` of `SessionCard` items; pass `isBookmarked={true}` and a conflict badge prop when `conflictIds.has(session.id)`
  - [x] Show `EmptyState` ("No sessions bookmarked yet. Browse the schedule to add some.") when bookmark set is empty
  - [x] Sessions ordered by `startTime` ascending
  - [x] Write integration test: empty state, sessions list, conflict badge appears/disappears
  - _Requirements: SPEC-002 #5, #6, #7, #8_

- [x] 8. Wire `BookmarkButton` into `SessionDetailScreen`
  - [x] Replace the placeholder in `apps/conference/app/(schedule)/[sessionId].tsx` with `<BookmarkButton sessionId={session.id} />`
  - [x] Verify tapping bookmark on detail is immediately reflected on My Schedule screen
  - _Requirements: SPEC-002 #2, #3_

- [x] 9. Wire My Schedule into navigation
  - [x] Add "My Schedule" as a second tab within `(schedule)` or as a dedicated tab in root navigation
  - [x] Confirm bookmark state survives app restart (read from AsyncStorage on mount)
  - _Requirements: SPEC-002 #5, #9_
