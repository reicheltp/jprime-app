---
title: Domain Glossary
description: Canonical definitions of domain terms used in code, specs, and ADRs for the JPrime Conference App.
type: glossary
last_updated: 2026-06-03
status: active
---

# Domain Glossary

Canonical definitions for terms used across code, specs, and architecture documents. When a term appears in a type name, variable, route, or spec, it should match the definition here.

---

## Conference

| Term | Definition |
|------|------------|
| **Conference** | The JPrime developer conference event as a whole. |
| **Edition** | A single annual occurrence of the conference (e.g., JPrime 2026). |
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
| **Track** | A thematic grouping of sessions across the schedule (e.g., "JVM Internals", "Cloud & DevOps", "Security"). |
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

## Technical

| Term | Definition |
|------|------------|
| **Domain** | A feature area of the app (auth, schedule, speakers, venue). Maps to an Expo Router route group `(domain)`. |
| **Spec** | A spec-driven development document: requirements, design, or tasks file in `docs/specs/`. |
| **ADR** | Architecture Decision Record — a document capturing a significant technical decision. Stored in `docs/decisions/`. |
