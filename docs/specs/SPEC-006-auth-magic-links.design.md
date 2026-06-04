---
id: SPEC-006
title: Auth — Magic Link / OTP Sign-In Design
feature: auth-magic-links
type: design
status: approved
created: 2026-06-04
updated: 2026-06-04
---

## Overview

Passwordless sign-in using Supabase's email OTP feature. The user enters their email, receives a 6-digit code, and enters it in-app. The session is stored in AsyncStorage and restored on each app launch.

This spec is the **auth foundation** for the upcoming networking feature (SPEC-007+). It intentionally does not gate existing public screens.

---

## Self-Hosting Notice

> Supabase is fully open-source. The entire auth stack (GoTrue auth service + PostgreSQL) can be self-hosted via the official Docker Compose setup with zero code changes.
>
> To switch to self-hosted:
> 1. Deploy the [Supabase Docker stack](https://supabase.com/docs/guides/self-hosting/docker)
> 2. Configure your own SMTP server in `supabase/config.toml`
> 3. Set two env vars in `.env.local`:
>    - `EXPO_PUBLIC_SUPABASE_URL` → your instance URL (e.g. `https://supabase.yourdomain.com`)
>    - `EXPO_PUBLIC_SUPABASE_ANON_KEY` → your project's `anon` key
>
> **No application code changes required.**

---

## Architecture

```
apps/conference/
├── lib/
│   └── supabase.ts          ← singleton Supabase client (env-var configured)
├── providers/
│   └── AuthProvider.tsx     ← React context: session, user, isLoading, signOut
└── app/
    ├── _layout.tsx           ← wraps tree with <AuthProvider>
    └── (auth)/
        ├── _layout.tsx       ← Stack with login + verify screens
        ├── login.tsx         ← email input → signInWithOtp
        └── verify.tsx        ← 6-digit OTP → verifyOtp → session
```

### Data flow

```
login.tsx
  → supabase.auth.signInWithOtp({ email })
  → navigate to verify.tsx?email=...

verify.tsx
  → supabase.auth.verifyOtp({ email, token, type: 'email' })
  → AuthProvider.onAuthStateChange fires → session set in context
  → router.replace('/(schedule)')
```

---

## Components and Interfaces

### `lib/supabase.ts`

```typescript
export const supabase: SupabaseClient
```

Singleton client. Created once with:
- `auth.storage` → AsyncStorage wrapper (for cross-restart session persistence)
- `auth.autoRefreshToken: true`
- `auth.persistSession: true`
- `auth.detectSessionInUrl: false` (no deep-link magic-link; using OTP only)

### `providers/AuthProvider.tsx`

```typescript
interface AuthContextType {
  session: Session | null
  user: User | null
  isLoading: boolean   // true until first getSession() resolves
  signOut: () => Promise<void>
}

export function AuthProvider({ children }: PropsWithChildren): JSX.Element
export function useAuth(): AuthContextType
```

Subscribes to `supabase.auth.onAuthStateChange` for live session updates.

### `app/(auth)/login.tsx`

State: `email`, `emailError`, `isLoading`

Calls `supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } })`.

On success: navigates to `/(auth)/verify` with `email` as a route param.

### `app/(auth)/verify.tsx`

Receives `email` via `useLocalSearchParams`.

State: `code` (numeric string, max 6 chars), `codeError`, `isLoading`

Calls `supabase.auth.verifyOtp({ email, token: code, type: 'email' })`.

On success: `router.replace('/(schedule)')`.

---

## Data Models

No new persisted data models. Supabase manages the `auth.users` table internally. The `Session` object from `@supabase/supabase-js` carries the JWT and refresh token.

Future networking feature will join on `auth.users.id` to store attendee profiles.

---

## Environment Variables

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL (cloud or self-hosted) |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |

Add both to `.env.local` (git-ignored). See `.env.example` for the template.

---

## Error Handling

| Scenario | Handling |
|---|---|
| Invalid email format | Client-side validation, inline error, no API call |
| OTP send failure (rate limit, SMTP) | Show `error.message` in email field |
| Wrong / expired OTP | Show `error.message` under code input |
| Network error | Surface `error.message`; user can retry |
| Session restore fails | Treat as unauthenticated; no crash |

---

## Testing Strategy

- Unit: AuthProvider state transitions (mock Supabase client)
- Integration: login → verify flow with Supabase local emulator
- Manual: sign-in with real email, verify code, restart app (session persists), sign out

---

## Decision Log

| Decision | Rationale |
|---|---|
| OTP (not magic-link deep links) | OTP requires no deep-link config; simpler for mobile; works identically on web |
| Supabase hosted tier | Free 50k MAU; real-time subscriptions needed for networking; self-hostable (see notice above) |
| AsyncStorage for session | Standard React Native persistence; already a project dependency |
| `shouldCreateUser: true` | Removes separate registration screen; new users auto-provisioned on first OTP |
| Auth does NOT gate existing screens | Schedule/speakers/venue are public; auth is foundation for opt-in networking only |
