---
id: SPEC-008
title: Attendee Connections Design
feature: attendee-connections
type: design
status: approved
created: 2026-06-04
updated: 2026-06-04
---

# Design: Attendee Connections

> Prerequisite: `SPEC-008-attendee-connections.md` must be `status: approved`.

## Overview

This feature enables attendees to connect with each other via QR code scanning. The implementation includes a QR scanner screen, a connections management page with two lists (outgoing and incoming connections), and QR code generation for the user's own profile. Connections are stored locally on the device with the ability to connect back to incoming connections without re-scanning.

## Architecture

How this feature fits into the overall app structure:

```
packages/types      → Connection, ConnectionType, AttendeeProfile types
packages/api        → No new API calls (local storage only for connections)
packages/ui         → ConnectionCard, QRCodeDisplay, QRScanner components
apps/conference/app → (connections)/ route with index, scan, and profile screens
```

The connections feature is client-side only. It reads attendee profile data from the existing conference data (SPEC-004) and stores connection relationships locally using AsyncStorage. QR codes encode email and displayName which are used as lookup keys to find the full profile in the conference data.

**Note:** SPEC-009 Connect Codes extends this feature by adding server-generated 5-character codes as an alternative connection method. Code-based connections require network connectivity for code lookup but use the same local storage mechanism for connection persistence.

## Components and Interfaces

### New Types (`@jprime/types`)

```typescript
export interface Connection {
  attendeeId: string       // email of the connected attendee
  displayName: string
  connectedAt: number     // timestamp when connection was made
  connectionType: ConnectionType
}

export enum ConnectionType {
  OUTGOING = 'OUTGOING',    // User connected to this attendee
  INCOMING = 'INCOMING',    // This attendee connected to user
  MUTUAL = 'MUTUAL'         // Both directions (derivable from OUTGOING + INCOMING)
}

export interface QRCodeData {
  email: string
  displayName: string
}
```

### New Components (`@jprime/ui`)

```typescript
// QRCodeDisplay: Shows user's own QR code
interface QRCodeDisplayProps {
  email: string
  displayName: string
  size?: number
}

// ConnectionCard: Displays a connection with profile info
interface ConnectionCardProps {
  connection: Connection
  attendeeProfile: AttendeeProfile
  onConnectBack?: () => void  // For INCOMING connections
  showConnectBackButton?: boolean
}

// QRScanner: Camera-based QR code scanner
interface QRScannerProps {
  onScan: (data: QRCodeData) => void
  onError: (error: string) => void
}
```

### Screens / Routes (`apps/conference/app/`)

| Route | File | Purpose |
|-------|------|---------|
| `/(connections)` | `(connections)/_layout.tsx` | Layout with tabs for My Connections and Connected to Me |
| `/(connections)/index` | `(connections)/index.tsx` | Main connections page with both lists and user's QR code |
| `/(connections)/scan` | `(connections)/scan.tsx` | QR scanner screen |

Home screen (`app/index.tsx`) will have a floating "Connect" button that navigates to `/(connections)/scan`.

## Data Models

### Local Storage Structure

Connections are stored in AsyncStorage with two keys:
- `@connections_outgoing`: Connection[] - users I've scanned
- `@connections_incoming`: Connection[] - users who have scanned me

```typescript
// Example stored data
{
  outgoing: [
    { attendeeId: "alice@email.com", displayName: "Alice", connectedAt: 1717497600000, connectionType: "OUTGOING" }
  ],
  incoming: [
    { attendeeId: "bob@email.com", displayName: "Bob", connectedAt: 1717501200000, connectionType: "INCOMING" }
  ]
}
```

### QR Code Content

QR codes contain a JSON string:
```json
{"email":"user@email.com","displayName":"User Name"}
```

This is parsed and used to look up the full attendee profile from the conference data.

## Error Handling

| Scenario | Handling |
|----------|---------|
| Camera permission denied | Show modal explaining permission is needed, with button to open settings |
| Camera not available | Show error message "Camera not available on this device" |
| Invalid QR code format | Show toast error "Invalid QR code - please scan an attendee code" |
| Attendee not found in conference data | Show toast error "Attendee not found in conference" |
| Scanning own QR code | Show toast error "Cannot connect to yourself" |
| Already connected | Show toast success "Already connected to [name]" |
| No connections yet | Show empty state with "Scan someone's QR code to connect" message |

## Testing Strategy

- **Unit**: Test QR code parsing, connection storage logic, duplicate detection
- **Integration**: Test QR scanner component with mock camera
- **E2E**: Test full flow: home → scan → connections list → verify both lists
- **Edge cases**: Test scanning own code, already connected, invalid QR, no camera

## Decision Log

**Decision: Client-side only storage**
Context: We need connections to work at a conference where connectivity may be spotty.
Options: Backend storage vs local storage vs hybrid
Chosen: Local storage only. Connections are per-device and don't need to sync. If a user switches devices, they'll need to re-scan. This keeps the feature simple and offline-capable.

**Decision: Email as attendee identifier**
Context: QR codes need a unique identifier to match against attendee profiles.
Options: User ID, Email, Custom UUID
Chosen: Email. User said QR contains email and displayName. This matches existing attendee data structure from SPEC-004.

**Decision: Separate outgoing/incoming lists**
Context: Need to show both directions of connections.
Options: Single merged list with indicators, Two separate tabs/lists, Filterable single list
Chosen: Two separate lists on the same page (My Connections and Connected to Me). This makes the reciprocal nature clear and allows one-tap connect-back.
