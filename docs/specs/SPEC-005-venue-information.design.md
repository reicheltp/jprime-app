---
id: SPEC-005
title: Venue Information Design
feature: venue-information
type: design
status: approved
created: 2026-06-04
updated: 2026-06-04
---

# Design: Venue Information

## Overview

A static venue information screen displaying conference location, travel information, accommodation recommendations, and contact details. All information is hardcoded based on official jprime.io data. The screen uses glass cards to organize content into logical sections.

---

## Architecture

```
apps/conference/app/(venue)/
├── _layout.tsx          # Stack navigator for venue domain
└── index.tsx            # VenueScreen — displays all venue information
```

No API client or React Query hooks are needed as this feature uses static data.

---

## Components and Interfaces

### `VenueScreen` (`app/(venue)/index.tsx`)

Displays all venue information organized into themed glass cards:
1. Venue Overview — dates, venue name, description
2. Location — address with Google Maps link
3. Transportation — taxi pricing and airport info
4. Travel Information — visa requirements, currency, Wikipedia link
5. Accommodation — recommended hotel with contact
6. Contact Us — email and phone

Component uses:
- `ScrollView` for vertical scrolling
- `Card` from `@jprime/ui` with `variant="glass"`
- `Ionicons` from `@expo/vector-icons` for section icons
- `Linking` from `react-native` for external URL handling
- `Pressable` for clickable link elements

### Data Structure

No external data fetching. All information is hardcoded as string literals and URLs within the component.

---

## Navigation Flow

```
Tab: Venue
  └── (venue)/index   ← VenueScreen (static content)
```

The venue tab is accessible from the bottom tab navigation in the root layout.

---

## Error Handling

| Scenario | Handling |
|----------|----------|
| External link fails | Device native error handling (no app-level handling needed) |
| No email client configured | OS-level graceful failure |
| No phone capability | OS-level graceful failure |

---

## Testing Strategy

- Snapshot test for VenueScreen to verify content structure
- Unit test for each pressable link to verify Linking.openURL is called with correct URL
- Render test to verify all required text content is present
- Verify dark theme and glass card styling is applied

---

## Decision Log

| Decision | Rationale |
|----------|-----------|
| Static data (no API) | Venue information rarely changes; reduces complexity and offline works perfectly |
| Single screen | All venue information fits comfortably in one scrollable screen |
| Glass cards | Matches app design system and provides visual separation between sections |
| External links via Linking | Works across web, iOS, and Android without platform-specific code |
| No phone/email validation | OS handles these natively; validation would add complexity without benefit |
