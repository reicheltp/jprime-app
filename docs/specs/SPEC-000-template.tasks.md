---
id: SPEC-000
title: <Feature Name> Tasks
feature: <feature-slug>
type: tasks
status: draft
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Tasks: <Feature Name>

> Prerequisite: `SPEC-000-<feature-slug>.design.md` must be `status: approved`.

## Checklist

- [ ] **1. Add types to `@jprime/types`**
  - [ ] Define `<Entity>` interface
  - [ ] Define `<Entity>Status` enum (if applicable)
  - _Requirements: SPEC-000 #1_

- [ ] **2. Add API client (`@jprime/api`)**
  - [ ] `GET /<resource>` endpoint
  - [ ] `POST /<resource>` endpoint (if applicable)
  - _Requirements: SPEC-000 #2_

- [ ] **3. Add React Query hooks (`@jprime/api`)**
  - [ ] `use<Entity>()` query
  - [ ] `use<Action><Entity>()` mutation (if applicable)
  - _Requirements: SPEC-000 #2, #3_

- [ ] **4. Build UI components (`@jprime/ui` or app)**
  - [ ] `<Entity>List` component
  - [ ] `<Entity>Card` component
  - _Requirements: SPEC-000 #1_

- [ ] **5. Add screen(s) to `apps/conference/app/`**
  - [ ] Create route file(s)
  - [ ] Wire up query hooks
  - [ ] Handle loading, error, and empty states
  - _Requirements: SPEC-000 #1, #2_

- [ ] **6. Write tests**
  - [ ] Unit tests for hooks
  - [ ] Component tests for key UI
  - [ ] Verify all acceptance criteria from requirements spec

## Verification

Before setting `status: implemented`:
- [ ] All acceptance criteria from `SPEC-000-<feature-slug>.md` pass
- [ ] Feature works on web (primary platform per ADR-007)
- [ ] Feature works on iOS and Android
- [ ] No TypeScript errors (`bun run typecheck`)
- [ ] All tests pass (`bun run test`)
- [ ] Update row in [docs/features.md](../features.md)
