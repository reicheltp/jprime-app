---
id: SPEC-005
title: Auth — Magic Link / OTP Sign-In Design
feature: auth-magic-links
type: design
status: approved
created: 2026-06-04
updated: 2026-06-04
---

## Overview

Passwordless sign-in using a 6-digit OTP sent by email. The auth server lives inside the existing Hono API (`apps/api`), backed by **Bun's built-in SQLite** — no external services required for local development.

This spec is the **auth foundation** for the upcoming networking feature (SPEC-006+). It intentionally does not gate existing public screens.

---

## Local Development Setup

Everything runs without external dependencies:

```bash
# 1. Start the API (auth + conference data)
bun run dev  # from apps/api — SQLite DB created automatically

# 2. (Optional) Run Mailpit for email preview
#    brew install mailpit  OR  go install github.com/axllent/mailpit@latest
mailpit   # SMTP :1025, web UI http://localhost:8025

# Without Mailpit: set OTP_EXPOSE_IN_RESPONSE=true in apps/api/.env.local
# and the OTP code is logged to stdout and returned in the API response.
```

Copy `apps/api/.env.example` → `apps/api/.env.local` to configure.

### Production / Self-Hosted

Switch the database by changing `DATABASE_PATH` to a `postgres://` URL (requires adding `postgres` npm package and swapping the DB adapter — one small code change). Configure real SMTP credentials via the same env vars.

---

## Architecture

```
apps/api/src/
├── db/
│   └── index.ts          ← Bun SQLite; schema init; User + OtpToken types
├── auth/
│   └── otp.ts            ← generateOtp() + hashOtp() (SHA-256)
├── email/
│   └── index.ts          ← nodemailer; no-op when SMTP_HOST unset
└── routes/
    └── auth.ts           ← POST /otp/request, POST /otp/verify, GET /me

apps/conference/
├── lib/
│   └── authClient.ts     ← fetch wrappers + AsyncStorage session persistence
└── providers/
    └── AuthProvider.tsx  ← React context: session, user, isLoading, signOut
```

### OTP flow

```
login.tsx
  → authClient.requestOtp(email)
  → POST /api/v1/auth/otp/request
      → generateOtp() → hashOtp() → INSERT otp_tokens
      → sendOtpEmail() (nodemailer / stdout fallback)
  → navigate to verify.tsx?email=...

verify.tsx
  → authClient.verifyOtp(email, code)
  → POST /api/v1/auth/otp/verify
      → fetch latest unused, non-expired token for email
      → compare hashOtp(code) — constant-time equivalent
      → mark token used → upsert user
      → sign JWT (HS256, 7-day exp)
  → authClient.saveSession({ token, user }) → AsyncStorage
  → AuthProvider picks up session from loadSession() on next mount
  → router.replace('/(schedule)')
```

---

## Database Schema (SQLite)

```sql
CREATE TABLE users (
  id         TEXT PRIMARY KEY,   -- UUID
  email      TEXT UNIQUE NOT NULL,
  created_at INTEGER NOT NULL    -- Unix ms
);

CREATE TABLE otp_tokens (
  id         TEXT PRIMARY KEY,   -- UUID
  email      TEXT NOT NULL,
  code_hash  TEXT NOT NULL,      -- SHA-256 of the 6-digit code
  expires_at INTEGER NOT NULL,   -- Unix ms; TTL = 10 minutes
  used       INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);
```

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/otp/request` | — | Send OTP to email |
| POST | `/api/v1/auth/otp/verify` | — | Verify OTP, return JWT |
| GET | `/api/v1/auth/me` | Bearer JWT | Return current user |

### Rate limiting

`POST /otp/request` allows max 3 requests per email per 10-minute window (enforced in-process via DB count query).

---

## Components and Interfaces

### `lib/authClient.ts`

```typescript
interface AuthUser    { id: string; email: string }
interface AuthSession { token: string; user: AuthUser }

requestOtp(email): Promise<void>
verifyOtp(email, code): Promise<AuthSession>
loadSession(): Promise<AuthSession | null>
saveSession(session): Promise<void>
clearSession(): Promise<void>
```

### `providers/AuthProvider.tsx`

```typescript
interface AuthContextType {
  session: AuthSession | null
  user: AuthUser | null
  isLoading: boolean        // true until loadSession() resolves on mount
  signOut: () => Promise<void>
}

export function AuthProvider({ children }: PropsWithChildren): JSX.Element
export function useAuth(): AuthContextType
```

---

## Environment Variables

### `apps/api/.env.local`

| Variable | Default | Description |
|---|---|---|
| `DATABASE_PATH` | `./jprime-auth.db` | SQLite file path |
| `SMTP_HOST` | _(unset)_ | Leave empty to log OTPs to stdout |
| `SMTP_PORT` | `1025` | Mailpit default |
| `SMTP_FROM` | `noreply@jprime.io` | Sender address |
| `JWT_SECRET` | `dev-secret-…` | **Change in production** |
| `OTP_EXPOSE_IN_RESPONSE` | `false` | Return code in response (dev/test only) |

### `apps/conference/.env.local`

| Variable | Default | Description |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | `http://localhost:3000` | Points to `apps/api` |

---

## Error Handling

| Scenario | API response |
|---|---|
| Invalid email format | 400 `INVALID_EMAIL` |
| Rate limit exceeded | 429 `RATE_LIMITED` |
| Wrong / expired OTP | 401 `INVALID_CODE` |
| Invalid JWT | 401 `INVALID_TOKEN` |
| SMTP failure | 500 (surfaced via `app.onError`) |

---

## Testing

- **No external deps needed:** set `OTP_EXPOSE_IN_RESPONSE=true`, read the code from the response.
- **Unit:** mock `db` and `sendOtpEmail`; test OTP generation, hashing, expiry logic.
- **Integration:** start API with in-memory SQLite (`:memory:` path via `DATABASE_PATH`), run full request cycle.

---

## Decision Log

| Decision | Rationale |
|---|---|
| Bun SQLite (built-in) | Zero install, no Docker; sufficient for conference load |
| Raw SQL, no ORM | 2 tables, simple CRUD — ORM overhead not justified |
| SHA-256 OTP hash | Prevents plaintext token storage; fast enough for 6-digit codes |
| nodemailer | Battle-tested SMTP client; null transport logs to stdout for local dev |
| JWT (stateless) | No session table needed; 7-day TTL fits conference duration |
| `OTP_EXPOSE_IN_RESPONSE` | Makes automated tests dependency-free (no SMTP required) |
| Auth does NOT gate existing screens | Schedule/speakers/venue are public; auth is opt-in for networking |
