---
id: ADR-012
title: Two-Phase Data Strategy — Web Scraping then PostgreSQL
status: proposed
date: 2026-06-03
deciders:
  - paul@huskycare.de
tags:
  - backend
  - data
  - database
superseded_by: ~
related:
  - ADR-011-hono-api-server.md
---

# ADR-012: Two-Phase Data Strategy — Web Scraping then PostgreSQL

## Context

The conference data (sessions, speakers, schedule) needs to live somewhere. We have two competing goals:

1. **Speed to first working API:** Conference data is already published on the jprime.io website. Scraping it lets us ship a working API without building a data-entry UI or running a database immediately.
2. **Long-term maintainability:** A flat scraper becomes brittle as the site changes and cannot support future features (attendee accounts, admin CMS, personalisation). A PostgreSQL database provides the right foundation.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Scraping → PostgreSQL (chosen)** | **Ship fast; clean migration path; interface abstraction hides the swap** | **Scraper is brittle; two phases to manage** |
| PostgreSQL from day one | Stable, no scraper | Requires CMS/import tooling before first working API |
| Third-party platform (Sessionize, etc.) | No backend needed | Vendor lock-in, API rate limits, cost |
| Static JSON files forever | Zero infrastructure | No write path, no future features |

## Decision

**Phase 1 — Scraping:** A dedicated scraper module reads session and speaker data from jprime.io and populates an in-memory cache with a configurable TTL. The API server serves cached data. The scraper is isolated behind a `DataProvider` interface.

**Phase 2 — PostgreSQL:** The `DataProvider` interface is re-implemented against a PostgreSQL database. The API endpoints and consumer types remain unchanged. Scraper is retired.

## Rationale

- The `DataProvider` abstraction means Phase 2 is a drop-in replacement — no API contract changes, no frontend changes
- Scraping unblocks development now without any infrastructure setup
- TTL cache means a site outage doesn't take the app API down during a conference
- PostgreSQL is the natural next step: supports admin UI, attendee data, personalisation features

## Consequences

- **Good:** Working API in hours, not weeks
- **Good:** Clean swap path; Phase 2 migration is low-risk
- **Neutral:** Two implementations of `DataProvider` to maintain temporarily
- **Bad:** Scraper will break if jprime.io changes its HTML structure; monitoring/alerting needed
- **Bad:** In-memory cache doesn't survive server restarts in Phase 1; acceptable for a conference-day use case
