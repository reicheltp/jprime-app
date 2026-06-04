export type SessionType = 'talk' | 'workshop' | 'keynote' | 'break'

// Connections / Attendee Types
export interface AttendeeProfile {
  id: string
  email: string
  displayName: string | null
  company: string | null
  bio: string | null
  avatarUrl: string | null
  linkedinUrl: string | null
  twitterUrl: string | null
  githubUrl: string | null
  websiteUrl: string | null
}

export enum ConnectionType {
  OUTGOING = 'OUTGOING',
  INCOMING = 'INCOMING',
  MUTUAL = 'MUTUAL',
}

export interface Connection {
  attendeeId: string // email of the connected attendee
  displayName: string
  connectedAt: number // timestamp when connection was made
  connectionType: ConnectionType
}

export interface QRCodeData {
  email: string
  displayName: string
}

// Existing types below
export interface SpeakerRef {
  id: string
  name: string
}

export interface Session {
  id: string
  title: string
  type: SessionType
  track: string | null
  room: string
  day: string
  startTime: string
  endTime: string
  description: string | null
  speakers: SpeakerRef[]
}

export interface SessionRef {
  id: string
  title: string
  day: string
  startTime: string
}

export interface Speaker {
  id: string
  firstName: string
  lastName: string
  fullName: string
  bio: string | null
  photoUrl: string | null
  sessions: SessionRef[]
}
