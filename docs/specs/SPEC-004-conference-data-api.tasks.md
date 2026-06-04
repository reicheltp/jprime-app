---
id: SPEC-004
title: Conference Data API Tasks
feature: conference-data-api
type: tasks
status: implemented
created: 2026-06-03
updated: 2026-06-04
---

# Tasks: Conference Data API

> Implement before SPEC-001 and SPEC-003. Shared types defined here are consumed by the mobile app.
> Reference design: SPEC-004-conference-data-api.design.md

---

- [x] 1. Scaffold `apps/api` workspace
  - [x] Create `apps/api/package.json` with name `@jprime/api-server`, scripts: `dev`, `start`, `test`
  - [x] Create `apps/api/tsconfig.json` extending root base config
  - [x] Add `apps/api` to root `package.json` workspaces array
  - [x] Install Hono: `bun add hono` in `apps/api`
  - _Requirements: SPEC-004 (infrastructure baseline)_

- [x] 2. Define shared types in `@jprime/types`
  - [x] Add `SessionType` union (`'talk' | 'workshop' | 'keynote' | 'break'`)
  - [x] Add `SpeakerRef` interface (`id`, `name`)
  - [x] Add `Session` interface (all fields per SPEC-004 design)
  - [x] Add `SessionRef` interface (`id`, `title`, `day`, `startTime`)
  - [x] Add `Speaker` interface (all fields per SPEC-004 design)
  - [x] Export all types from `packages/types/src/index.ts`
  - _Requirements: SPEC-004 #1, #3 (response shapes)_

- [x] 3. Implement `Cache`
  - [x] Create `apps/api/src/providers/cache.ts` with `CacheEntry<T>` and `Cache` class
  - [x] Implement `set`, `get` (returns null if expired), `isStale`, `getStale`
  - [x] Write unit tests for TTL expiry, hit, and miss behaviour
  - _Requirements: SPEC-004 #5, #6_

- [x] 4. Define `DataProvider` interface
  - [x] Create `apps/api/src/providers/DataProvider.ts`
  - [x] Define `getSessions()`, `getSession(id)`, `getSpeakers()`, `getSpeaker(id)` signatures
  - _Requirements: SPEC-004 (abstraction layer for ADR-012)_

- [x] 5. Investigate jprime.io website structure
  - [x] Discovered PWA API endpoints at `/pwa/findSessionsByHall?hallName={name}` returning JSON
  - [x] Identified API response structure: id, title, startTime, endTime, lectorName, coLectorName, talkDescription
  - [x] Documented findings in comment block at the top of `apps/api/src/scrapers/jprime.ts`
  - _Requirements: SPEC-004 #1, #3 (data must be accurate)_

- [x] 6. Implement jprime.io scraper
  - [x] Uses native Bun fetch (no node-html-parser needed as API returns JSON)
  - [x] Create `apps/api/src/scrapers/jprime.ts` with `scrapeJprime(baseUrl)` returning `ScrapeResult`
  - [x] Parse sessions: map each API response to a `Session` object with stable IDs derived from numeric id
  - [x] Parse speakers: map lectorName/coLectorName to `Speaker` objects with `SessionRef[]`
  - [x] Exclude `break`-type sessions from all speaker `sessions` arrays
  - [x] Save a snapshot of the API response to `apps/api/src/scrapers/__fixtures__/` for tests
  - [x] Write snapshot unit test: `scrapeJprime` against the fixture returns expected shaped data
  - _Requirements: SPEC-004 #1, #3, #8; AC for break exclusion_

- [x] 7. Implement `ScraperProvider`
  - [x] Create `apps/api/src/providers/ScraperProvider.ts` implementing `DataProvider`
  - [x] On cache miss/stale: call `scrapeJprime`, populate cache, return data
  - [x] On scrape failure with stale cache: log warning, serve stale data
  - [x] On scrape failure with no cache: throw a typed `DataUnavailableError`
  - _Requirements: SPEC-004 #5, #6_

- [x] 8. Create session routes
  - [x] Create `apps/api/src/routes/sessions.ts` with `registerSessionRoutes(app, provider)`
  - [x] `GET /api/v1/sessions` → `{ data: Session[], meta: { total } }`
  - [x] `GET /api/v1/sessions/:id` → `{ data: Session }` or 404
  - [x] Write integration tests using a `MockDataProvider` with fixture data
  - _Requirements: SPEC-004 #1, #2_

- [x] 9. Create speaker routes
  - [x] Create `apps/api/src/routes/speakers.ts` with `registerSpeakerRoutes(app, provider)`
  - [x] `GET /api/v1/speakers` → `{ data: Speaker[], meta: { total } }`
  - [x] `GET /api/v1/speakers/:id` → `{ data: Speaker }` or 404
  - [x] Write integration tests using `MockDataProvider`
  - _Requirements: SPEC-004 #3, #4_

- [x] 10. Create health route
  - [x] Create `apps/api/src/routes/health.ts`
  - [x] `GET /health` → `{ status: "ok", cachedAt: <ISO datetime or null> }`
  - _Requirements: SPEC-004 #7_

- [x] 11. Add CORS middleware
  - [x] Create `apps/api/src/middleware/cors.ts` using Hono's built-in `cors()`
  - [x] Allow all origins in development; restrict to app origins in production via env var
  - _Requirements: SPEC-004 #8_

- [x] 12. Wire up entry point
  - [x] Create `apps/api/src/index.ts`: instantiate Hono app, register all middleware and routes
  - [x] Uses `ScraperProvider` with live scraping from jprime.io
  - [x] Read port from `PORT` env var (default `3000`)
  - [x] Verified: server starts, all endpoints respond correctly (81 sessions, 26 speakers)
  - _Requirements: SPEC-004 (all)_

- [x] 13. Add error handling middleware
  - [x] Catch `DataUnavailableError` → 503
  - [x] Catch unhandled errors → 500
  - _Requirements: SPEC-004 #6_
