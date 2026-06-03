export type SessionType = 'talk' | 'workshop' | 'keynote' | 'break'

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
