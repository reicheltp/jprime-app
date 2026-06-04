---
id: SPEC-009
title: Connect Codes Design
feature: connect-codes
type: design
status: draft
created: 2026-06-04
updated: 2026-06-04
---

# Design: Connect Codes

> Prerequisite: `SPEC-009-connect-codes.md` must be `status: approved`.
> Related: `SPEC-008-attendee-connections.md` (extend existing connections feature)

## Overview

This feature adds 5-character code support as an alternative to QR code scanning for the attendee connections feature (SPEC-008). Users can now connect by either:
1. Scanning a QR code (existing)
2. Entering a 5-character code manually (new)

Codes are server-generated to ensure global uniqueness and are persistently assigned to users.

## Architecture

How this feature fits into the overall app structure:

```
packages/types      → ConnectCode type extensions
packages/api        → New API endpoints: GET/PUT /api/v1/profile/connect-code
packages/ui         → CodeDisplay, CodeEntryModal components
apps/conference/app → Extend (connections)/scan.tsx with code entry toggle
```

The feature integrates with existing SPEC-008 infrastructure:
- Uses same connection storage (AsyncStorage)
- Uses same connection management logic
- Extends the QR scanner screen to support code entry

## Components and Interfaces

### Extended Types (`@jprime/types`)

```typescript
// Add to existing types
export interface AttendeeProfile {
  id: string
  email: string
  displayName: string | null
  connectCode: string | null  // NEW: 5-character code
  // ... existing fields
}

export interface ConnectCodeLookupResult {
  attendeeId: string
  email: string
  displayName: string
  connectCode: string
}

export interface ConnectCodeData {
  code: string  // 5-character code
}

// Validation regex: exactly 5 chars from allowed set, case-insensitive
// Allowed: [2-9A-HJ-KMNP-Z] (case insensitive)
export const CONNECT_CODE_PATTERN = /^[2-9A-HJ-KMNP-Z]{5}$/i
```

### New API Endpoints (`@jprime/api`)

```typescript
// GET user's own connect code
GET /api/v1/profile/connect-code
Response: { code: string }

// Generate/assign connect code to user (idempotent)
PUT /api/v1/profile/connect-code
Request: {}
Response: { code: string }

// Look up attendee by connect code
GET /api/v1/attendees/by-code/{code}
Response: ConnectCodeLookupResult
```

### New Components (`@jprime/ui`)

```typescript
// CodeDisplay: Shows user's own 5-character code
interface CodeDisplayProps {
  code: string
  size?: 'small' | 'medium' | 'large'
}

// CodeEntryModal: Modal for manual code entry
interface CodeEntryModalProps {
  visible: boolean
  onSubmit: (code: string) => void
  onCancel: () => void
  isLoading?: boolean
}

// CodeInput: Styled input for 5-character codes
interface CodeInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
  autoFocus?: boolean
}
```

### Screens / Routes (`apps/conference/app/`)

Modify existing SPEC-008 screens:

| Route | File | Changes |
|-------|------|---------|
| `/(connections)/scan` | `(connections)/scan.tsx` | Add toggle between QR scanner and code entry |
| `/(connections)/index` | `(connections)/index.tsx` | Display user's code alongside QR code |

**Scan Screen Modifications:**
- Add tab/toggle to switch between "Scan QR" and "Enter Code"
- When "Enter Code" is selected, show CodeEntryModal
- Code entry validates format before submission
- On valid code, resolve to attendee and create connection (same flow as QR scan)

**Connections Page Modifications:**
- Display user's 5-character code prominently alongside their QR code
- Add "Share Code" button option for code (in addition to QR sharing)

## Data Models

### API Response Types

```typescript
// GET /api/v1/profile/connect-code
interface GetConnectCodeResponse {
  code: string  // User's 5-character code
}

// GET /api/v1/attendees/by-code/{code}
interface LookupByCodeResponse {
  attendeeId: string
  email: string
  displayName: string
  connectCode: string
}

// Error responses
interface LookupByCodeError {
  error: 'NOT_FOUND' | 'INVALID_FORMAT'
  message: string
}
```

