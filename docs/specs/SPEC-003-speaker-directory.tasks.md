---
id: SPEC-003
title: Speaker Directory Tasks
feature: speaker-directory
type: tasks
status: draft
created: 2026-06-03
updated: 2026-06-03
---

# Tasks: Speaker Directory

> Depends on SPEC-004 tasks 1–2 (workspace scaffold + shared types) and SPEC-001 task 1 (API client).
> Reference design: SPEC-003-speaker-directory.design.md

---

- [ ] 1. Create `useSpeakers` and `useSpeaker` hooks
  - [ ] Create `packages/api/src/queries/speakers.ts`
  - [ ] `useSpeakers()`: query key `['speakers']`, calls `GET /api/v1/speakers`, `staleTime: 60_000`
  - [ ] `useSpeaker(id)`: query key `['speakers', id]`, calls `GET /api/v1/speakers/:id`
  - [ ] Export both from `packages/api/src/index.ts`
  - [ ] Write unit tests with mocked `apiFetch` returning fixture data
  - _Requirements: SPEC-003 #1, #4_

- [ ] 2. Implement alphabetical sort utility
  - [ ] Create `packages/utils/src/helpers/speakerSort.ts`
  - [ ] `sortSpeakersByLastName(speakers: Speaker[]): Speaker[]` — pure sort by `lastName` ascending, case-insensitive
  - [ ] Write unit tests including edge cases: same last name (sort by first name), accented characters
  - [ ] Export from `packages/utils/src/index.ts`
  - _Requirements: SPEC-003 #1_

- [ ] 3. Create `SpeakerAvatar` component
  - [ ] Create `packages/ui/src/components/SpeakerAvatar.tsx`
  - [ ] Render image from `photoUrl` when available; fall back to initials on load error or null
  - [ ] Initials: first letter of `firstName` + first letter of `lastName`, uppercased
  - [ ] Handle single-word names (use first two characters)
  - [ ] Accept `size: 'sm' | 'md' | 'lg'`
  - [ ] Write unit tests: initials generation for various name formats, null photoUrl renders initials
  - _Requirements: SPEC-003 #9_

- [ ] 4. Create `SpeakerCard` component
  - [ ] Create `packages/ui/src/components/SpeakerCard.tsx`
  - [ ] Display `SpeakerAvatar` (size `sm`), full name, session count badge
  - [ ] Accept `speaker: Speaker` and `onPress: () => void`
  - [ ] Write snapshot test
  - _Requirements: SPEC-003 #1_

- [ ] 5. Create `SessionListItem` component
  - [ ] Create `packages/ui/src/components/SessionListItem.tsx`
  - [ ] Display: session title, formatted time (HH:mm), room
  - [ ] Accept `session: SessionRef` and `onPress: () => void`
  - [ ] Write snapshot test
  - _Requirements: SPEC-003 #4, #5_

- [ ] 6. Build `SpeakersScreen`
  - [ ] Create `apps/conference/app/(speakers)/_layout.tsx` (Stack navigator)
  - [ ] Create `apps/conference/app/(speakers)/index.tsx`
  - [ ] Call `useSpeakers()`; sort with `sortSpeakersByLastName`
  - [ ] Render `FlatList` of `SpeakerCard` items
  - [ ] Show skeleton / spinner while `isLoading`
  - [ ] Show `ErrorState` with retry when `isError`
  - _Requirements: SPEC-003 #1, #2, #3_

- [ ] 7. Build `SpeakerDetailScreen`
  - [ ] Create `apps/conference/app/(speakers)/[speakerId].tsx`
  - [ ] Read `speakerId` from route params; call `useSpeaker(speakerId)`
  - [ ] Render: `SpeakerAvatar` (size `lg`), full name, bio (omit section if null), sessions list
  - [ ] Sessions list: render `SessionListItem` for each `SessionRef`; tapping navigates to `/(schedule)/[sessionId]`
  - [ ] Show empty-state ("No sessions scheduled") when `sessions` array is empty
  - [ ] Show spinner while loading; `ErrorState` on error
  - _Requirements: SPEC-003 #4, #5, #8, #9; edge case — no sessions, long bio_

- [ ] 8. Wire speaker links into `SessionDetailScreen`
  - [ ] In `apps/conference/app/(schedule)/[sessionId].tsx`, render each speaker in `session.speakers` as a `Pressable`
  - [ ] On press: `router.push('/(speakers)/' + speaker.id)`
  - [ ] Verify round-trip navigation: schedule → session detail → speaker detail → back
  - _Requirements: SPEC-003 #6, #7_

- [ ] 9. Wire speakers into root navigation
  - [ ] Add a "Speakers" tab entry in `apps/conference/app/_layout.tsx`
  - [ ] Confirm navigation to speakers list and back works end-to-end
  - _Requirements: SPEC-003 #1_
