---
id: ADR-003
title: Use Expo Router for Navigation
status: accepted
date: 2026-06-03
deciders:
  - Paul
tags:
  - navigation
  - routing
  - expo
related:
  - ADR-002-expo-framework.md
---

# ADR-003: Use Expo Router for Navigation

## Context

We need a navigation solution that works across web, iOS, and Android, supports deep linking, handles authentication flows, and provides good UX with native navigation gestures and animations.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Expo Router** | **File-based routing, native under the hood, deep linking, TS-first** | **Newer than React Navigation, fewer community edge-case examples** |
| React Navigation | Most popular, flexible, large community | Manual route config, boilerplate-heavy |
| React Native Navigation | Community favourite for native feel | Complex setup, not web-compatible |

## Decision

**Expo Router v3+** — file-based routing built on top of React Navigation.

## Rationale

- File-based routing is familiar from Next.js and reduces manual boilerplate
- Deep linking is automatic from the file structure
- Built on top of React Navigation, so it benefits from its ecosystem
- First-class TypeScript support with typed routes
- Web support is a primary goal — Expo Router handles web and native from the same files
- Route groups `(group)` allow layout sharing without affecting URL paths

## Consequences

- **Good:** Less routing boilerplate; automatic deep linking; works on web and native
- **Bad:** Less community guidance compared to React Navigation for edge cases
- **Neutral:** All screen files live under `apps/conference/app/` — this is the routing contract
