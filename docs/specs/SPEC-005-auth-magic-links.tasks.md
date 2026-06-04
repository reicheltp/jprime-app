---
id: SPEC-005
title: Auth — Magic Link / OTP Sign-In Tasks
feature: auth-magic-links
type: tasks
status: implemented
created: 2026-06-04
updated: 2026-06-04
---

## API — auth layer in `apps/api`

- [x] 1. Create `apps/api/src/db/index.ts` — Bun SQLite with auto-init schema
  - [x] `users` table (id, email, created_at)
  - [x] `otp_tokens` table (id, email, code_hash, expires_at, used, created_at)
  - [x] WAL mode + index on (email, used, expires_at)
  - _Requirements: SPEC-005 #2, #4, #10_

- [x] 2. Create `apps/api/src/auth/otp.ts` — OTP utilities
  - [x] `generateOtp()` — crypto-random 6-digit string (leading-zero safe)
  - [x] `hashOtp(code)` — SHA-256 via `node:crypto`
  - _Requirements: SPEC-005 #2, #5_

- [x] 3. Create `apps/api/src/email/index.ts` — nodemailer transport
  - [x] Configured from `SMTP_HOST / SMTP_PORT / SMTP_FROM / SMTP_USER / SMTP_PASS`
  - [x] Falls back to `console.log` when `SMTP_HOST` is unset
  - _Requirements: SPEC-005 #2_

- [x] 4. Create `apps/api/src/routes/auth.ts` — auth endpoints
  - [x] `POST /api/v1/auth/otp/request` — validate email, rate-limit (3/10 min), insert token, send email
  - [x] `POST /api/v1/auth/otp/verify` — verify hash, mark used, upsert user, return HS256 JWT
  - [x] `GET /api/v1/auth/me` — verify Bearer JWT, return user
  - [x] `OTP_EXPOSE_IN_RESPONSE=true` returns code in response (dev/test only)
  - _Requirements: SPEC-005 #2, #3, #4, #5, #6, #9, #10_

- [x] 5. Update `apps/api/src/middleware/cors.ts` — allow `POST` + `Authorization` header
  - _Requirements: SPEC-005 #2, #4_

- [x] 6. Register auth routes in `apps/api/src/index.ts`

- [x] 7. Add `apps/api/.env.example` — documents all auth env vars with comments

## Conference app — replace Supabase

- [x] 8. Create `apps/conference/lib/authClient.ts`
  - [x] `requestOtp(email)` — POST /otp/request, throws on error
  - [x] `verifyOtp(email, code)` — POST /otp/verify, returns `AuthSession`
  - [x] `loadSession / saveSession / clearSession` — AsyncStorage persistence
  - _Requirements: SPEC-005 #2, #4, #8_

- [x] 9. Rewrite `apps/conference/providers/AuthProvider.tsx`
  - [x] Custom `AuthSession` / `AuthUser` types (no Supabase dependency)
  - [x] `loadSession()` on mount for session restore
  - [x] `useAuth()` export hook
  - _Requirements: SPEC-005 #8, #9_

- [x] 10. Rewrite `apps/conference/app/(auth)/login.tsx`
  - [x] Email-only input (no password field)
  - [x] Calls `authClient.requestOtp`, navigates to verify on success
  - _Requirements: SPEC-005 #1, #2, #3_

- [x] 11. Create `apps/conference/app/(auth)/verify.tsx`
  - [x] 6-digit numeric input, `textContentType: 'oneTimeCode'`
  - [x] Calls `authClient.verifyOtp`, saves session, navigates to schedule
  - [x] Inline error, Resend button, back-to-email button
  - _Requirements: SPEC-005 #4, #5, #6, #7_

- [x] 12. Update `apps/conference/app/(auth)/_layout.tsx` — register `verify` screen

- [x] 13. Wrap root layout with `<AuthProvider>`

- [x] 14. Remove `@supabase/supabase-js`; delete `lib/supabase.ts`

- [x] 15. Update `docs/features.md` + `.env.example`

## Manual verification (run once against a real email)

- [ ] 16. Enter email → code arrives in inbox (or stdout if no SMTP)
  - _Requirements: SPEC-005 #1, #2_
- [ ] 17. Enter correct code → navigated to schedule, session stored in AsyncStorage
  - _Requirements: SPEC-005 #4_
- [ ] 18. Kill and relaunch app → session restored automatically (no re-login)
  - _Requirements: SPEC-005 #8_
- [ ] 19. Sign out → session cleared, re-login required
  - _Requirements: SPEC-005 #9_
- [ ] 20. Enter wrong code → inline error shown, no session created
  - _Requirements: SPEC-005 #5_
