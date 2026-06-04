---
id: ADR-015
title: Self-Hosted OTP Auth in Hono API (vs. Third-Party Auth Service)
status: accepted
date: 2026-06-04
deciders:
  - paul@huskycare.de
tags:
  - auth
  - infrastructure
  - local-dev
superseded_by: ~
related:
  - ADR-011-hono-api-server.md
  - ADR-005-bun-runtime.md
---

# ADR-015: Self-Hosted OTP Auth in Hono API (vs. Third-Party Auth Service)

## Context

SPEC-005 requires passwordless (magic-code) authentication as the foundation for an attendee networking feature. The implementation must support a clean local development environment with no external runtime dependencies — Docker, cloud accounts, or hosted services.

Two realistic options were evaluated.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Supabase (cloud)** | No auth code to write; real-time DB built-in; 50k MAU free tier | Requires cloud account or Docker for local dev; adds external dependency to the dev loop; GoTrue auth service is a black box |
| **Custom OTP in Hono API** | Zero external deps locally; runs on existing Bun server; full control over schema and token lifecycle; trivially testable | Auth logic is ours to maintain; no built-in real-time (irrelevant until networking feature) |
| **BetterAuth / Lucia** | Pre-built auth library, less custom code | Additional abstraction layer; not Bun-native; limited SQLite support at evaluation time |

## Decision

**Custom OTP endpoints inside the existing Hono API (`apps/api`),** backed by Bun's built-in SQLite.

## Rationale

- **Zero local-dev dependencies.** `bun run dev` from `apps/api` is the entire setup. No Docker, no cloud credentials. OTPs are logged to stdout when `SMTP_HOST` is unset; set `OTP_EXPOSE_IN_RESPONSE=true` to skip email in tests entirely.
- **Bun SQLite is built-in.** No package install, no driver compatibility concerns, zero configuration. Adequate for conference scale (hundreds to low thousands of attendees).
- **The auth surface is small.** Two endpoints (`/otp/request`, `/otp/verify`) and one protected endpoint (`/me`). A third-party service would add more complexity than it saves at this scope.
- **Same server already running.** The conference data API (`apps/api`) is already started in every dev session. Colocating auth avoids a second process.
- **Self-hostable path is clean.** Switching to Postgres requires only a `DATABASE_PATH` env-var change and swapping the DB adapter — the auth logic is identical.

## Consequences

- **Good:** Local dev requires no external tools. Tests can be written without mocking a third-party SDK. The schema is fully visible and owned by the project.
- **Good:** Real-time features (needed for networking) can be added to the same Hono server when the time comes (WebSockets, SSE), rather than being locked into Supabase Realtime.
- **Bad:** We own the OTP lifecycle code. Rate limiting, token expiry, and hash comparison must be kept correct. (All three are implemented and covered in `routes/auth.ts`.)
- **Neutral:** Email delivery in production requires configuring SMTP credentials (`SMTP_HOST` etc.). Mailpit (`brew install mailpit`) covers local email preview with zero config.
- **Neutral:** Supabase remains a valid future option. Nothing in the current design prevents migrating auth to a hosted service later if operational complexity grows.