### Character Set Constants

```typescript
// Allowed characters for code generation
// 31 characters: 2-9 (8 digits) + A-H (8 letters) + J, K, M, N, P-Z (15 letters)
// Excludes: 0, 1, I, O, L (to avoid visual confusion)
export const CONNECT_CODE_CHARS = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'

// Regex pattern for validation
// Matches exactly the characters defined in CONNECT_CODE_CHARS
export const CONNECT_CODE_REGEX = /^[2-9A-HJKMNP-Z]{5}$/i

// Length constant
export const CONNECT_CODE_LENGTH = 5
// Total possible combinations: 31^5 = 28,629,151
```

## Server-Side Generation Algorithm

```typescript
// Pseudo-code for server-side generation
function generateUniqueConnectCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
  const usedCodes = await getAllUsedConnectCodes()
  
  while (true) {
    const code = generateRandomCode(chars, 5)
    if (!usedCodes.includes(code)) {
      // Verify uniqueness in database
      const existing = await db.attendees.find({ connectCode: code })
      if (!existing) {
        return code
      }
    }
  }
}

function generateRandomCode(chars: string, length: number): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}
```

## Error Handling

| Scenario | Handling |
|----------|---------|
| Code not found | Show error "No attendee found with code: [CODE]" |
| Invalid format (wrong length) | Show error "Code must be 5 characters" |
| Invalid format (bad characters) | Show error "Code contains invalid characters" |
| User's own code entered | Show error "Cannot connect to yourself" |
| Already connected | Show success "Already connected to [NAME]" |
| Network error | Show error "Network required to look up code" |
| Entering code for incoming connection | Show prompt "[NAME] has connected with you. Connect back?" |

## Validation Rules

```typescript
function validateConnectCode(code: string): ValidationResult {
  // Check length
  if (code.length !== 5) {
    return { valid: false, error: 'Code must be 5 characters' }
  }
  
  // Check character set (case-insensitive)
  if (!/^[2-9A-HJ-KMNP-Z]{5}$/i.test(code)) {
    return { valid: false, error: 'Code contains invalid characters' }
  }
  
  return { valid: true }
}
```

## Testing Strategy

- **Unit**: Test code generation, validation, lookup resolution
- **Integration**: Test code entry flow with mocked API responses
- **E2E**: Test full flow: home → connect → enter code → verify connection
- **Edge cases**: Test invalid formats, own code, already connected, non-existent code

## Decision Log

**Decision: Server-side code generation**
Context: Need to ensure global uniqueness of codes across all conference attendees.
Options: Client-side generation, Server-side generation, Hybrid
Chosen: Server-side generation. Ensures uniqueness without coordination. Requires network for initial code assignment but code is persistent thereafter.

**Decision: Integrate with existing scan screen**
Context: Need to support both QR and code entry.
Options: Separate screens, Combined screen with toggle, Separate button on connections page
Chosen: Combined screen with toggle. Minimizes changes, provides seamless user experience. Users switch between methods without leaving the connect flow.

**Decision: Persistent codes**
Context: Codes could be ephemeral (per session) or persistent (per user).
Options: Per-session codes, Per-user persistent codes
Chosen: Per-user persistent codes. Users always have the same code, making it easier to share. Requires server storage but provides better UX.

**Decision: Character set**
Context: Need to avoid ambiguous characters.
Options: Various exclusion sets
Chosen: Exclude 0, 1, I, O, L. This is a common standard (similar to airline confirmation codes, etc.) giving us 28 characters and ~17M combinations.

## Dependencies

- Requires SPEC-006 (Auth) for user identification
- Requires SPEC-007 (User Profile) for storing user's connect code
- Extends SPEC-008 (Attendee Connections) for connection management
- Requires backend API endpoints for code generation and lookup
