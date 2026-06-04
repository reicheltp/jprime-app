---
title: Architecture Overview
description: Decision register and technology snapshot for JPrime Conference App. Full rationale lives in docs/decisions/.
type: architecture
last_updated: 2026-06-04
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
| [ADR-011](decisions/ADR-011-hono-api-server.md) | API server framework | Hono on Bun | 2026-06-03 |
| [ADR-012](decisions/ADR-012-scrape-to-postgres-data-strategy.md) | Conference data sourcing | Web scraping → PostgreSQL (phase 2) | 2026-06-03 |
| [ADR-013](decisions/ADR-013-testing-strategy.md) | Testing strategy | Bun Test, co-located files, `app.request()` for routes | 2026-06-03 |
| [ADR-014](decisions/ADR-014-storybook-component-development.md) | Component development | Storybook for `@jprime/ui` isolation | 2026-06-04 |
| [ADR-015](decisions/ADR-015-self-hosted-otp-auth.md) | Authentication | Self-hosted OTP (Bun SQLite + nodemailer), no third-party auth service | 2026-06-04 |

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
| Offline database | Pending | WatermelonDB, Realm, or SQLite for device-local bookmarks sync |
| Real-time updates | Pending | WebSockets, Firebase Realtime, or polling? |
| Analytics | Pending | Provider TBD |
| Error monitoring | Pending | Sentry, Bugsnag, or custom? |

> To propose a new decision, copy [decisions/ADR-000-template.md](decisions/ADR-000-template.md), give it the next sequence number, and open a PR.
