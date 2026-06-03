---
id: SPEC-003
title: Speaker Directory Design
feature: speaker-directory
type: design
status: approved
created: 2026-06-03
updated: 2026-06-03
---

# Design: Speaker Directory

## Overview

A speakers screen lists all conference speakers alphabetically. Tapping a speaker opens a detail screen with their bio and sessions. Session cards on the speaker detail screen deep-link back into the schedule domain. Speaker links on session detail screens deep-link into the speakers domain. All data comes from the Conference Data API (SPEC-004) via React Query hooks.

---

## Architecture

```
apps/conference/app/(speakers)/
├── _layout.tsx              # Stack navigator for the speakers domain
├── index.tsx                # SpeakersScreen — alphabetical list
└── [speakerId].tsx          # SpeakerDetailScreen

packages/api/src/
└── queries/
    └── speakers.ts          # useSpeakers(), useSpeaker(id)

packages/ui/src/
└── components/
    ├── SpeakerCard.tsx
    ├── SpeakerAvatar.tsx
    └── SessionListItem.tsx   # Compact session row (reused on speaker detail)
```

---

## Components and Interfaces

### `SpeakersScreen` (`app/(speakers)/index.tsx`)

Calls `useSpeakers()`. Renders a `FlatList` of `SpeakerCard` items sorted by `lastName` ascending. No local filter state — alphabetical sort is sufficient for up to ~100 speakers.

### `SpeakerDetailScreen` (`app/(speakers)/[speakerId].tsx`)

Reads `speakerId` from route params. Calls `useSpeaker(speakerId)`. Renders:
- `SpeakerAvatar` (photo or placeholder)
- Full name
- Bio (scrollable; multi-paragraph)
- "Sessions" section: list of `SessionListItem`, tapping navigates to `(schedule)/[sessionId]`

### React Query hooks (`packages/api/src/queries/speakers.ts`)

```typescript
// Fetch all speakers (sorted server-side or client-side by lastName)
export function useSpeakers(): UseQueryResult<Speaker[]>

// Fetch single speaker by ID
export function useSpeaker(id: string): UseQueryResult<Speaker>
```

Cache keys:
- `['speakers']` — full list
- `['speakers', id]` — single speaker

`staleTime: 60_000` — same policy as sessions.

### `SpeakerCard` (`packages/ui/src/components/SpeakerCard.tsx`)

```typescript
interface SpeakerCardProps {
  speaker: Speaker
  onPress: () => void
}
```

Displays: avatar, full name, session count badge. Compact — designed for a dense alphabetical list.

### `SpeakerAvatar` (`packages/ui/src/components/SpeakerAvatar.tsx`)

```typescript
interface SpeakerAvatarProps {
  photoUrl: string | null
  name: string             // used to generate initials placeholder
  size?: 'sm' | 'md' | 'lg'
}
```

If `photoUrl` is null or the image fails to load, renders a circle with the speaker's initials (first letter of `firstName` + first letter of `lastName`).

### `SessionListItem` (`packages/ui/src/components/SessionListItem.tsx`)

```typescript
interface SessionListItemProps {
  session: SessionRef       // compact reference — no full Session needed
  onPress: () => void
}
```

Reusable compact session row. Used on speaker detail to list that speaker's sessions. Shows: title, time, room.

---

## Data Models

`Speaker` and `SessionRef` types are defined in `@jprime/types` — see SPEC-004 design. No additional types needed for this feature.

---

## Navigation Flow

```
Tab: Speakers
  └── (speakers)/index            ← SpeakersScreen
        └── tap speaker
              └── (speakers)/[speakerId]   ← SpeakerDetailScreen
                    └── tap session
                          └── (schedule)/[sessionId]   ← SPEC-001 SessionDetailScreen

(schedule)/[sessionId]            ← SessionDetailScreen (SPEC-001)
  └── tap speaker name
        └── (speakers)/[speakerId]         ← SpeakerDetailScreen
```

Cross-domain navigation (schedule ↔ speakers) uses Expo Router's `router.push()` with absolute paths:
- `router.push('/(speakers)/' + speakerId)`
- `router.push('/(schedule)/' + sessionId)`

---

## Error Handling

| State | UI Behaviour |
|-------|-------------|
| Loading list | Skeleton list items / spinner |
| Error loading list | `ErrorState` with retry |
| Loading detail | Spinner while detail loads |
| Error loading detail | `ErrorState` with back navigation |
| No bio | Bio section omitted entirely — no empty placeholder |
| No photo | `SpeakerAvatar` shows initials placeholder |
| No sessions | "No sessions scheduled" empty-state in the sessions section |

---

## Testing Strategy

- Unit test `SpeakerAvatar` — initials generation (edge cases: single-word names, special characters)
- Unit test alphabetical sort logic (pure function)
- Integration test `SpeakersScreen` — renders list with mocked `useSpeakers` data
- Integration test `SpeakerDetailScreen` — renders bio, sessions list, and verifies navigation calls on session tap
- Test that broken photo URL falls back to initials avatar

---

## Decision Log

| Decision | Rationale |
|----------|-----------|
| Client-side alphabetical sort | ~100 speakers; no need for API-side sort parameter; simpler API contract |
| `SessionRef` on detail (not full `Session`) | Speaker's session list only needs title/time/room — avoids over-fetching and keeps the speaker endpoint payload lean |
| `SpeakerAvatar` as a standalone component | Initials fallback logic is non-trivial; isolating it makes testing straightforward |
| `SessionListItem` separate from `SessionCard` | The compact row on speaker detail has different information density than the full card on the schedule screen; shared component would need too many props |
| Cross-domain navigation via absolute paths | Expo Router absolute paths are explicit and refactor-safe; avoids relative path bugs across nested route groups |
