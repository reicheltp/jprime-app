---
id: SPEC-004
title: Conference Data API Tasks
feature: conference-data-api
type: tasks
status: draft
created: 2026-06-03
updated: 2026-06-03
---

# Tasks: Conference Data API

> Implement before SPEC-001 and SPEC-003. Shared types defined here are consumed by the mobile app.
> Reference design: SPEC-004-conference-data-api.design.md

---

- [ ] 1. Scaffold `apps/api` workspace
  - [ ] Create `apps/api/package.json` with name `@jprime/api-server`, scripts: `dev`, `start`, `test`
  - [ ] Create `apps/api/tsconfig.json` extending root base config
  - [ ] Add `apps/api` to root `package.json` workspaces array
  - [ ] Install Hono: `bun add hono` in `apps/api`
  - _Requirements: SPEC-004 (infrastructure baseline)_

- [ ] 2. Define shared types in `@jprime/types`
  - [ ] Add `SessionType` union (`'talk' | 'workshop' | 'keynote' | 'break'`)
  - [ ] Add `SpeakerRef` interface (`id`, `name`)
  - [ ] Add `Session` interface (all fields per SPEC-004 design)
  - [ ] Add `SessionRef` interface (`id`, `title`, `day`, `startTime`)
  - [ ] Add `Speaker` interface (all fields per SPEC-004 design)
  - [ ] Export all types from `packages/types/src/index.ts`
  - _Requirements: SPEC-004 #1, #3 (response shapes)_

- [ ] 3. Implement `Cache`
  - [ ] Create `apps/api/src/providers/cache.ts` with `CacheEntry<T>` and `Cache` class
  - [ ] Implement `set`, `get` (returns null if expired), `isStale`
  - [ ] Write unit tests for TTL expiry, hit, and miss behaviour
  - _Requirements: SPEC-004 #5, #6_

- [ ] 4. Define `DataProvider` interface
  - [ ] Create `apps/api/src/providers/DataProvider.ts`
  - [ ] Define `getSessions()`, `getSession(id)`, `getSpeakers()`, `getSpeaker(id)` signatures
  - _Requirements: SPEC-004 (abstraction layer for ADR-012)_

- [ ] 5. Investigate jprime.io website structure
  - [ ] Fetch and inspect the jprime.io schedule and speakers pages
  - [ ] Identify CSS selectors / HTML structure for sessions: title, type, track, room, day, times, description, speakers
  - [ ] Identify CSS selectors for speakers: name, photo URL, bio, linked sessions
  - [ ] Document findings in a comment block at the top of `apps/api/src/scrapers/jprime.ts`
  - _Requirements: SPEC-004 #1, #3 (data must be accurate)_

- [ ] 6. Implement jprime.io scraper
  - [ ] Install `node-html-parser`: `bun add node-html-parser` in `apps/api`
  - [ ] Create `apps/api/src/scrapers/jprime.ts` with `scrapeJprime(baseUrl)` returning `ScrapeResult`
  - [ ] Parse sessions: map each scraped row to a `Session` object; derive stable IDs (slug or source ID, not positional index)
  - [ ] Parse speakers: map each scraped entry to a `Speaker` object with `SessionRef[]`
  - [ ] Exclude `break`-type sessions from all speaker `sessions` arrays
  - [ ] Save a snapshot of the jprime.io HTML to `apps/api/src/scrapers/__fixtures__/` for tests
  - [ ] Write snapshot unit test: `scrapeJprime` against the fixture HTML returns expected shaped data
  - _Requirements: SPEC-004 #1, #3, #8 (CORS not yet); AC for break exclusion_

- [ ] 7. Implement `ScraperProvider`
  - [ ] Create `apps/api/src/providers/ScraperProvider.ts` implementing `DataProvider`
  - [ ] On cache miss/stale: call `scrapeJprime`, populate cache, return data
  - [ ] On scrape failure with stale cache: log warning, serve stale data with `Warning` header flag
  - [ ] On scrape failure with no cache: throw a typed `DataUnavailableError`
  - _Requirements: SPEC-004 #5, #6_

- [ ] 8. Create session routes
  - [ ] Create `apps/api/src/routes/sessions.ts` with `registerSessionRoutes(app, provider)`
  - [ ] `GET /api/v1/sessions` → `{ data: Session[], meta: { total } }`
  - [ ] `GET /api/v1/sessions/:id` → `{ data: Session }` or 404
  - [ ] Add `X-Cache: HIT | MISS` response header
  - [ ] Write integration tests using a `MockDataProvider` with fixture data
  - _Requirements: SPEC-004 #1, #2_

- [ ] 9. Create speaker routes
  - [ ] Create `apps/api/src/routes/speakers.ts` with `registerSpeakerRoutes(app, provider)`
  - [ ] `GET /api/v1/speakers` → `{ data: Speaker[], meta: { total } }`
  - [ ] `GET /api/v1/speakers/:id` → `{ data: Speaker }` or 404
  - [ ] Write integration tests using `MockDataProvider`
  - _Requirements: SPEC-004 #3, #4_

- [ ] 10. Create health route
  - [ ] Create `apps/api/src/routes/health.ts`
  - [ ] `GET /health` → `{ status: "ok", cachedAt: <ISO datetime or null> }`
  - _Requirements: SPEC-004 #7_

- [ ] 11. Add CORS middleware
  - [ ] Create `apps/api/src/middleware/cors.ts` using Hono's built-in `cors()`
  - [ ] Allow all origins in development; restrict to app origins in production via env var
  - _Requirements: SPEC-004 #8_

- [ ] 12. Wire up entry point
  - [ ] Create `apps/api/src/index.ts`: instantiate Hono app, register all middleware and routes, call `Bun.serve`
  - [ ] Pass `ScraperProvider` as the `DataProvider` implementation
  - [ ] Read port from `PORT` env var (default `3000`)
  - [ ] Verify `bun run dev` starts the server and all endpoints respond correctly
  - _Requirements: SPEC-004 (all)_

- [ ] 13. Add error handling middleware
  - [ ] Catch `DataUnavailableError` → 503 `{ error: "Data unavailable", code: "DATA_UNAVAILABLE" }`
  - [ ] Catch unhandled errors → 500 `{ error: "Internal error", code: "INTERNAL_ERROR" }`
  - _Requirements: SPEC-004 #6_
