---
id: ADR-013
title: Testing Strategy for JPrime Conference App
type: adr
status: accepted
date: 2026-06-03
deciders:
  - paul@huskycare.de
  - AI Agents (with Human Oversight)
tags:
  - testing
  - quality
  - convention
superseded_by: ~
related:
  - AGENTS.md (section 6.2)
  - ADR-008-bun-test-runner.md
--- 

# ADR-013: Testing Strategy

## Context

We need a consistent, maintainable testing approach that:
- Ensures all acceptance criteria (AC) from specs are tested
- Makes it easy to find and understand test coverage
- Follows Bun's best practices
- Works well in a monorepo with shared packages

## Decision

### 1. Test File Location: Co-located

**Decision:** Place test files next to the files they test.

**Rationale:**
- Easier to find tests for a given module
- Clear ownership: tests live with the code
- Bun's test runner supports this natively
- Better for refactoring (move file + test together)

**Structure:**
```
packages/api/
  src/
    clients/
      apiClient.ts
      apiClient.test.ts      # Co-located
    queries/
      sessions.ts
      sessions.test.ts      # Co-located
```

**Exception:** Complex modules with many interdependent test files may use `__tests__/` directory, but this requires explicit approval and documentation.

---

### 2. Test-Requirement Linking: Via Test Descriptions

**Decision:** Reference SPEC and AC numbers in test descriptions, not file names.

**Rationale:**
- File names become long and unwieldy
- Descriptions are more readable
- Easy to search for `SPEC-NNN` in codebase
- Works with Bun's test runner output

**Pattern:**
```typescript
describe('Session Routes', () => {
  // SPEC-004 AC#1: GET /api/v1/sessions returns all fields
  it('SPEC-004 AC#1: returns sessions with all required fields', async () => {
    const res = await app.request('/api/v1/sessions')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data[0]).toHaveProperty('id')
    expect(json.data[0]).toHaveProperty('title')
    // ... all fields from SPEC-004 AC#1
  })
})
```

---

### 3. Coverage Requirement: All AC Must Have Tests

**Decision:** Every acceptance criterion in every SPEC must have at least one test.

**Rationale:**
- AC are the contract; tests verify the contract
- Prevents gaps in critical functionality
- Makes spec-review more valuable

**Implementation:**
- Each SPEC-NNN.tasks.md must include test tasks
- Each SPEC-NNN.design.md should list testable scenarios
- Test descriptions must reference the AC they cover

**Example tasks.md:**
```markdown
- [x] Write test for SPEC-004 AC#5: stale cache fallback
  - [x] Test returns cached data when scrape fails
  - [x] Test throws DataUnavailableError when no cache exists
```

---

### 4. Coverage Reporting: Report Only (Enforce Later)

**Decision:** Run coverage reporting in CI, but don't block on thresholds yet.

**Rationale:**
- Visibility without friction during early development
- Can add enforcement when codebase stabilizes
- Bun has built-in coverage support

**Implementation:**
```bash
# In CI:
bun test
bun test --coverage # Generates coverage report
```

**Future:** Add `coverageThreshold` to config when ready.

---

### 5. Test Organization Standards

#### File Structure
```
packages/*/
  src/
    module.ts
    module.test.ts      # Unit tests for module
```

#### Test File Content
```typescript
/**
 * Module: API Client
 * Tests: SPEC-004 AC#1, AC#2
 */

import { describe, it, expect } from 'bun:test'
import { apiFetch, ApiError } from './apiClient'

describe('apiFetch', () => {
  // SPEC-004 AC#1: returns data from API
  it('SPEC-004 AC#1: extracts data from response envelope', async () => {
    // Test implementation
  })

  // SPEC-004 AC#1 edge case: handles meta field
  it('SPEC-004 AC#1: handles optional meta field in response', async () => {
    // Test implementation
  })
})
```

#### Naming Conventions
- Use `describe()` for module/function groups
- Use `it()` / `test()` for individual test cases
- Prefix test names with `SPEC-NNN AC#X:` for traceability
- Use "should" or imperative mood: `"returns 404 for missing session"`

---

### 6. Test Types

| Type | Location | Example | When to Use |
|------|----------|---------|-------------|
| Unit | `module.test.ts` | Test `apiFetch()` parsing | Single function, pure logic |
| Integration | `index.test.ts` or co-located | Test routes + provider | Multiple components together |
| Snapshot | `module.test.ts` | API response shapes | Verify data structures |
| Fixtures | `__fixtures__/` | Mock API responses | Test data for offline testing |

---

### 7. Test Quality Checklist

- [ ] Every AC in SPEC has at least one test
- [ ] Test description references SPEC-NNN AC#X
- [ ] Test file is co-located with implementation
- [ ] Edge cases from SPEC are tested
- [ ] Test uses appropriate matchers (`toBe`, `toEqual`, `toContain`, etc.)
- [ ] Async operations are properly awaited
- [ ] Mocks are used for external dependencies

---

### 8. Fixtures Convention

Test fixtures (mock data) should be placed in a `__fixtures__/` directory adjacent to the test file or module:

```
apps/api/src/scrapers/
  jprime.ts
  jprime.test.ts
  __fixtures__/
    jprime-sessions.json
```

---

## Consequences

**Good:**
- Clear traceability from specs to tests to implementation
- Consistent structure across the codebase
- Easy to verify completeness of test coverage
- Works well with Bun's test runner

**Bad:**
- Test descriptions are slightly longer
- Need discipline to maintain SPEC references
- Co-located files may clutter large directories

**Neutral:**
- Different from Jest's typical `__tests__/` convention, but aligned with Bun's docs and project's preference

---

## Migration Plan

1. Move existing `__tests__/` directory tests to co-located `.test.ts` files
2. Add SPEC/AC references to all test descriptions
3. Verify all AC in SPEC-001 through SPEC-004 have test coverage
4. Document gaps in tasks files
5. Add test tasks to future specs before implementation

---

## References

- [Bun Test Documentation](https://bun.com/docs/test/writing-tests)
- [Project AGENTS.md - Testing Strategy](AGENTS.md#6-testing-strategy)
