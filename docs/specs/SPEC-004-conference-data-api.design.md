---
id: SPEC-004
title: Conference Data API Design
feature: conference-data-api
type: design
status: approved
created: 2026-06-03
updated: 2026-06-03
---

# Design: Conference Data API

## Overview

A Bun/Hono HTTP server in `apps/api` that exposes a versioned REST API for conference session and speaker data. In Phase 1 a scraper populates an in-memory cache from jprime.io; the data layer is hidden behind a `DataProvider` interface so Phase 2 (PostgreSQL) is a drop-in replacement.

---

## Architecture

```
apps/api/
├── src/
│   ├── index.ts               # Hono app entry point, registers routes
│   ├── routes/
│   │   ├── sessions.ts        # GET /api/v1/sessions, /api/v1/sessions/:id
│   │   ├── speakers.ts        # GET /api/v1/speakers, /api/v1/speakers/:id
│   │   └── health.ts          # GET /health
│   ├── providers/
│   │   ├── DataProvider.ts    # Interface definition
│   │   ├── ScraperProvider.ts # Phase 1: scrapes jprime.io
│   │   └── cache.ts           # In-memory TTL cache
│   ├── scrapers/
│   │   └── jprime.ts          # DOM parsing logic for jprime.io
│   └── middleware/
│       └── cors.ts            # CORS configuration
├── package.json
└── tsconfig.json
```

The route handlers depend only on `DataProvider` — they never import from `scrapers/` directly. This is the seam for the Phase 2 swap.

---

## Components and Interfaces

### `DataProvider` interface

```typescript
// src/providers/DataProvider.ts
export interface DataProvider {
  getSessions(): Promise<Session[]>
  getSession(id: string): Promise<Session | null>
  getSpeakers(): Promise<Speaker[]>
  getSpeaker(id: string): Promise<Speaker | null>
}
```

### `ScraperProvider`

Implements `DataProvider`. On first call (or when TTL has expired) it fetches and parses jprime.io, stores results in the in-memory `cache`. Subsequent calls return cached data until TTL expires.

```typescript
export class ScraperProvider implements DataProvider {
  constructor(private cache: Cache, private ttlMs = 10 * 60 * 1000) {}
  async getSessions(): Promise<Session[]> { /* scrape or return cache */ }
  // ...
}
```

### Cache

```typescript
// src/providers/cache.ts
export interface CacheEntry<T> {
  data: T
  fetchedAt: Date
  expiresAt: Date
}

export class Cache {
  set<T>(key: string, data: T, ttlMs: number): void
  get<T>(key: string): CacheEntry<T> | null   // null if missing or expired
  isStale(key: string): boolean
}
```

### Route handler pattern

```typescript
// src/routes/sessions.ts
export function registerSessionRoutes(app: Hono, provider: DataProvider) {
  app.get('/api/v1/sessions', async (c) => {
    const sessions = await provider.getSessions()
    return c.json({ data: sessions, meta: { total: sessions.length } })
  })

  app.get('/api/v1/sessions/:id', async (c) => {
    const session = await provider.getSession(c.req.param('id'))
    if (!session) return c.json({ error: 'Not found' }, 404)
    return c.json({ data: session })
  })
}
```

---

## Data Models

All canonical types live in `@jprime/types` and are imported by both `apps/api` and `apps/conference`.

```typescript
// packages/types/src/index.ts

export type SessionType = 'talk' | 'workshop' | 'keynote' | 'break'

export interface SpeakerRef {
  id: string
  name: string
}

export interface Session {
  id: string
  title: string
  type: SessionType
  track: string | null        // null for keynotes and breaks
  room: string
  day: string                 // ISO 8601 date: "2026-05-29"
  startTime: string           // ISO 8601 datetime: "2026-05-29T10:00:00"
  endTime: string             // ISO 8601 datetime: "2026-05-29T10:45:00"
  description: string | null
  speakers: SpeakerRef[]
}

export interface SessionRef {
  id: string
  title: string
  day: string
  startTime: string
}

export interface Speaker {
  id: string
  firstName: string
  lastName: string
  fullName: string
  bio: string | null
  photoUrl: string | null
  sessions: SessionRef[]      // excludes break-type sessions
}
```

### Response envelope

All endpoints wrap their payload:

```typescript
// Success
{ "data": <T> | <T[]>, "meta"?: { "total": number, ... } }

// Error
{ "error": "<message>", "code": "<ERROR_CODE>" }
```

---

## Scraper Design

The scraper (`src/scrapers/jprime.ts`) is deliberately isolated. Its only job is: fetch the jprime.io website HTML → return `Session[]` and `Speaker[]`.

```typescript
export interface ScrapeResult {
  sessions: Session[]
  speakers: Speaker[]
  scrapedAt: Date
}

export async function scrapeJprime(baseUrl: string): Promise<ScrapeResult>
```

> **Note:** The specific CSS selectors and parsing logic depend on jprime.io's HTML structure and must be determined by inspecting the site during implementation. The interface above is fixed; the implementation is not.

The scraper uses Bun's built-in `fetch` + a lightweight HTML parser (e.g. `node-html-parser`). No headless browser needed — jprime.io is server-rendered.

---

## Error Handling

| Scenario | HTTP Status | Behaviour |
|----------|-------------|-----------|
| Cached data available | 200 | Serve cache, include `X-Cache: HIT` header |
| Cache stale, scrape succeeds | 200 | Refresh cache, serve new data, `X-Cache: MISS` |
| Cache stale, scrape fails | 200 | Serve stale cache with `Warning` header |
| No cache, scrape fails | 503 | `{ "error": "Data unavailable", "code": "DATA_UNAVAILABLE" }` |
| ID not found | 404 | `{ "error": "Not found", "code": "NOT_FOUND" }` |
| Unhandled exception | 500 | `{ "error": "Internal error", "code": "INTERNAL_ERROR" }` |

---

## Testing Strategy

- **Unit tests** for `Cache`, scraper output parsing, and conflict-free session ID generation
- **Integration tests** for route handlers using Hono's test utilities with a `MockDataProvider` that returns fixture data
- **Snapshot tests** for the scraper against a saved copy of jprime.io HTML (prevents regressions when scraper logic changes)
- No live network calls in CI — the scraper is mocked

---

## Decision Log

| Decision | Rationale |
|----------|-----------|
| Hono over Express | Bun-native, TypeScript-first, zero config — see ADR-011 |
| `DataProvider` abstraction | Isolates Phase 1 scraper from route handlers; enables Phase 2 swap with no API changes — see ADR-012 |
| Types in `@jprime/types` | Shared between API server and mobile app; single source of truth for data shapes |
| ISO 8601 datetimes as strings | Avoids timezone serialisation issues across clients; parseable by `Date` on both sides |
| Response envelope `{ data, meta }` | Consistent structure; room for pagination metadata without breaking changes |
