---
id: ADR-005
title: Use Bun as Package Manager and Runtime
status: accepted
date: 2026-06-03
deciders:
  - Paul
tags:
  - tooling
  - package-manager
  - runtime
  - testing
related:
  - ADR-001-bun-workspaces.md
  - ADR-008-bun-test-testing-strategy.md
---

# ADR-005: Use Bun as Package Manager and Runtime

## Context

We need a package manager and JavaScript runtime for the monorepo. The choice affects install speed, test runner, workspace support, TypeScript support, and daily developer experience.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| npm | Universal, stable, well-documented | Slow installs, no built-in test runner |
| Yarn | Faster than npm, workspaces | Slower than Bun, extra config |
| pnpm | Disk-efficient, fast | Different workflow, extra tool |
| **Bun** | **Extremely fast, native TS execution, built-in test runner, native workspaces** | **Newer ecosystem, occasional Expo compatibility edge cases** |

## Decision

**Bun 1.1+** as the package manager, runtime, and test runner.

## Rationale

- Consistently fastest install times in benchmarks
- Native TypeScript execution — no separate compile step for scripts
- Built-in test runner (`bun:test`) eliminates Jest/Vitest as a dependency
- Native workspace support removes the need for Turborepo or Lerna
- Drop-in replacement for npm scripts

## Consequences

- **Good:** Single tool for installs, scripts, tests, and workspaces
- **Bad:** Occasional edge cases with npm-specific features or Expo compatibility
- **Neutral:** All contributors must use `bun` commands instead of `npm`/`yarn`
