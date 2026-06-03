---
id: ADR-002
title: Use Expo as the Mobile Framework
status: accepted
date: 2026-06-03
deciders:
  - Paul
tags:
  - framework
  - mobile
  - cross-platform
related:
  - ADR-003-expo-router-navigation.md
  - ADR-007-web-first-platform-strategy.md
---

# ADR-002: Use Expo as the Mobile Framework

## Context

We need a framework to build a conference app targeting web, iOS, and Android from a single TypeScript codebase, with a preference for web-first delivery and managed build infrastructure.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Expo SDK** | **Single codebase, EAS builds, large ecosystem, web-first support** | **Managed environment limits some advanced native APIs** |
| React Native CLI | Full control over native layer | More setup, no managed builds, web support is harder |
| Capacitor | Web-first approach, use any web framework | Less mature for React Native ecosystem |
| Flutter | Excellent performance, single codebase | Different language (Dart), steeper learning curve |

## Decision

**Expo SDK 50+** with EAS (Expo Application Services) for builds and deployment.

## Rationale

- Single codebase for web, iOS, and Android — aligns with the web-first strategy
- EAS handles complex build and submission workflows without custom CI configuration
- Large ecosystem: access to `expo-*` packages for camera, location, notifications, etc.
- Expo Go enables rapid iteration without a full build cycle
- Expo Router (file-based routing) is a first-class citizen of the framework

## Consequences

- **Good:** Fast iteration, managed builds, broad ecosystem
- **Bad:** Some advanced native APIs require ejecting or custom native modules
- **Neutral:** Expo SDK version upgrades must be coordinated across all packages
