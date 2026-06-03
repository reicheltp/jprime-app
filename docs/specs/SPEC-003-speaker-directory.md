---
id: SPEC-003
title: Speaker Directory Requirements
feature: speaker-directory
type: requirements
status: approved
created: 2026-06-03
updated: 2026-06-03
---

# Feature: Speaker Directory

**User Story:** As a conference attendee, I want to browse the list of speakers and view their profiles so that I can learn about the people presenting and discover their sessions.

## Acceptance Criteria

1. **WHEN** the attendee opens the Speakers screen **THEN** the system **SHALL** display all speakers fetched from the live API, ordered alphabetically by last name.
2. **WHEN** speakers are loading **THEN** the system **SHALL** display a loading indicator in place of the speaker list.
3. **WHEN** the API request fails **THEN** the system **SHALL** display an error message with a retry action.
4. **WHEN** the attendee taps a speaker **THEN** the system **SHALL** navigate to a speaker detail screen showing: full name, photo (if available), biography, and a list of their sessions at this conference.
5. **WHEN** the attendee taps a session listed on a speaker detail screen **THEN** the system **SHALL** navigate to that session's detail screen (SPEC-001 AC #4).
6. **WHEN** the attendee is on a session detail screen **AND** the session has one or more speakers listed **THEN** the system **SHALL** display each speaker's name as a tappable link.
7. **WHEN** the attendee taps a speaker link on a session detail **THEN** the system **SHALL** navigate to that speaker's detail screen.
8. **WHERE** a speaker has no biography in the API response **THEN** the system **SHALL** omit the biography section gracefully without error.
9. **WHERE** a speaker has no photo in the API response **THEN** the system **SHALL** display a placeholder avatar.

## Edge Cases

- **Speaker with no sessions**: If a speaker has no sessions listed in the API response, show an empty-state message in the sessions section of their profile ("No sessions scheduled").
- **Multi-speaker sessions**: A session may appear in multiple speakers' session lists; this is expected and correct.
- **Break sessions**: Break-type sessions shall not appear in any speaker's session list.
- **Long biography**: Biographies can be multi-paragraph; the detail screen must scroll to accommodate long text.

## Constraints

- All speaker data is fetched from the live REST API; no data is bundled.
- React Query is used for fetching and caching; speaker list and individual speaker detail may be cached separately.
- Speaker list must be performant for up to 100 speakers (use a virtualised list).

## Out of Scope

- Attendee-to-speaker direct messaging or contact forms.
- Social media links for speakers (deferred; data model should not block adding later).
- Speaker search by free-text keyword.
- Attendee networking or attendee profiles (planned, future batch).
