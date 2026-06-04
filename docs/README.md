---
title: Documentation Index
description: Master index for JPrime Conference App docs. Start here to navigate architecture, decisions, and feature specs.
type: index
last_updated: 2026-06-03
status: active
---

# Documentation

## Quick Reference

| What you need | Where to look |
|---------------|---------------|
| Technology choices (summary) | [architecture.md](architecture.md) |
| Why a technology was chosen (full rationale) | [decisions/ADR-NNN-*.md](decisions/) |
| **Exact StyleSheet values for UI components** | [**COMPONENTS.md**](COMPONENTS.md) |
| High-level design tokens (colors, typography) | [../DESIGN.md](../DESIGN.md) |
| Domain terminology | [glossary.md](glossary.md) |
| Feature progress overview | [features.md](features.md) |
| What a feature must do | `specs/SPEC-NNN-slug.md` |
| How a feature is built | `specs/SPEC-NNN-slug.design.md` |
| Step-by-step implementation checklist | `specs/SPEC-NNN-slug.tasks.md` |
| Project setup and dev workflow | [../AGENTS.md](../AGENTS.md) |

## Spec-Driven Workflow

New features always follow three phases in order:

```
SPEC-NNN-slug.md  →  SPEC-NNN-slug.design.md  →  SPEC-NNN-slug.tasks.md
    (what)                   (how)                     (checklist)
```

A phase must reach `status: approved` before the next phase begins.
See [specs/README.md](specs/README.md) for the frontmatter schema and templates.

## For AI Agents

1. **Technology choices** — read [architecture.md](architecture.md) first; follow ADR links for full rationale.
2. **Terminology** — check [glossary.md](glossary.md) before naming types, variables, or routes.
3. **Before implementing** — find the feature's `SPEC-NNN-slug.md` for acceptance criteria and `SPEC-NNN-slug.design.md` for the agreed approach.
4. **Building any UI** — read [COMPONENTS.md](COMPONENTS.md) for the exact StyleSheet values to use. Never use `className` on React Native components — it silently fails on device.
4. **Parsing docs programmatically** — every doc has YAML frontmatter. Use the `status` field to filter:
   - `draft` — may change; do not implement against it
   - `in-review` — expect changes
   - `approved` — stable; safe to implement
   - `implemented` — historical record
5. **New decisions** — copy [decisions/ADR-000-template.md](decisions/ADR-000-template.md), assign the next sequence number, set `status: proposed`, and open a PR for human review before implementing.
6. **New specs** — copy [specs/SPEC-000-template.md](specs/SPEC-000-template.md) for requirements; add `SPEC-NNN` row to [features.md](features.md).

## Decisions

| ID | Decision | Tags |
|----|----------|------|
| [ADR-001](decisions/ADR-001-bun-workspaces.md) | Bun Workspaces for monorepo | monorepo, tooling |
| [ADR-002](decisions/ADR-002-expo-framework.md) | Expo SDK as mobile framework | framework, mobile |
| [ADR-003](decisions/ADR-003-expo-router-navigation.md) | Expo Router for navigation | navigation, routing |
| [ADR-004](decisions/ADR-004-react-query-state-management.md) | React Query for state management | state, caching |
| [ADR-005](decisions/ADR-005-bun-runtime.md) | Bun as package manager and runtime | tooling, runtime |
| [ADR-006](decisions/ADR-006-domain-driven-organization.md) | Domain-driven code organization | architecture |
| [ADR-007](decisions/ADR-007-web-first-platform-strategy.md) | Web-first platform strategy | platform, strategy |
| [ADR-008](decisions/ADR-008-bun-test-testing-strategy.md) | Bun Test + @testing-library/react-native | testing |
| [ADR-009](decisions/ADR-009-nativewind-tailwind-styling.md) | Tailwind CSS via NativeWind | styling, design-system |
