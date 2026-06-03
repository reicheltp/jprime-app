---
id: SPEC-004
title: Conference Data API Requirements
feature: conference-data-api
type: requirements
status: approved
created: 2026-06-03
updated: 2026-06-03
---

# Feature: Conference Data API

**User Story:** As the mobile app, I need a REST API that provides sessions and speaker data so that attendees can browse the conference programme.

> This is an internal/infrastructure feature. The consumers are SPEC-001 (Session Browsing) and SPEC-003 (Speaker Directory).

## Acceptance Criteria

1. **WHEN** a client sends `GET /api/v1/sessions` **THEN** the system **SHALL** return a list of all sessions including their id, title, type, track, room, day, start time, end time, description, and speaker references.
2. **WHEN** a client sends `GET /api/v1/sessions/:id` **THEN** the system **SHALL** return the full session object for that id, or a 404 if not found.
3. **WHEN** a client sends `GET /api/v1/speakers` **THEN** the system **SHALL** return a list of all speakers including their id, full name, photo URL, and session references.
4. **WHEN** a client sends `GET /api/v1/speakers/:id` **THEN** the system **SHALL** return the full speaker object including biography, or a 404 if not found.
5. **WHEN** the underlying data source is unavailable **AND** cached data exists **THEN** the system **SHALL** serve the cached data and respond with a `200` status.
6. **WHEN** the underlying data source is unavailable **AND** no cached data exists **THEN** the system **SHALL** respond with a `503` status and a structured error body.
7. **WHERE** the API is running **THEN** the system **SHALL** respond to `GET /health` with a 200 status and current cache freshness information.
8. **WHEN** a client sends any request **THEN** the system **SHALL** include CORS headers permitting requests from the mobile app origins.

## Edge Cases

- **Scraper finds no data**: Return 503 with an error body; never return an empty list that looks like success.
- **Partial scrape**: If speaker data is available but session data is not, serve what is available per resource endpoint; do not bundle them.
- **ID format**: Session and speaker IDs must be stable across re-scrapes (not positional indices). Derived from the source data's own identifiers where possible.

## Constraints

- Runs as a Bun workspace: `apps/api` (ADR-011)
- Initial data source: scraping jprime.io (ADR-012)
- In-memory cache with configurable TTL (default 10 minutes)
- Response time ≤ 200ms for cached responses
- All responses use `Content-Type: application/json`
- No authentication required on read endpoints (public data)

## Out of Scope

- Write endpoints (POST/PUT/DELETE) — no admin CMS in this phase
- Attendee data or authentication
- Push notifications
- PostgreSQL integration (Phase 2 — see ADR-012)
- Rate limiting (deferred)
