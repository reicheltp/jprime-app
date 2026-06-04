---
title: Feature Status Matrix
description: Current status of all planned features across requirements, design, and tasks phases. Update this file when a spec phase changes status.
type: feature-matrix
last_updated: 2026-06-04
status: active
---

# Feature Status Matrix

One row per planned feature. Update the status columns as spec phases are approved and features are shipped.

## Status Key

| Symbol | Meaning |
|--------|---------|
| — | Not started |
| `draft` | In progress, not ready |
| `in-review` | Awaiting human sign-off |
| `approved` | Finalized and stable |
| `implemented` | Shipped |

## Features

| ID | Feature | Domain | Requirements | Design | Tasks | Notes |
|----|---------|--------|-------------|--------|-------|-------|
| SPEC-001 | Session Browsing | schedule | `approved` | `approved` | `implemented` | Added bookmarks filter to schedule page |
| SPEC-002 | My Schedule | schedule | `approved` | `approved` | `implemented` | Device-local bookmarks; auth sync deferred |
| SPEC-003 | Speaker Directory | speakers | `approved` | `approved` | `implemented` | |
| SPEC-004 | Conference Data API | api | `approved` | `approved` | `implemented` | ScraperProvider active with live jprime.io data |
| SPEC-005 | Venue Information | venue | `approved` | `approved` | `implemented` | Static venue, travel, and accommodation details |
| SPEC-006 | Auth — Magic Link / OTP | auth | `approved` | `approved` | `implemented` | Supabase OTP; self-hostable (env-var swap only) |
| SPEC-007 | User Profile Management | auth | `approved` | `approved` | `implemented` | Profile tab; initials avatar; social links; GET + PUT /api/v1/profile |
| SPEC-008 | Attendee Connections | connections | `approved` | `approved` | `implemented` | QR code scanning, bidirectional connection lists, local storage |
| SPEC-009 | Connect Codes | connections | `draft` | `draft` | `draft` | 5-character code alternative to QR, server-generated unique codes, manual entry |

---

> **For agents:** Check the `requirements` column before starting implementation work. Only begin coding when requirements are `approved`. Check `tasks` for your specific checklist.
>
> **For humans:** Add a row here when creating a new `SPEC-NNN-*.md` file. Keep status columns in sync with the frontmatter `status:` field in each spec file.
