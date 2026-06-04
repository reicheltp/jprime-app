---
id: SPEC-003
title: Speaker Directory Tasks
feature: speaker-directory
type: tasks
status: implemented
created: 2026-06-03
updated: 2026-06-04
---

# Tasks: Speaker Directory

> Depends on SPEC-004 tasks 1–2 (workspace scaffold + shared types) and SPEC-001 task 1 (API client).
> Reference design: SPEC-003-speaker-directory.design.md

---

- [x] 1. Create `useSpeakers` and `useSpeaker` hooks
  - [x] Create `packages/api/src/queries/speakers.ts`
  - [x] `useSpeakers()`: query key `['speakers']`, calls `GET /api/v1/speakers`, `staleTime: 60_000`
  - [x] `useSpeaker(id)`: query key `['speakers', id]`, calls `GET /api/v1/speakers/:id`
  - [x] Export both from `packages/api/src/index.ts`
  - [x] Write unit tests with mocked `apiFetch` returning fixture data
  - _Requirements: SPEC-003 #1, #4_

- [x] 2. Implement alphabetical sort utility
  - [x] Create `packages/utils/src/helpers/speakerSort.ts`
  - [x] `sortSpeakersByLastName(speakers: Speaker[]): Speaker[]` — pure sort by `lastName` ascending, case-insensitive
  - [x] Write unit tests including edge cases: same last name (sort by first name), accented characters
  - [x] Export from `packages/utils/src/index.ts`
  - _Requirements: SPEC-003 #1_

- [x] 3. Create `SpeakerAvatar` component
  - [x] Create `packages/ui/src/components/SpeakerAvatar.tsx`
  - [x] Render image from `photoUrl` when available; fall back to initials on load error or null
  - [x] Initials: first letter of `firstName` + first letter of `lastName`, uppercased
  - [x] Handle single-word names (use first two characters)
  - [x] Accept `size: 'sm' | 'md' | 'lg'`
  - [x] Write unit tests: initials generation for various name formats, null photoUrl renders initials
  - _Requirements: SPEC-003 #9_

- [x] 4. Create `SpeakerCard` component
  - [x] Create `packages/ui/src/components/SpeakerCard.tsx`
  - [x] Display `SpeakerAvatar` (size `sm`), full name, session count badge
  - [x] Accept `speaker: Speaker` and `onPress: () => void`
  - [x] Write snapshot test
  - _Requirements: SPEC-003 #1_

- [x] 5. Create `SessionListItem` component
  - [x] Create `packages/ui/src/components/SessionListItem.tsx`
  - [x] Display: session title, formatted time (HH:mm), room
  - [x] Accept `session: SessionRef` and `onPress: () => void`
  - [x] Write snapshot test
  - _Requirements: SPEC-003 #4, #5_

- [x] 6. Build `SpeakersScreen`
  - [x] Create `apps/conference/app/(speakers)/_layout.tsx` (Stack navigator)
  - [x] Create `apps/conference/app/(speakers)/index.tsx`
  - [x] Call `useSpeakers()`; sort with `sortSpeakersByLastName`
  - [x] Render `FlatList` of `SpeakerCard` items
  - [x] Show skeleton / spinner while `isLoading`
  - [x] Show `ErrorState` with retry when `isError`
  - _Requirements: SPEC-003 #1, #2, #3_

- [x] 7. Build `SpeakerDetailScreen`
  - [x] Create `apps/conference/app/(speakers)/[speakerId].tsx`
  - [x] Read `speakerId` from route params; call `useSpeaker(speakerId)`
  - [x] Render: `SpeakerAvatar` (size `lg`), full name, bio (omit section if null), sessions list
  - [x] Sessions list: render `SessionListItem` for each `SessionRef`; tapping navigates to `/(schedule)/[sessionId]`
  - [x] Show empty-state ("No sessions scheduled") when `sessions` array is empty
  - [x] Show spinner while loading; `ErrorState` on error
  - _Requirements: SPEC-003 #4, #5, #8, #9; edge case — no sessions, long bio_

- [x] 8. Wire speaker links into `SessionDetailScreen`
  - [x] In `apps/conference/app/(schedule)/[sessionId].tsx`, render each speaker in `session.speakers` as a `Pressable`
  - [x] On press: `router.push('/(speakers)/' + speaker.id)`
  - [x] Verify round-trip navigation: schedule → session detail → speaker detail → back
  - _Requirements: SPEC-003 #6, #7_

- [x] 9. Wire speakers into root navigation
  - [x] Add a "Speakers" tab entry in `apps/conference/app/_layout.tsx`
  - [x] Confirm navigation to speakers list and back works end-to-end
  - _Requirements: SPEC-003 #1_
