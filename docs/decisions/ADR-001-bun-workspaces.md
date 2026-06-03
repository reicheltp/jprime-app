---
id: ADR-001
title: Use Bun Workspaces for Monorepo
status: accepted
date: 2026-06-03
deciders:
  - Paul
tags:
  - monorepo
  - tooling
  - bun
related:
  - ADR-005-bun-runtime.md
---

# ADR-001: Use Bun Workspaces for Monorepo

## Context

The app needs to share code between the main conference app and potentially future apps (web portal, admin dashboard). We need a monorepo structure that enables code sharing, enforces clear module boundaries, and doesn't require additional tooling beyond what's already in the stack.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Single Package | Simple, no workspace management | Doesn't scale, all dependencies coupled |
| Lerna + Yarn/NPM Workspaces | Well-established, large community | Extra tooling, slower than Bun |
| Turborepo | Fast, incremental caching | Additional tooling, learning curve |
| **Bun Workspaces** | **Native to Bun, zero extra tooling, fast** | **Newer, fewer Expo community examples** |
| pnpm Workspaces | Disk-efficient, fast | Adds pnpm on top of Bun |

## Decision

**Bun Workspaces** — native monorepo support built into the already-chosen Bun runtime.

## Rationale

- Bun is already chosen as the runtime and package manager (see [ADR-005](ADR-005-bun-runtime.md))
- Zero additional tooling: workspaces are configured via the root `package.json`
- Same performance advantages as Bun itself (fast installs, builds)
- TypeScript path aliases work naturally across workspace packages

## Consequences

- **Good:** One toolchain for everything; fast installs; simple config
- **Bad:** Fewer community examples for the Expo + Bun monorepo combination
- **Neutral:** Team must follow Bun workspace conventions for cross-package imports
