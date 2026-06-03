---
id: ADR-011
title: Hono as the API Server Framework
status: proposed
date: 2026-06-03
deciders:
  - paul@huskycare.de
tags:
  - backend
  - api
  - framework
superseded_by: ~
related:
  - ADR-005-bun-runtime.md
  - ADR-012-scrape-to-postgres-data-strategy.md
---

# ADR-011: Hono as the API Server Framework

## Context

The conference data API (`apps/api`) requires a lightweight HTTP server that:
- Runs natively on Bun (already the monorepo runtime — ADR-005)
- Serves JSON REST endpoints for sessions and speakers
- Has first-class TypeScript support
- Is easy to test and maintain by a small team

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Hono (chosen)** | **Ultra-lightweight, Bun-native, TypeScript-first, fast cold starts, built-in routing/middleware** | **Smaller ecosystem than Express** |
| Express | Massive ecosystem, everyone knows it | Not optimised for Bun, heavier, CommonJS roots |
| Fastify | Fast, schema validation built-in | More setup, Bun support less mature |
| Plain Bun HTTP (`Bun.serve`) | Zero dependencies | Manual routing/middleware wiring is tedious |
| Elysia | Bun-native, fast | Less stable, smaller community |

## Decision

**Hono** — lightweight TypeScript HTTP framework that runs natively on Bun with minimal configuration.

## Rationale

- Bun-native: `bun run src/index.ts` just works; no adapter layer
- TypeScript-first: route handlers are fully typed end-to-end
- Tiny surface area: the whole framework is understandable, easy to audit
- Built-in middleware for CORS, logging, and caching headers covers all needs
- Compatible with the existing Bun test runner (ADR-008)

## Consequences

- **Good:** Fast startup, simple code, no build step needed in development
- **Good:** Easy to migrate endpoint by endpoint when switching data layers (scraping → PostgreSQL)
- **Neutral:** Hono has fewer third-party plugins than Express; any needed middleware must be written or sourced from Hono's own ecosystem
- **Bad:** Team members familiar with Express need a short ramp-up (API surface is similar but not identical)
