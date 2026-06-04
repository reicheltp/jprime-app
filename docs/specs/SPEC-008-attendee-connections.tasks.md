---
id: SPEC-008
title: Attendee Connections Tasks
feature: attendee-connections
type: tasks
status: implemented
created: 2026-06-04
updated: 2026-06-04
---

# Tasks: Attendee Connections

> Prerequisite: `SPEC-008-attendee-connections.design.md` must be `status: approved`.
> Note: This feature is extended by SPEC-009 Connect Codes which adds 5-character code support as an alternative to QR scanning.

## Checklist

- [ ] **1. Add types to `@jprime/types`**
  - [ ] Define `Connection` interface with attendeeId, displayName, connectedAt, connectionType
  - [ ] Define `ConnectionType` enum (OUTGOING, INCOMING, MUTUAL)
  - [ ] Define `QRCodeData` interface with email and displayName
  - _Requirements: SPEC-008 #3, #5, #7_

- [ ] **2. Create connection storage utility (`@jprime/utils`)**
  - [ ] Create `useConnectionsStorage` hook for AsyncStorage access
  - [ ] Implement functions: getOutgoing, getIncoming, addConnection, isConnected, getConnection
  - [ ] Handle serialization/deserialization
  - _Requirements: SPEC-008 #3, #5, #6_

- [ ] **3. Build QR code utilities (`@jprime/utils`)**
  - [ ] Create `generateQRCodeData` function to create QR content from email/displayName
  - [ ] Create `parseQRCodeData` function to validate and parse scanned QR
  - _Requirements: SPEC-008 #2, #3, #4_

- [ ] **4. Build UI components (`@jprime/ui`)**
  - [ ] Create `QRCodeDisplay` component using react-native-qrcode-svg
  - [ ] Create `ConnectionCard` component showing full profile info
  - [ ] Style components to match app design system (glass cards, neon theme)
  - _Requirements: SPEC-008 #7, #8_

- [ ] **5. Create QR Scanner screen (`apps/conference/app/(connections)/scan.tsx`)**
  - [ ] Integrate react-native-vision-camera or expo-barcode-scanner
  - [ ] Handle camera permission requests
  - [ ] Parse scanned QR code and validate format
  - [ ] Look up attendee profile from conference data
  - [ ] Add connection and show success/error feedback
  - [ ] Navigate back to connections page on success
  - _Requirements: SPEC-008 #1, #2, #3, #4_
  - _Extended by: SPEC-009 (add code entry toggle to this screen)_

- [ ] **6. Create Connections page (`apps/conference/app/(connections)/index.tsx`)**
  - [ ] Display user's own QR code at top of page
  - [ ] Create "My Connections" list (outgoing connections)
  - [ ] Create "Connected to Me" list (incoming connections)
  - [ ] For incoming connections, show "Connect Back" button
  - [ ] Handle "Connect Back" action to add to outgoing connections
  - [ ] Show full profile information for each attendee
  - [ ] Handle empty states for both lists
  - _Requirements: SPEC-008 #5, #6, #7, #8_
  - _Extended by: SPEC-009 (add user's connect code display alongside QR)_

- [ ] **7. Create connections layout (`apps/conference/app/(connections)/_layout.tsx`)**
  - [ ] Set up route group for connections
  - [ ] Add authentication check (redirect if not authenticated)
  - _Requirements: SPEC-008 #1_

- [ ] **8. Add Connect button to home screen (`apps/conference/app/index.tsx`)**
  - [ ] Add floating action button or prominent button
  - [ ] Navigate to `/(connections)/scan` when pressed
  - [ ] Only show when authenticated
  - _Requirements: SPEC-008 #1, #2_

- [ ] **9. Add connections to navigation**
  - [ ] Add connections tab to bottom tab navigation (if applicable)
  - [ ] Or add to hamburger menu / settings
  - [ ] Ensure tabBarIcon is defined with Ionicons
  - _Requirements: SPEC-008 #5_

- [ ] **10. Write tests**
  - [ ] Unit tests for QR parsing/generation
  - [ ] Unit tests for connection storage logic
  - [ ] Component tests for ConnectionCard
  - [ ] Integration test for scanner with mock camera
  - [ ] Verify all acceptance criteria from requirements spec

## Verification

Before setting `status: implemented`:
- [ ] All acceptance criteria from `SPEC-008-attendee-connections.md` pass
- [ ] Feature works on web (primary platform)
- [ ] Feature works on iOS and Android
- [ ] No TypeScript errors (`bun run typecheck`)
- [ ] All tests pass (`bun run test`)
- [ ] Update row in [docs/features.md](../features.md)
- [ ] Visual review: all screens match cyberpunk/neon design theme
- [ ] Touch targets >= 44x44pt on all interactive elements
