---
id: ADR-008
title: Use Bun Test with @testing-library/react-native
status: accepted
date: 2026-06-03
deciders:
  - Paul
tags:
  - testing
  - bun
  - react-native
related:
  - ADR-005-bun-runtime.md
---

# ADR-008: Use Bun Test with @testing-library/react-native

## Context

We need a testing strategy that ensures code quality, prevents regressions, runs fast, and works across all packages in the monorepo without introducing a separate test toolchain.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Jest + React Native Testing Library | Industry standard, large ecosystem | Slow, extra config needed for Bun monorepo |
| Vitest | Fast, modern API | Not the most natural fit for React Native |
| **Bun Test + @testing-library/react-native** | **Fast, built into Bun, Jest-compatible API** | **Newer, some ecosystem gaps** |
| Detox (E2E only) | Real device testing | Slow, complex setup — not suitable for unit tests |

## Decision

**Bun Test** (`bun:test`) for all unit and integration tests, **@testing-library/react-native** for component tests, **Detox** for E2E (future ADR).

## Rationale

- Bun is already in the stack — no additional test tooling required
- `bun:test` has a Jest-compatible API, reducing the learning curve
- Fast execution keeps the developer feedback loop tight
- `@testing-library/react-native` is the community standard for React Native component tests

## Test Pyramid Target

| Level | Coverage | Runner |
|-------|----------|--------|
| Unit | ~65% | Bun Test |
| Integration | ~25% | Bun Test |
| E2E | ~10% | Detox (future) |

## Test Location Convention

Co-located tests are preferred:
```
Button.tsx
Button.test.ts
```

## Consequences

- **Good:** Fast test runs; no separate test runner to install; Jest-compatible API
- **Bad:** Some Jest plugins/matchers may not have Bun equivalents
- **Neutral:** E2E testing approach is deferred to a future ADR
