---
title: Architecture Overview
description: Decision register and technology snapshot for JPrime Conference App. Full rationale lives in docs/decisions/.
type: architecture
last_updated: 2026-06-03
status: active
---

> **Note:** DESIGN.md integration implemented 2026-06-03. See ADR-010 for design system architecture.

# Architecture Overview

Summary of accepted architectural decisions. Each row links to its full ADR (context, options, rationale, consequences).

## Decision Register

| ID | Topic | Decision | Date |
|----|-------|----------|------|
| [ADR-001](decisions/ADR-001-bun-workspaces.md) | Monorepo tooling | Bun Workspaces | 2026-06-03 |
| [ADR-002](decisions/ADR-002-expo-framework.md) | Mobile framework | Expo SDK 50+ with EAS | 2026-06-03 |
| [ADR-003](decisions/ADR-003-expo-router-navigation.md) | Navigation | Expo Router v3+ (file-based) | 2026-06-03 |
| [ADR-004](decisions/ADR-004-react-query-state-management.md) | State management | React Query v5+ + AsyncStorage | 2026-06-03 |
| [ADR-005](decisions/ADR-005-bun-runtime.md) | Package manager / runtime | Bun 1.1+ | 2026-06-03 |
| [ADR-006](decisions/ADR-006-domain-driven-organization.md) | Code organization | Domain-driven (by feature) | 2026-06-03 |
| [ADR-007](decisions/ADR-007-web-first-platform-strategy.md) | Platform priority | Web-first, full native support | 2026-06-03 |
| [ADR-008](decisions/ADR-008-bun-test-testing-strategy.md) | Testing | Bun Test + @testing-library/react-native | 2026-06-03 |
| [ADR-009](decisions/ADR-009-nativewind-tailwind-styling.md) | Styling | Tailwind CSS v4 via NativeWind v5 + DESIGN.md | 2026-06-03 |
| [ADR-010](decisions/ADR-010-design-md-design-system.md) | Design System | DESIGN.md as single source of truth | 2026-06-03 |

## Technology Snapshot

| Category | Technology |
|----------|------------|
| Framework | Expo SDK 56 |
| Navigation | Expo Router v56 |
| State management | React Query v5+ |
| Language | TypeScript 6+ (strict) |
| Package manager | Bun 1.1+ |
| Testing | Bun Test + @testing-library/react-native |
| Styling | Tailwind CSS v4 via NativeWind v5 |
| CI/CD | GitHub Actions |

## Pending Decisions

| Topic | Status | Notes |
|-------|--------|-------|
| Authentication provider | Pending | Firebase Auth, Auth0, or custom? |
| Offline database | Pending | WatermelonDB, Realm, etc. |
| API design | Pending | REST vs GraphQL vs Serverless functions |
| Real-time updates | Pending | WebSockets, Firebase Realtime, or polling? |
| Analytics | Pending | Provider TBD |
| Error monitoring | Pending | Sentry, Bugsnag, or custom? |

> To propose a new decision, copy [decisions/ADR-000-template.md](decisions/ADR-000-template.md), give it the next sequence number, and open a PR.
