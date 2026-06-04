---
title: Specs Index
description: Spec-driven development docs for JPrime Conference App. Flat structure — all three phases of a feature share one SPEC-NNN prefix.
type: index
last_updated: 2026-06-03
---

# Specs

All feature specifications live here in a flat structure. Three files cover the three phases of a feature, identified by the same `SPEC-NNN-slug` prefix.

## File Naming

```
SPEC-NNN-slug.md           ← Phase 1: Requirements (what)
SPEC-NNN-slug.design.md    ← Phase 2: Design       (how)
SPEC-NNN-slug.tasks.md     ← Phase 3: Tasks        (checklist)
```

## Frontmatter Schema

All spec files share this shape — only `type` and `title` differ:

```yaml
---
id: SPEC-NNN
title: <Feature Name> <Requirements | Design | Tasks>
feature: <feature-slug>
type: requirements | design | tasks
status: draft         # draft | in-review | approved | implemented
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

## Phase Gating

```
Requirements → approved → Design begins
Design       → approved → Tasks begin
Tasks        → completed → Feature implemented
```

Never start a phase until the previous phase is `approved`.

## Status Lifecycle

| Status | Meaning |
|--------|---------|
| `draft` | Work in progress — unstable, do not implement against |
| `in-review` | Awaiting human sign-off — may change |
| `approved` | Stable — safe to implement |
| `implemented` | Shipped — historical record |

## Files

| ID | Feature | Requirements | Design | Tasks |
|----|---------|-------------|--------|-------|
| SPEC-001 | Session Browsing | [req](SPEC-001-session-browsing.md) | [design](SPEC-001-session-browsing.design.md) | [tasks](SPEC-001-session-browsing.tasks.md) |
| SPEC-002 | My Schedule | [req](SPEC-002-my-schedule.md) | [design](SPEC-002-my-schedule.design.md) | [tasks](SPEC-002-my-schedule.tasks.md) |
| SPEC-003 | Speaker Directory | [req](SPEC-003-speaker-directory.md) | [design](SPEC-003-speaker-directory.design.md) | [tasks](SPEC-003-speaker-directory.tasks.md) |
| SPEC-004 | Conference Data API | [req](SPEC-004-conference-data-api.md) | [design](SPEC-004-conference-data-api.design.md) | [tasks](SPEC-004-conference-data-api.tasks.md) |
| SPEC-005 | Venue Information | [req](SPEC-005-venue-information.md) | [design](SPEC-005-venue-information.design.md) | [tasks](SPEC-005-venue-information.tasks.md) |
| SPEC-006 | Auth — Magic Links | [req](SPEC-006-auth-magic-links.md) | [design](SPEC-006-auth-magic-links.design.md) | [tasks](SPEC-006-auth-magic-links.tasks.md) |
| SPEC-007 | User Profile | [req](SPEC-007-user-profile.md) | [design](SPEC-007-user-profile.design.md) | [tasks](SPEC-007-user-profile.tasks.md) |
| SPEC-008 | Attendee Connections | [req](SPEC-008-attendee-connections.md) | [design](SPEC-008-attendee-connections.design.md) | [tasks](SPEC-008-attendee-connections.tasks.md) |
| SPEC-009 | Connect Codes | [req](SPEC-009-connect-codes.md) | [design](SPEC-009-connect-codes.design.md) | [tasks](SPEC-009-connect-codes.tasks.md) |

Use [SPEC-000-template.md](SPEC-000-template.md) to start a new spec.
See [../features.md](../features.md) for the full feature status matrix.
