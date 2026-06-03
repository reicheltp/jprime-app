---
id: ADR-006
title: Organize Code by Domain (Feature-Driven)
status: accepted
date: 2026-06-03
deciders:
  - Paul
tags:
  - architecture
  - code-organization
  - domain-driven
related: []
---

# ADR-006: Organize Code by Domain (Feature-Driven)

## Context

We need a code organization strategy that makes features easy to find and maintain, reduces coupling between features, and scales as the codebase grows.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| By technical layer (`components/`, `hooks/`, `utils/`) | Familiar to many developers | Features are spread across many folders |
| **By domain/feature** (`(schedule)/`, `(auth)/`, `(speakers)/`) | **Feature code co-located; clear boundaries** | **Some pattern repetition across domains** |
| Hybrid | Best of both | Inconsistent, confusing boundaries |

## Decision

**Domain-driven organization** — group all code for a feature/domain together, not by technical role.

## Rationale

- Conference apps have natural, stable domains: schedule, speakers, venue, auth, social
- All hooks, components, and types for a domain live together — easier to understand and own
- Adding a new feature doesn't require touching existing domains
- Aligns with React's component composition model and Expo Router's file-based routing

## Domain Structure

```
apps/conference/app/
├── (auth)/        # Login, registration, session management
├── (schedule)/    # Session list, session detail, filters
├── (speakers)/    # Speaker list, speaker bio
├── (venue)/       # Maps, room info
└── (social)/      # Future: networking, chat
```

## Consequences

- **Good:** Features are self-contained; easy onboarding; clear ownership
- **Bad:** Shared patterns may be duplicated across domains before extraction to `packages/`
- **Neutral:** Shared code goes in `packages/` — the boundary between domain-specific and shared must be actively maintained
