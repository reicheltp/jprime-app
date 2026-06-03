import type { Session, Speaker, SessionRef, SpeakerRef } from '@jprime/types'

export interface ScrapeResult {
  sessions: Session[]
  speakers: Speaker[]
  scrapedAt: Date
}

const BASE_URL = 'https://jprime.io'
const HALLS = ['hall A', 'hall B', 'hall C']

interface JPrimeSession {
  hallName: string
  id: number
  title: string
  startTime: string
  endTime: string
  lectorName?: string
  coLectorName?: string
  talkDescription?: string | null
}

/**
 * Fetches session data from jprime.io PWA API endpoints.
 * The site provides REST-like endpoints at /pwa/findSessionsByHall?hallName={name}
 * which return JSON arrays of session objects.
 */
async function fetchSessions(): Promise<JPrimeSession[]> {
  const allSessions: JPrimeSession[] = []

  for (const hall of HALLS) {
    const url = `${BASE_URL}/pwa/findSessionsByHall?hallName=${encodeURIComponent(hall)}`
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; JPrimeApp/1.0)',
        'Accept': 'application/json',
        'Referer': 'https://jprime.io/app/index.html',
      },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch sessions for ${hall}: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    allSessions.push(...data)
  }

  return allSessions
}

/**
 * Maps jprime.io session data to our canonical Session type.
 */
function mapToSession(raw: JPrimeSession, speakerIds: Map<string, string>): Session {
  const speakers: SpeakerRef[] = []
  
  if (raw.lectorName) {
    const id = generateSpeakerId(raw.lectorName)
    speakerIds.set(raw.lectorName, id)
    speakers.push({ id, name: raw.lectorName })
  }
  
  if (raw.coLectorName) {
    const id = generateSpeakerId(raw.coLectorName)
    speakerIds.set(raw.coLectorName, id)
    speakers.push({ id, name: raw.coLectorName })
  }

  // Determine session type based on title
  const type = getSessionType(raw.title)
  const track = getTrackFromHall(raw.hallName)

  return {
    id: `session-${raw.id}`,
    title: raw.title,
    type,
    track,
    room: raw.hallName,
    day: raw.startTime.split('T')[0],
    startTime: raw.startTime,
    endTime: raw.endTime,
    description: raw.talkDescription?.trim() || null,
    speakers,
  }
}

/**
 * Maps speaker names to our canonical Speaker type.
 */
function mapToSpeaker(name: string, sessions: Session[]): Speaker {
  const id = generateSpeakerId(name)
  
  // Extract first and last name
  const parts = name.trim().split(/\s+/)
  const firstName = parts[0]
  const lastName = parts.length > 1 ? parts.slice(1).join(' ') : ''

  // Find all sessions for this speaker
  const speakerSessions: SessionRef[] = sessions
    .filter((s) => s.type !== 'break')
    .filter((s) => s.speakers.some((sp) => sp.name === name))
    .map((s) => ({
      id: s.id,
      title: s.title,
      day: s.day,
      startTime: s.startTime,
    }))

  return {
    id,
    firstName,
    lastName,
    fullName: name,
    bio: null,
    photoUrl: null,
    sessions: speakerSessions,
  }
}

/**
 * Generates a stable speaker ID from name.
 * Removes all non-ASCII characters to ensure stable IDs.
 */
function generateSpeakerId(name: string): string {
  return `speaker-${name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/[^a-z0-9-]/g, '')}`
}

/**
 * Determines session type from title.
 */
function getSessionType(title: string): 'talk' | 'workshop' | 'keynote' | 'break' {
  const lower = title.toLowerCase()
  
  if (lower.includes('keynote') || lower.includes('opening') || lower.includes('closing')) {
    return 'keynote'
  }
  if (lower.includes('workshop') || lower.includes('hands-on')) {
    return 'workshop'
  }
  if (lower.includes('break') || lower.includes('lunch') || lower.includes('coffee') || lower.includes('raffle') || lower.includes('beer')) {
    return 'break'
  }
  return 'talk'
}

/**
 * Maps hall name to track name.
 */
function getTrackFromHall(hallName: string): string | null {
  const hall = hallName.toLowerCase()
  if (hall === 'hall a') return 'Track 1'
  if (hall === 'hall b') return 'Track 2'
  if (hall === 'hall c') return 'Track 3'
  if (hall === 'workshop') return 'Workshop'
  return null
}

/**
 * Scrapes session and speaker data from the jprime.io website.
 * Uses the PWA API endpoints which return JSON directly.
 */
export async function scrapeJprime(baseUrl: string = BASE_URL): Promise<ScrapeResult> {
  // For now, we use the hardcoded PWA API. The baseUrl parameter is reserved for future use.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = baseUrl
  const rawSessions = await fetchSessions()
  const speakerIds = new Map<string, string>()
  
  // Map raw sessions to our Session type
  const sessions = rawSessions.map((raw) => mapToSession(raw, speakerIds))
  
  // Extract unique speaker names
  const speakerNames = new Set<string>()
  rawSessions.forEach((s) => {
    if (s.lectorName) speakerNames.add(s.lectorName)
    if (s.coLectorName) speakerNames.add(s.coLectorName)
  })
  
  // Map speakers to our Speaker type
  const speakers = Array.from(speakerNames).map((name) => mapToSpeaker(name, sessions))

  return {
    sessions,
    speakers,
    scrapedAt: new Date(),
  }
}

// --- Legacy helpers (kept for compatibility) ---

export function parseTime(dateStr: string, timeStr: string): string {
  return `${dateStr}T${timeStr}:00`
}

export function slugId(prefix: string, value: string): string {
  return `${prefix}-${value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`
}

export function buildSpeakerRefs(speakerIds: string[], allSpeakers: Pick<Speaker, 'id' | 'fullName'>[]): SessionRef[] {
  return speakerIds.flatMap((id) => {
    const s = allSpeakers.find((sp) => sp.id === id)
    return s ? [{ id: s.id, title: s.fullName, day: '', startTime: '' }] : []
  })
}
