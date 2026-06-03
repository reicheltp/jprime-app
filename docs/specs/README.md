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
| _(none yet)_ | — | — | — | — |

Use [SPEC-000-template.md](SPEC-000-template.md) to start a new spec.
See [../features.md](../features.md) for the full feature status matrix.
