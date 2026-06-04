---
id: SPEC-007
title: User Profile Management Design
feature: user-profile
type: design
status: approved
created: 2026-06-04
updated: 2026-06-04
---

## Overview

Profile fields are stored as additional nullable columns on the existing `users` table. The Hono API exposes two protected endpoints. The conference app adds a Profile tab that shows a view/edit screen.

---

## Architecture

```
apps/api/src/
├── auth/
│   └── jwt.ts             ← shared jwtSecret() + signToken() + verifyToken()
├── middleware/
│   └── auth.ts            ← requireAuth middleware; injects userId/userEmail into context
└── routes/
    ├── auth.ts            ← updated to use auth/jwt.ts helpers
    └── profile.ts         ← GET /api/v1/profile, PUT /api/v1/profile

apps/conference/
├── lib/
│   └── profileClient.ts   ← authFetch wrapper, getProfile(), updateProfile()
├── hooks/
│   └── useProfile.ts      ← useProfile() + useUpdateProfile() React Query hooks
└── app/
    ├── _layout.tsx         ← adds Profile tab
    └── (profile)/
        ├── _layout.tsx
        ├── index.tsx       ← view screen (unauthenticated gate + profile display)
        └── edit.tsx        ← edit form screen
```

---

## Database Schema

Profile columns added to the existing `users` table (migration-safe — ALTER TABLE ADD COLUMN):

```sql
ALTER TABLE users ADD COLUMN display_name TEXT;
ALTER TABLE users ADD COLUMN company      TEXT;
ALTER TABLE users ADD COLUMN bio          TEXT;
ALTER TABLE users ADD COLUMN avatar_url   TEXT;
ALTER TABLE users ADD COLUMN linkedin_url TEXT;
ALTER TABLE users ADD COLUMN twitter_url  TEXT;
ALTER TABLE users ADD COLUMN github_url   TEXT;
ALTER TABLE users ADD COLUMN website_url  TEXT;
```

Fresh installs use the updated `CREATE TABLE IF NOT EXISTS` which includes all columns.

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/profile` | Bearer JWT | Return current user's profile |
| PUT | `/api/v1/profile` | Bearer JWT | Update current user's profile |

### GET /api/v1/profile

Response `200`:
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "Georgi Ivanov",
    "company": "Sofia Tech Labs",
    "bio": "Java developer...",
    "avatarUrl": null,
    "linkedinUrl": "https://linkedin.com/in/georgi",
    "twitterUrl": null,
    "githubUrl": null,
    "websiteUrl": null
  }
}
```

### PUT /api/v1/profile

All fields optional. Empty string is normalised to `null`.

Request body (all optional):
```json
{
  "displayName": "Georgi Ivanov",
  "company": "Sofia Tech Labs",
  "bio": "Java developer...",
  "avatarUrl": null,
  "linkedinUrl": "https://linkedin.com/in/georgi",
  "twitterUrl": null,
  "githubUrl": null,
  "websiteUrl": null
}
```

Validation errors return `400` with `{ error: "...", code: "VALIDATION_ERROR", field: "bio" }`.

---

## Auth Middleware

`requireAuth` (Hono middleware) extracts and verifies the Bearer JWT, then injects `userId` and `userEmail` into the Hono context via typed `ContextVariableMap`. All profile and future networking routes use it.

---

## Components and Interfaces

### `lib/profileClient.ts`

```typescript
interface Profile {
  id: string; email: string
  displayName: string | null; company: string | null; bio: string | null
  avatarUrl: string | null; linkedinUrl: string | null
  twitterUrl: string | null; githubUrl: string | null; websiteUrl: string | null
}
type ProfileUpdate = Omit<Profile, 'id' | 'email'>

getProfile(token): Promise<Profile>
updateProfile(token, update): Promise<Profile>
```

### `hooks/useProfile.ts`

```typescript
useProfile(): UseQueryResult<Profile>         // fetches GET /api/v1/profile
useUpdateProfile(): UseMutationResult<...>    // calls PUT /api/v1/profile, invalidates cache
```

### Profile tab screens

**`(profile)/index.tsx`**
- `useAuth()` → if no session, render sign-in CTA
- `useProfile()` → loading/error/data states
- Displays: initials avatar (or image), name, company, bio, social link chips
- "Edit Profile" button → navigates to `/(profile)/edit`

**`(profile)/edit.tsx`**
- Pre-fills form from `useProfile()` data
- `useUpdateProfile()` mutation on save
- Inline field validation before submit
- "Save" / "Cancel" buttons in header

---

## Initials Avatar

Generated from `displayName` if set (first letter of each word, max 2), otherwise first character of email prefix. Rendered as a circle with a deterministic background colour derived from the user ID.

---

## Error Handling

| Scenario | Response |
|---|---|
| Missing/invalid JWT | 401 `UNAUTHORIZED` / `INVALID_TOKEN` |
| Bio > 280 chars | 400 `VALIDATION_ERROR`, `field: "bio"` |
| Invalid URL format | 400 `VALIDATION_ERROR`, `field: "<fieldName>"` |
| User not found (shouldn't happen) | 404 `NOT_FOUND` |
