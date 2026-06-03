---
id: ADR-007
title: Web-First Platform Strategy with Full Native Support
status: accepted
date: 2026-06-03
deciders:
  - Paul
tags:
  - platform
  - web
  - mobile
  - strategy
related:
  - ADR-002-expo-framework.md
---

# ADR-007: Web-First Platform Strategy with Full Native Support

## Context

The JPrime conference app targets three platforms: web, Android, and iOS. We need to define the priority order to allocate effort and make platform-specific trade-offs consistently.

## Options Considered

| Option | Description |
|--------|-------------|
| Native-first | Optimize for native; treat web as secondary |
| **Web-first** | **Web is primary; native parity follows** |
| Equal priority | All platforms developed in lock-step |

## Decision

**Web-first**: Web is the primary platform. Android and iOS follow with full feature parity.

**Priority order:** Web → Android → iOS

## Rationale

- Conference attendees primarily access information on desktop/mobile browsers before and during the event
- Web can be deployed and iterated instantly without app store approval cycles
- Expo Router provides first-class web support alongside native from the same files
- Full native support ensures the best experience for attendees who install the app

## Platform-Specific Implementation

- **Shared logic:** Expo Router handles routing for web and native from the same files
- **Platform branches:** `Platform.OS` checks and `.web.tsx`/`.native.tsx` file extensions for diverging UI
- **Web-specific:** Responsive layouts, keyboard support, PWA support (future)
- **Native-specific:** Touch gestures, offline support, push notifications, native share

## Consequences

- **Good:** Faster initial delivery via web; no app store review for web bug fixes
- **Bad:** Some native-specific UX (swipe gestures, haptics) may lag behind web development
- **Neutral:** All features must work on web before being considered "done"
