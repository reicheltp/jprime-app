---
id: SPEC-009
title: Connect Codes Tasks
feature: connect-codes
type: tasks
status: draft
created: 2026-06-04
updated: 2026-06-04
---

> Prerequisite: `SPEC-009-connect-codes.design.md` must be `status: approved`.
> Extends: SPEC-008 Attendee Connections - update existing files where noted.

- [ ] **1. Add connect code constants to `@jprime/utils`**
  - [ ] Create `src/constants/connect-codes.ts`
  - [ ] Define `CONNECT_CODE_CHARS` constant
  - [ ] Define `CONNECT_CODE_REGEX` pattern
  - [ ] Define `CONNECT_CODE_LENGTH` constant
  - [ ] Define `validateConnectCode()` function
  - _Requirements: SPEC-009 #3, #6_

- [ ] **2. Extend types in `@jprime/types`**
  - [ ] Add `connectCode: string | null` to `AttendeeProfile` interface
  - [ ] Add `ConnectCodeLookupResult` interface
  - [ ] Add `ConnectCodeData` interface
  - [ ] Export `CONNECT_CODE_PATTERN` constant
  - _Requirements: SPEC-009 #1, #2, #5_

- [ ] **3. Create API client for connect codes (`@jprime/api`)**
  - [ ] Add API endpoints to Supabase client or create new service
  - [ ] Implement `getConnectCode(): Promise<string>` - fetch user's code
  - [ ] Implement `generateConnectCode(): Promise<string>` - generate/assign code
  - [ ] Implement `lookupByConnectCode(code: string): Promise<ConnectCodeLookupResult>` - resolve code to attendee
  - _Requirements: SPEC-009 #1, #2, #5_

- [ ] **4. Create UI components (`@jprime/ui`)**
  - [ ] Create `CodeDisplay` component for showing user's code
    - [ ] Support size variants (small, medium, large)
    - [ ] Style to match cyberpunk theme (glass morphism, neon accent)
    - [ ] Display code in large, monospace font
  - [ ] Create `CodeInput` component for 5-char entry
    - [ ] Auto-focus on mount
    - [ ] Uppercase transformation
    - [ ] Validate on each keystroke
    - [ ] Style to match app design
  - [ ] Create `CodeEntryModal` component
    - [ ] Contain CodeInput
    - [ ] Submit and Cancel buttons
    - [ ] Loading state
  - _Requirements: SPEC-009 #3, #4_

- [ ] **5. Extend QR Scanner screen to support code entry (`apps/conference/app`)**
  - [ ] Modify `(connections)/scan.tsx`
  - [ ] Add toggle/tab to switch between "Scan QR" and "Enter Code"
  - [ ] Integrate CodeEntryModal
  - [ ] On code submission:
    - [ ] Validate code format
    - [ ] Look up attendee by code via API
    - [ ] Handle errors (invalid, not found, own code, already connected)
    - [ ] Create connection (reuse existing connection logic from SPEC-008)
    - [ ] Navigate back on success
  - _Requirements: SPEC-009 #4, #5, #6, #7, #8_
  - _Related: SPEC-008 #2, #3_

- [ ] **6. Extend Connections page to display user's code (`apps/conference/app`)**
  - [ ] Modify `(connections)/index.tsx`
  - [ ] Fetch and display user's connect code
  - [ ] Add CodeDisplay component alongside QRCodeDisplay
  - [ ] Style both codes together in a shareable card
  - [ ] Add copy-to-clipboard functionality for code
  - _Requirements: SPEC-009 #3_
  - _Related: SPEC-008 #7_

- [ ] **7. Update connection utility functions (`@jprime/utils`)**
  - [ ] Create `createConnectionFromCode(code: string)` function
    - [ ] Look up attendee by code
    - [ ] Create QRCodeData equivalent from code lookup
    - [ ] Reuse existing `addOutgoingConnection` logic
  - [ ] Extend validation to handle code-based connections
  - _Requirements: SPEC-009 #5_
  - _Related: SPEC-008 connection storage_

- [ ] **8. Handle edge cases in code entry flow**
  - [ ] Own code detection (compare with user's code, not just email)
  - [ ] Already connected detection
  - [ ] Network error handling with retry option
  - [ ] Invalid format feedback
  - [ ] Non-existent code feedback
  - _Requirements: SPEC-009 #6, #7, #8, Edge Cases_

- [ ] **9. Update existing connection logic to handle code-based connections**
  - [ ] Modify connection creation to accept either QRCodeData or ConnectCodeLookupResult
  - [ ] Ensure incoming connections from codes are stored correctly
  - [ ] Ensure connect-back works for code-based connections
  - _Related: SPEC-008 connection management_

- [ ] **10. Add tests**
  - [ ] Unit tests for code validation
  - [ ] Unit tests for code generation logic
  - [ ] Unit tests for API client functions
  - [ ] Integration tests for code entry flow
  - [ ] E2E test: enter code → verify connection appears in list
  - [ ] Edge case tests: invalid code, own code, already connected
  - _Requirements: All acceptance criteria_

- [ ] **11. Update SPEC-008 files**
  - [ ] Update `SPEC-008-attendee-connections.md` to mention code alternative
  - [ ] Update `SPEC-008-attendee-connections.design.md` to show code integration
  - [ ] Update `SPEC-008-attendee-connections.tasks.md` to reference SPEC-009

- [ ] **12. Backend implementation (if applicable)**
  - [ ] Create database migration for `connect_code` column on profiles table
  - [ ] Implement `GET /api/v1/profile/connect-code` endpoint
  - [ ] Implement `PUT /api/v1/profile/connect-code` endpoint
  - [ ] Implement `GET /api/v1/attendees/by-code/{code}` endpoint
  - [ ] Add uniqueness constraint on connect_code column
  - [ ] Create code generation service with collision detection

- [ ] **13. Visual design verification**
  - [ ] Code display matches cyberpunk/neon aesthetic
  - [ ] Code input field has proper styling
  - [ ] Toggle between QR and code entry is intuitive
  - [ ] All touch targets >= 44x44pt
  - _See Design.md for visual requirements_

- [ ] **14. Final verification**
  - [ ] All acceptance criteria from `SPEC-009-connect-codes.md` pass
  - [ ] Integration with SPEC-008 works correctly
  - [ ] Offline behavior: code entry requires network (shows error)
  - [ ] All error states handled gracefully
  - [ ] UI matches design system
