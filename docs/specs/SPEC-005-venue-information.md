---
id: SPEC-005
title: Venue Information Requirements
feature: venue-information
type: requirements
status: approved
created: 2026-06-04
updated: 2026-06-04
conference_scale: ~1100 attendees, 2 days, 3 tracks
---

# Feature: Venue Information

**User Story:** As a conference attendee, I want to access venue, travel, and accommodation information so that I can plan my trip and navigate to the conference location.

## Acceptance Criteria

1. **WHEN** the attendee opens the venue screen **THEN** the system **SHALL** display the conference dates (June 3-4, 2026).
2. **WHEN** the attendee opens the venue screen **THEN** the system **SHALL** display the venue name ("John Atanasoff" Innovation Forum) and location (Sofia Tech Park).
3. **WHEN** the attendee views the location section **THEN** the system **SHALL** display the full address (Tsarigradsko Shosse 111B, Sofia, Bulgaria).
4. **WHEN** the attendee views the location section **THEN** the system **SHALL** provide a clickable link to open the location in Google Maps.
5. **WHEN** the attendee views the transportation section **THEN** the system **SHALL** display taxi pricing information (€0.40-0.45 per km) and airport proximity (6 km, ~10 minutes by car).
6. **WHEN** the attendee views the travel information section **THEN** the system **SHALL** display visa requirements for Bulgaria (EU citizens no visa, Schengen holders free entrance, link to visa guide for others).
7. **WHEN** the attendee views the travel information section **THEN** the system **SHALL** display the local currency (Euro/EUR).
8. **WHEN** the attendee views the accommodation section **THEN** the system **SHALL** display the recommended hotel (Vega Hotel Sofia) with a link to its website.
9. **WHEN** the attendee views the accommodation section **THEN** the system **SHALL** provide contact information for accommodation inquiries (ivan@jprime.io).
10. **WHEN** the attendee views the contact section **THEN** the system **SHALL** display the conference email (conference@jprime.io) and phone number (+359 887 749 325).
11. **WHEN** the attendee taps any external link (maps, website, email, phone) **THEN** the system **SHALL** open the appropriate external application (browser, maps, email client, phone dialer).

## Edge Cases

- **No network connectivity**: External links will fail to open — system relies on device's native URL handling which provides its own error feedback.
- **External application not available**: If no email client is configured, email links will fail gracefully at the OS level.
- **Device cannot make calls**: Phone number link will fail gracefully at the OS level.

## Constraints

- All information is static and does not require API fetching.
- External links must use the device's native Linking API for universal compatibility across web, iOS, and Android.
- All content must be displayed in the dark theme with glass card styling consistent with the JPrime design system.
- Ionicons must be used for all icons — no emoji characters.
- Information is sourced from the official jprime.io website.

## Out of Scope

- Dynamic venue data fetching from an API.
- Interactive maps embedded in the app.
- Real-time transportation updates.
- Hotel booking functionality.
- Visa application assistance.
