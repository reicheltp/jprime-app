---
id: SPEC-006
title: User Profile Management Tasks
feature: user-profile
type: tasks
status: implemented
created: 2026-06-04
updated: 2026-06-04
---

## API

- [x] 1. Extract JWT helpers into `apps/api/src/auth/jwt.ts`
  - [x] `jwtSecret()`, `signToken()`, `verifyToken()`
  - [x] Update `routes/auth.ts` to import from jwt.ts

- [x] 2. Create `apps/api/src/middleware/auth.ts` — `requireAuth` middleware
  - [x] Verify Bearer JWT, inject `userId` / `userEmail` into context

- [x] 3. Add profile columns to `apps/api/src/db/index.ts`
  - [x] Update `CREATE TABLE` for fresh installs
  - [x] `ALTER TABLE ADD COLUMN` migrations for existing DBs
  - [x] `UserWithProfile` interface

- [x] 4. Create `apps/api/src/routes/profile.ts`
  - [x] `GET /api/v1/profile` — return current user's profile
  - [x] `PUT /api/v1/profile` — validate + persist updates
  - [x] Validation: bio ≤ 280, URLs must be https://, max lengths

- [x] 5. Register profile routes in `apps/api/src/index.ts`

- [x] 6. Update seed script with display names, companies, bios

## Conference App

- [x] 7. Create `apps/conference/lib/profileClient.ts`
  - [x] `Profile` interface, `ProfileUpdate` type
  - [x] `getProfile(token)`, `updateProfile(token, update)`

- [x] 8. Create `apps/conference/hooks/useProfile.ts`
  - [x] `useProfile()` — React Query fetch hook
  - [x] `useUpdateProfile()` — mutation + cache invalidation

- [x] 9. Create `apps/conference/app/(profile)/_layout.tsx`

- [x] 10. Create `apps/conference/app/(profile)/index.tsx` — profile view
  - [x] Unauthenticated gate (sign-in CTA)
  - [x] Initials avatar with fallback
  - [x] Display name, company, bio, social link chips
  - [x] "Edit Profile" button
  - _Requirements: SPEC-006 #1, #5, #6, #7, #8_

- [x] 11. Create `apps/conference/app/(profile)/edit.tsx` — edit form
  - [x] All profile fields as Input components
  - [x] Client-side validation before submit
  - [x] Save / Cancel
  - _Requirements: SPEC-006 #2, #3, #4, #9, #10_

- [x] 12. Add Profile tab to `apps/conference/app/_layout.tsx`
  - _Requirements: SPEC-006 #8_

## Docs

- [x] 13. Update `docs/features.md`
