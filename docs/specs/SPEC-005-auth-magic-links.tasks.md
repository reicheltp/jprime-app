---
id: SPEC-005
title: Auth — Magic Link / OTP Sign-In Tasks
feature: auth-magic-links
type: tasks
status: draft
created: 2026-06-04
updated: 2026-06-04
---

- [x] 1. Add `@supabase/supabase-js` dependency to `apps/conference`
  - _Requirements: SPEC-005 #2, #4_

- [x] 2. Create `apps/conference/lib/supabase.ts` — singleton Supabase client
  - [x] Configure AsyncStorage as auth storage
  - [x] Read URL and anon key from `EXPO_PUBLIC_SUPABASE_*` env vars
  - _Requirements: SPEC-005 #8 (session persistence)_

- [x] 3. Create `apps/conference/providers/AuthProvider.tsx`
  - [x] `AuthContext` with `session`, `user`, `isLoading`, `signOut`
  - [x] `getSession()` on mount for session restore
  - [x] `onAuthStateChange` subscription for live updates
  - [x] `useAuth()` export hook
  - _Requirements: SPEC-005 #8, #9_

- [x] 4. Rewrite `apps/conference/app/(auth)/login.tsx` — email OTP request screen
  - [x] Remove password field and social login buttons
  - [x] Email validation (inline error, no API call on invalid)
  - [x] Call `signInWithOtp` on submit
  - [x] Navigate to verify screen on success
  - _Requirements: SPEC-005 #1, #2, #3_

- [x] 5. Create `apps/conference/app/(auth)/verify.tsx` — OTP verification screen
  - [x] Receive `email` via route params
  - [x] Numeric-only 6-digit code input with `textContentType: 'oneTimeCode'`
  - [x] Call `verifyOtp` on submit
  - [x] Navigate to schedule on success
  - [x] Inline error on wrong/expired code
  - [x] Resend button
  - [x] Back-to-email button
  - _Requirements: SPEC-005 #4, #5, #6, #7_

- [x] 6. Update `apps/conference/app/(auth)/_layout.tsx` — register `verify` screen
  - _Requirements: SPEC-005 #2_

- [x] 7. Update `apps/conference/app/_layout.tsx` — wrap tree with `<AuthProvider>`
  - _Requirements: SPEC-005 #8_

- [x] 8. Add `.env.example` with `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
  - _Requirements: SPEC-005 design_

- [x] 9. Update `docs/features.md` — add SPEC-005 row

- [ ] 10. Manual verification
  - [ ] Enter real email → code arrives in inbox
  - [ ] Enter correct code → navigated to schedule, session stored
  - [ ] Kill and relaunch app → session restored (no re-login)
  - [ ] Sign out → session cleared
  - [ ] Enter wrong code → inline error shown
  - _Requirements: SPEC-005 #1–#10_
