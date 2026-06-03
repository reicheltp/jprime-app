---
id: SPEC-002
title: My Schedule Requirements
feature: my-schedule
type: requirements
status: approved
created: 2026-06-03
updated: 2026-06-03
---

# Feature: My Schedule

**User Story:** As a conference attendee, I want to bookmark sessions and view my personal schedule so that I can plan my day and keep track of sessions I intend to attend.

## Acceptance Criteria

1. **WHEN** the attendee views a session detail **THEN** the system **SHALL** display a "Bookmark" action to add the session to their schedule.
2. **WHEN** the attendee taps "Bookmark" on a session **THEN** the system **SHALL** save the session to the device-local schedule and update the bookmark indicator to show the session is bookmarked.
3. **WHEN** a session is already bookmarked **AND** the attendee views its detail **THEN** the system **SHALL** display a "Remove bookmark" action instead of "Bookmark".
4. **WHEN** the attendee taps "Remove bookmark" **THEN** the system **SHALL** remove the session from their schedule and update the indicator accordingly.
5. **WHEN** the attendee opens the My Schedule screen **THEN** the system **SHALL** display all bookmarked sessions ordered by start time ascending.
6. **WHEN** the attendee has no bookmarked sessions **AND** opens My Schedule **THEN** the system **SHALL** display an empty-state message with a prompt to browse sessions.
7. **WHEN** two or more bookmarked sessions overlap in time **THEN** the system **SHALL** display a conflict indicator on both sessions in the My Schedule view.
8. **WHEN** the attendee removes a session that was part of a conflict **THEN** the system **SHALL** remove the conflict indicator from remaining sessions if the conflict is resolved.
9. **WHERE** the app is restarted **THEN** the system **SHALL** restore the attendee's bookmarks from device storage without requiring any action from the user.

## Edge Cases

- **Bookmarking a break**: Break-type sessions cannot be bookmarked; the bookmark action shall not appear on break detail screens.
- **Session data changes**: If the live API returns updated session data (time change, cancellation), the stored bookmark still references the session by ID; the My Schedule view shall reflect the latest API data for that session.
- **Large personal schedule**: The system must handle up to 50 bookmarked sessions without performance degradation.

## Constraints

- Bookmarks are stored using device-local persistent storage (e.g. AsyncStorage or equivalent).
- No authentication is required for this feature; bookmarks are per-device.
- Future auth integration: the data model must support migrating local bookmarks to a server-side store when authentication is added (see SPEC-AUTH, planned).
- Conflict detection is time-based: two sessions conflict when their time slots overlap by any amount.

## Out of Scope

- Cross-device sync (requires authentication — deferred).
- Export or sharing of personal schedule.
- Session reminders or push notifications.
- Reordering bookmarks manually.
