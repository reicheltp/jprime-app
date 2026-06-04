---
id: SPEC-007
title: User Profile Management Requirements
feature: user-profile
type: requirements
status: approved
created: 2026-06-04
updated: 2026-06-04
---

## Feature: User Profile Management

**User Story:** As an authenticated conference attendee, I want to fill in my profile (name, company, bio, photo, social links) so that other attendees can find and recognise me when the networking feature launches.

---

### Acceptance Criteria

1. **WHEN** an authenticated user views their profile **THEN** the system SHALL display their current display name, company, bio, avatar, and social links.
2. **WHEN** an authenticated user saves a profile update **THEN** the system SHALL persist the changes and immediately reflect them in the profile view.
3. **WHEN** a user submits a bio longer than 280 characters **THEN** the system SHALL reject the update with an inline validation error.
4. **WHEN** a user submits an invalid URL for a social link or avatar **THEN** the system SHALL reject the update with an inline validation error.
5. **WHEN** no avatar URL is set **THEN** the system SHALL display a generated initials avatar based on the display name (or email prefix if no name is set).
6. **WHEN** a social link is set **THEN** the system SHALL render it as a tappable link that opens in the device browser.
7. **WHEN** an unauthenticated user navigates to the Profile tab **THEN** the system SHALL display a sign-in prompt instead of profile content.
8. **WHEN** a user is authenticated **THEN** the Profile tab SHALL be accessible directly from the main tab bar.
9. **WHEN** a field is left empty **THEN** the system SHALL treat it as null (not display an empty string).
10. **WHEN** the profile is updated **THEN** the system SHALL return the full updated profile in the response.

### Profile Fields

| Field | Type | Constraints |
|---|---|---|
| `displayName` | string | optional; max 100 chars |
| `company` | string | optional; max 100 chars |
| `bio` | string | optional; max 280 chars |
| `avatarUrl` | string | optional; must be valid https:// URL |
| `linkedinUrl` | string | optional; must be valid https:// URL |
| `twitterUrl` | string | optional; must be valid https:// URL |
| `githubUrl` | string | optional; must be valid https:// URL |
| `websiteUrl` | string | optional; must be valid http(s):// URL |

### Out of Scope

- File/image upload (avatar is URL-based only)
- Email change
- Account deletion
- Profile visibility settings (all profiles visible to authenticated users — covered in networking spec)
