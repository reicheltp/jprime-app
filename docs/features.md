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
| SPEC-001 | Session Browsing | schedule | `approved` | `approved` | `implemented` | |
| SPEC-002 | My Schedule | schedule | `approved` | `approved` | `implemented` | Device-local bookmarks; auth sync deferred |
| SPEC-003 | Speaker Directory | speakers | `approved` | `approved` | `implemented` | |
| SPEC-004 | Conference Data API | api | `approved` | `approved` | `implemented` | ScraperProvider active with live jprime.io data |
| SPEC-005 | Auth — Magic Link / OTP | auth | `approved` | `approved` | `implemented` | Hono API + Bun SQLite + nodemailer; no external services needed locally (see ADR-015) |

---

> **For agents:** Check the `requirements` column before starting implementation work. Only begin coding when requirements are `approved`. Check `tasks` for your specific checklist.
>
> **For humans:** Add a row here when creating a new `SPEC-NNN-*.md` file. Keep status columns in sync with the frontmatter `status:` field in each spec file.
