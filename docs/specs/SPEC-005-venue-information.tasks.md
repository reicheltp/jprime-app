---
id: SPEC-005
title: Venue Information Tasks
feature: venue-information
type: tasks
status: implemented
created: 2026-06-04
updated: 2026-06-04
---

# Tasks: Venue Information

> Prerequisite: Static venue data from jprime.io website.

## Checklist

- [x] **1. Create VenueScreen component**
  - [x] Import necessary React Native components (View, Text, ScrollView, Linking, Pressable)
  - [x] Import Card from @jprime/ui
  - [x] Import Ionicons from @expo/vector-icons
  - _Requirements: SPEC-005 #1-#11_

- [x] **2. Implement Venue Overview card**
  - [x] Display conference dates (June 3-4, 2026)
  - [x] Display venue name ("John Atanasoff" Innovation Forum)
  - [x] Display venue location (Sofia Tech Park)
  - [x] Display venue description
  - _Requirements: SPEC-005 #1, #2_

- [x] **3. Implement Location card**
  - [x] Display full address
  - [x] Add clickable Google Maps link
  - [x] Display airport proximity information
  - _Requirements: SPEC-005 #3, #4_

- [x] **4. Implement Transportation card**
  - [x] Display taxi pricing
  - [x] Display travel time from airport
  - _Requirements: SPEC-005 #5_

- [x] **5. Implement Travel Information card**
  - [x] Display visa requirements
  - [x] Display local currency
  - [x] Add Wikipedia link
  - _Requirements: SPEC-005 #6, #7_

- [x] **6. Implement Accommodation card**
  - [x] Display recommended hotel (Vega Hotel Sofia)
  - [x] Add hotel website link
  - [x] Display walking distance
  - [x] Add contact email link for Ivan
  - _Requirements: SPEC-005 #8, #9_

- [x] **7. Implement Contact Us card**
  - [x] Display conference email with mailto link
  - [x] Display phone number with tel link
  - _Requirements: SPEC-005 #10_

- [x] **8. Style all cards**
  - [x] Use glass variant for all cards
  - [x] Use Ionicons for all section headers
  - [x] Apply dark theme colors (text-white, text-neutral-300, text-cyan)
  - [x] Use appropriate spacing (mb-6 between cards, p-6 container)
  - _Constraints: All content in dark theme, glass cards, Ionicons only_

- [x] **9. Add external link handling**
  - [x] Implement handlePress function using Linking.openURL
  - [x] Make all links pressable with appropriate icons
  - _Requirements: SPEC-005 #11_

- [x] **10. Write unit tests**
  - [x] Create VenueScreen.test.tsx
  - [x] Test all required content is rendered
  - [x] Test Linking.openURL is called with correct URLs
  - _Testing Strategy: Snapshot + render + interaction tests_

- [x] **11. Create documentation**
  - [x] Create SPEC-005-venue-information.md (requirements)
  - [x] Create SPEC-005-venue-information.design.md (design)
  - [x] Create SPEC-005-venue-information.tasks.md (tasks)
  - [x] Update docs/features.md

## Verification

Before setting `status: implemented`:
- [x] All acceptance criteria from `SPEC-005-venue-information.md` pass
- [x] Feature works on web (primary platform per ADR-007)
- [x] Feature works on iOS and Android
- [x] No TypeScript errors (`bun run typecheck`)
- [x] All tests pass (`bun run test`)
- [x] Update row in [docs/features.md](../features.md)
