import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { scrapeJprime } from '../jprime'
import type { Session, Speaker } from '@jprime/types'

// Mock fetch to return fixture data per hall
const fixturePath = new URL('../__fixtures__/jprime-sessions.json', import.meta.url).pathname
const allMockSessions = (await import(fixturePath)).default as unknown as Array<{
  hallName: string
  id: number
  title: string
  startTime: string
  endTime: string
  lectorName?: string
  coLectorName?: string
  talkDescription?: string | null
}>

// Save original fetch
const originalFetch = globalThis.fetch

// Group mock sessions by hall for per-hall responses
const sessionsByHall = new Map<string, typeof allMockSessions>()
allMockSessions.forEach((s) => {
  const hall = s.hallName.toLowerCase()
  if (!sessionsByHall.has(hall)) {
    sessionsByHall.set(hall, [])
  }
  sessionsByHall.get(hall)!.push(s)
})

beforeEach(() => {
  globalThis.fetch = async (url: RequestInfo) => {
    const urlStr = typeof url === 'string' ? url : url.toString()
    if (urlStr.includes('/pwa/findSessionsByHall')) {
      const urlObj = new URL(urlStr)
      const hallName = urlObj.searchParams.get('hallName')?.toLowerCase() || ''
      const hallSessions = sessionsByHall.get(hallName) || []
      return new Response(JSON.stringify(hallSessions), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    throw new Error(`Unexpected fetch URL: ${urlStr}`)
  }
})

afterEach(() => {
  globalThis.fetch = originalFetch
})

describe('scrapeJprime', () => {
  it('returns sessions and speakers with correct shape', async () => {
    const result = await scrapeJprime()

    expect(result.sessions).toBeArray()
    expect(result.speakers).toBeArray()
    expect(result.scrapedAt).toBeInstanceOf(Date)
  })

  it('maps sessions with correct IDs', async () => {
    const result = await scrapeJprime()

    expect(result.sessions.length).toBe(5)
    expect(result.sessions[0].id).toBe('session-1')
    expect(result.sessions[1].id).toBe('session-2')
  })

  it('correctly identifies session types', async () => {
    const result = await scrapeJprime()

    const keynote = result.sessions.find(s => s.id === 'session-1')
    expect(keynote?.type).toBe('keynote')

    const talk = result.sessions.find(s => s.id === 'session-2')
    expect(talk?.type).toBe('talk')

    const breakSession = result.sessions.find(s => s.id === 'session-4')
    expect(breakSession?.type).toBe('break')

    const workshop = result.sessions.find(s => s.id === 'session-5')
    expect(workshop?.type).toBe('workshop')
  })

  it('maps speakers from lectorName and coLectorName', async () => {
    const result = await scrapeJprime()

    const speakerNames = result.speakers.map(s => s.fullName)
    expect(speakerNames).toContain('Jane Doe')
    expect(speakerNames).toContain('John Smith')
    expect(speakerNames).toContain('Alice Johnson')
    expect(speakerNames).toContain('Bob Wilson')
    expect(speakerNames).toContain('Carol Brown')
  })

  it('excludes break sessions from speaker sessions list', async () => {
    const result = await scrapeJprime()

    // Coffee Break (session-4) should not appear in any speaker's sessions
    const coffeeBreak = result.sessions.find(s => s.id === 'session-4')
    expect(coffeeBreak?.type).toBe('break')

    for (const speaker of result.speakers) {
      const breakSessions = speaker.sessions.filter(s => s.id === 'session-4')
      expect(breakSessions.length).toBe(0)
    }
  })

  it('maps speaker references correctly', async () => {
    const result = await scrapeJprime()

    const johnSmith = result.speakers.find(s => s.fullName === 'John Smith')
    expect(johnSmith).toBeDefined()
    
    const johnsSessions = johnSmith?.sessions.map(s => s.id)
    expect(johnsSessions).toContain('session-2')
  })

  it('assigns correct tracks from halls', async () => {
    const result = await scrapeJprime()

    const hallASession = result.sessions.find(s => s.id === 'session-1')
    expect(hallASession?.track).toBe('Track 1')

    const hallBSession = result.sessions.find(s => s.id === 'session-3')
    expect(hallBSession?.track).toBe('Track 2')

    const hallCSession = result.sessions.find(s => s.id === 'session-5')
    expect(hallCSession?.track).toBe('Track 3')
  })

  it('preserves room information', async () => {
    const result = await scrapeJprime()

    const hallASessions = result.sessions.filter(s => s.room === 'hall A')
    const hallBSessions = result.sessions.filter(s => s.room === 'hall B')
    
    expect(hallASessions.length).toBeGreaterThan(0)
    expect(hallBSessions.length).toBeGreaterThan(0)
    expect(hallASessions[0].room).toBe('hall A')
    expect(hallBSessions[0].room).toBe('hall B')
  })

  it('parses dates correctly', async () => {
    const result = await scrapeJprime()

    const session = result.sessions[0]
    expect(session.day).toBe('2026-06-03')
    expect(session.startTime).toBe('2026-06-03T09:00:00')
    expect(session.endTime).toBe('2026-06-03T09:45:00')
  })

  it('handles null descriptions', async () => {
    const result = await scrapeJprime()

    const session = result.sessions.find(s => s.id === 'session-4')
    expect(session?.description).toBeNull()
  })
})
