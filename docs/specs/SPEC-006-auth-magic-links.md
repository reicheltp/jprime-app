---
id: SPEC-006
title: Auth — Magic Link / OTP Sign-In Requirements
feature: auth-magic-links
type: requirements
status: approved
created: 2026-06-04
updated: 2026-06-04
---

## Feature: Passwordless Authentication (OTP via Email)

**User Story:** As a conference attendee, I want to sign in with just my email address so that I can access personalised features (e.g. networking) without remembering a password.

---

### Acceptance Criteria

1. **WHEN** the user taps "Sign In" **THEN** the system SHALL display an email input screen.
2. **WHEN** the user submits a valid email **THEN** the system SHALL send a 6-digit one-time passcode to that email and navigate to the verification screen.
3. **WHEN** the user submits an invalid or empty email **THEN** the system SHALL display an inline validation error and NOT send any email.
4. **WHEN** the user enters the correct 6-digit code on the verification screen **THEN** the system SHALL create an authenticated session and navigate the user to the schedule.
5. **WHEN** the user enters an incorrect or expired code **THEN** the system SHALL display an inline error and allow re-entry.
6. **WHEN** the user taps "Resend Code" **THEN** the system SHALL re-send a fresh code to the same email.
7. **WHEN** the user taps "Use a different email" **THEN** the system SHALL navigate back to the email input screen.
8. **WHEN** the app is restarted **THEN** the system SHALL restore the authenticated session automatically (no re-login required).
9. **WHEN** the user signs out **THEN** the system SHALL clear the session and require sign-in again to access protected features.
10. **WHEN** a new email is submitted for the first time **THEN** the system SHALL create an account automatically (no separate registration step).

### Out of Scope

- Password-based login
- Social OAuth (Google, Apple) — deferred to a later spec
- Role-based access control
- Email change / account management UI
- Forced auth-gating of existing public screens (schedule, speakers, venue)

### Edge Cases

- Email not yet registered: auto-created on first OTP verify (AC #10)
- Code expired (default: 1 hour): system shows expiry error, user must resend
- No network: show network error toast, do not crash

### Constraints

- Auth provider must be replaceable with a self-hosted Supabase instance (only env-var changes — no code changes)
- Session token storage must use AsyncStorage for cross-restart persistence
- OTP codes must be numeric only, 6 digits
