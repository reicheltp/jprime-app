---
id: SPEC-002
title: My Schedule Tasks
feature: my-schedule
type: tasks
status: draft
created: 2026-06-03
updated: 2026-06-03
---

# Tasks: My Schedule

> Depends on SPEC-001 tasks 1–2 (API client + `useSessions`) and SPEC-004 task 2 (shared types).
> Reference design: SPEC-002-my-schedule.design.md

---

- [ ] 1. Add AsyncStorage dependency
  - [ ] Install `@react-native-async-storage/async-storage` in `apps/conference`
  - [ ] Verify it is listed in `apps/conference/package.json`
  - _Requirements: SPEC-002 #2, #9 (persistence)_

- [ ] 2. Implement `BookmarkStore`
  - [ ] Create `packages/api/src/queries/bookmarks.ts`
  - [ ] Implement `BookmarkStore.load(): Promise<Set<string>>` — reads `@jprime/bookmarks` key from AsyncStorage, parses JSON array, returns `Set<string>`
  - [ ] Implement `BookmarkStore.toggle(sessionId: string): Promise<void>` — loads current set, adds or removes the id, writes back
  - [ ] Write unit tests with mocked AsyncStorage: load empty, load existing, toggle add, toggle remove
  - _Requirements: SPEC-002 #2, #3, #4, #9_

- [ ] 3. Create `useBookmarks` hook
  - [ ] Add `useBookmarks(): UseQueryResult<Set<string>>` to `packages/api/src/queries/bookmarks.ts`
  - [ ] Query key: `['bookmarks']`; `queryFn`: `BookmarkStore.load()`
  - [ ] Export from `packages/api/src/index.ts`
  - _Requirements: SPEC-002 #1, #3, #5_

- [ ] 4. Create `useToggleBookmark` mutation
  - [ ] Add `useToggleBookmark(): UseMutationResult` to `packages/api/src/queries/bookmarks.ts`
  - [ ] `mutationFn`: calls `BookmarkStore.toggle(sessionId)`
  - [ ] `onMutate`: optimistic update — update `['bookmarks']` cache immediately
  - [ ] `onError`: roll back optimistic update
  - [ ] `onSettled`: invalidate `['bookmarks']` to sync with storage
  - [ ] Write integration test: toggle adds id; toggle again removes it; optimistic rollback on error
  - _Requirements: SPEC-002 #2, #3, #4_

- [ ] 5. Implement `detectConflicts` utility
  - [ ] Create `packages/utils/src/helpers/conflictDetection.ts`
  - [ ] `detectConflicts(sessions: Session[]): Set<string>` — O(n²) pairwise overlap check
  - [ ] `overlaps(a, b)`: `a.startTime < b.endTime && b.startTime < a.endTime`
  - [ ] Write unit tests: no sessions, non-overlapping, fully overlapping, adjacent (touching but not overlapping), partial overlap, three-way conflict
  - [ ] Export from `packages/utils/src/index.ts`
  - _Requirements: SPEC-002 #7, #8_

- [ ] 6. Create `BookmarkButton` component
  - [ ] Create `packages/ui/src/components/BookmarkButton.tsx`
  - [ ] Calls `useBookmarks()` and `useToggleBookmark()` internally
  - [ ] Renders filled icon when bookmarked, outline icon when not
  - [ ] Shows loading/disabled state while mutation is in flight
  - [ ] Accepts `sessionId: string` and optional `size: 'sm' | 'md'`
  - [ ] Write unit test: renders correct icon state; calls toggle on press
  - _Requirements: SPEC-002 #1, #2, #3, #4_

- [ ] 7. Build `MyScheduleScreen`
  - [ ] Create `apps/conference/app/(schedule)/my-schedule.tsx`
  - [ ] Call `useSessions()` and `useBookmarks()`
  - [ ] Join: filter `allSessions` to those whose ID is in the bookmark set
  - [ ] Run `detectConflicts(bookmarkedSessions)` to compute `conflictIds`
  - [ ] Render `FlatList` of `SessionCard` items; pass `isBookmarked={true}` and a conflict badge prop when `conflictIds.has(session.id)`
  - [ ] Show `EmptyState` ("No sessions bookmarked yet. Browse the schedule to add some.") when bookmark set is empty
  - [ ] Sessions ordered by `startTime` ascending
  - [ ] Write integration test: empty state, sessions list, conflict badge appears/disappears
  - _Requirements: SPEC-002 #5, #6, #7, #8_

- [ ] 8. Wire `BookmarkButton` into `SessionDetailScreen`
  - [ ] Replace the placeholder in `apps/conference/app/(schedule)/[sessionId].tsx` with `<BookmarkButton sessionId={session.id} />`
  - [ ] Verify tapping bookmark on detail is immediately reflected on My Schedule screen
  - _Requirements: SPEC-002 #2, #3_

- [ ] 9. Wire My Schedule into navigation
  - [ ] Add "My Schedule" as a second tab within `(schedule)` or as a dedicated tab in root navigation
  - [ ] Confirm bookmark state survives app restart (read from AsyncStorage on mount)
  - _Requirements: SPEC-002 #5, #9_
