---
title: Domain Glossary
description: Canonical definitions of domain terms used in code, specs, and ADRs for the JPrime Conference App.
type: glossary
last_updated: 2026-06-04
status: active
---

# Domain Glossary

Canonical definitions for terms used across code, specs, and architecture documents. When a term appears in a type name, variable, route, or spec, it should match the definition here.

---

## Conference

| Term | Definition |
|------|------------|
| **Conference** | The JPrime developer conference event as a whole. |
| **Edition** | A single annual occurrence of the conference (e.g., JPrime 2026). Each edition runs for 2 days and hosts approximately 1,100 attendees. |
| **Venue** | The physical location where the conference is held. |
| **Room** | A specific space within the venue where sessions take place (e.g., "Hall A", "Room 3"). |

## Schedule

| Term | Definition |
|------|------------|
| **Schedule** | The full programme of all sessions across all days and rooms. Also: a user's personal list of saved sessions. Context determines which meaning applies — prefer `ConferenceSchedule` vs `UserSchedule` in code to disambiguate. |
| **Slot** | A time block in the conference day (e.g., 10:00–10:45). Multiple sessions can occupy the same slot in different rooms. |
| **Session** | Any scheduled event at the conference: a talk, workshop, keynote, or break. The umbrella term — use this in generic contexts. |
| **Talk** | A presentation-style session delivered by one or more speakers to an audience. |
| **Workshop** | A hands-on, interactive session where attendees participate actively. |
| **Keynote** | A featured talk, typically opening or closing a conference day. |
| **Break** | A non-talk session slot (coffee break, lunch, registration). Not shown in speaker listings. |
| **Track** | A thematic grouping of sessions across the schedule. JPrime has three tracks: two main session tracks and one dedicated workshop track. |
| **Conflict** | A situation where two or more of a user's saved sessions overlap in time. |

## People

| Term | Definition |
|------|------------|
| **Speaker** | A person delivering one or more sessions at the conference. |
| **Attendee** | A person registered to attend the conference. Also the primary user persona for this app. |

## User Actions

| Term | Definition |
|------|------------|
| **Bookmark** | The action of saving a session to a user's personal schedule. Prefer "bookmark" over "save" or "favourite" in UI copy and code. |
| **Bookmarked Session** | A session the attendee has added to their personal schedule. |
| **My Schedule** | The attendee's personal view of their bookmarked sessions. |

## Authentication

| Term | Definition |
|------|------------|
| **OTP** | One-Time Password — a short-lived 6-digit numeric code generated for passwordless sign-in. Stored as a SHA-256 hash in the database and expires after 10 minutes. |
| **Magic Code** | The user-facing name for an OTP sent to an attendee's email address. Prefer "magic code" in UI copy; use OTP in code and specs. |
| **JWT** | JSON Web Token — a signed, stateless bearer token issued to the client after OTP verification. Encoded as `header.claims.signature` (HS256, 7-day expiry). |
| **Bearer Token** | The JWT included in the `Authorization: Bearer <token>` HTTP header on authenticated requests. |
| **Auth Session** | The client-side representation of a signed-in user: `{ token: string; user: { id, email } }`. Persisted in AsyncStorage and restored on app launch. |

## Profile

| Term | Definition |
|------|------------|
| **Profile** | A user's public-facing conference identity: display name, company, bio, avatar URL, and social links. Stored as nullable columns on the `users` table. |
| **Display Name** | The attendee's preferred full name shown in the app (max 100 characters). Falls back to the email address when not set. |
| **Bio** | A short attendee self-description (max 280 characters). |
| **Avatar** | A circular representation of the attendee — either a remote image (via `avatarUrl`) or a generated initials badge derived from `displayName` or email. |
| **Attendee Profile** | A profile belonging to a conference attendee; the primary use case for the Profile feature (SPEC-006). |

## Technical

| Term | Definition |
|------|------------|
| **Domain** | A feature area of the app (auth, schedule, speakers, venue). Maps to an Expo Router route group `(domain)`. |
| **Spec** | A spec-driven development document: requirements, design, or tasks file in `docs/specs/`. |
| **ADR** | Architecture Decision Record — a document capturing a significant technical decision. Stored in `docs/decisions/`. |
