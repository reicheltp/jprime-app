---
id: SPEC-009
title: Connect Codes Requirements
feature: connect-codes
type: requirements
status: draft
created: 2026-06-04
updated: 2026-06-04
---

# Feature: Connect Codes

**User Story:** As a conference attendee, I want to connect with other attendees using a 5-character code as an alternative to QR code scanning so that I can easily connect even when camera access is unavailable or inconvenient.

## Acceptance Criteria

1. **WHEN** a user is authenticated **AND** does not have a connect code **THEN** the system **SHALL** generate a unique 5-character code for that user
2. **WHEN** a user is authenticated **THEN** the system **SHALL** persistently associate the 5-character code with that user
3. **WHEN** a user views the connect screen **THEN** the system **SHALL** display their unique 5-character code
4. **WHEN** a user views the connect screen **THEN** the system **SHALL** provide an option to enter another attendee's 5-character code manually
5. **WHEN** a user enters a valid 5-character code **THEN** the system **SHALL** resolve it to the corresponding attendee and add them to the user's connections list
6. **WHEN** a user enters an invalid 5-character code **THEN** the system **SHALL** display an error message
7. **WHEN** a user enters their own 5-character code **THEN** the system **SHALL** display an error message "Cannot connect to yourself"
8. **WHEN** a user enters a 5-character code of someone already connected **THEN** the system **SHALL** display an appropriate message

## Edge Cases

- User enters non-existent code: Show error "No attendee found with that code"
- User enters code with invalid characters: Show error "Invalid code format"
- User enters code with wrong length: Show error "Code must be 5 characters"
- User has no network connectivity: Show error "Network required to look up code" (server-side resolution)
- Code lookup returns multiple matches: Should not happen with unique codes - treat as error

## Constraints

- 5-character code must be unique per user across the entire conference
- Code must use only non-ambiguous characters: 23456789ABCDEFGHJKLMNPQRSTUVWXYZ (28 characters)
- Code must be exactly 5 characters long
- Code must be case-insensitive for entry but displayed in uppercase
- Codes must be persistently assigned to users (not regenerated per session)
- Code lookup requires network connectivity (server-side resolution)

## Character Set

**Allowed characters (31 total):**
- Numbers: 2, 3, 4, 5, 6, 7, 8, 9 (excludes 0, 1)
- Letters: A, B, C, D, E, F, G, H, J, K, M, N, P, Q, R, S, T, U, V, W, X, Y, Z (excludes I, O, L)

**Excluded characters (to avoid visual confusion):**
- 0 (zero) - looks like O
- 1 (one) - looks like I or L
- I (capital i) - looks like 1 or L
- O (capital o) - looks like 0
- L (capital L) - looks like 1 or I

**Total combinations:** 31^5 = 28,629,151 possible unique codes

## Out of Scope

- Bulk code generation for all attendees at once
- Custom code selection by users
- Expiring or rotating codes
- Code sharing via social media

## Integration with SPEC-008

This feature extends SPEC-008 Attendee Connections. Both QR code scanning and 5-character code entry must be supported as alternative connection methods. The underlying connection storage and management (from SPEC-008) remains unchanged.
