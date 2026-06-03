import { describe, it, expect, beforeEach } from 'bun:test'
import { ScraperProvider, DataUnavailableError } from './ScraperProvider'
import { Cache } from './cache'
import type { Session, Speaker } from '@jprime/types'

/**
 * SPEC-004 Conference Data API
 * Tests: AC#5, AC#6 (ScraperProvider cache fallback behavior)
 */

describe('ScraperProvider', () => {
  let provider: ScraperProvider
  let cache: Cache

  beforeEach(() => {
    cache = new Cache()
    provider = new ScraperProvider('https://test.example.com', 60000, cache)
  })

  describe('getSessions', () => {
    it('returns sessions from cache when available', async () => {
      // Pre-populate cache
      const mockSessions: Session[] = [
        {
          id: 'session-1',
          title: 'Cached Session',
          type: 'talk',
          track: 'Track 1',
          room: 'hall A',
          day: '2026-06-03',
          startTime: '2026-06-03T10:00:00',
          endTime: '2026-06-03T10:45:00',
          description: null,
          speakers: [],
        },
      ]
      cache.set<Session[]>('sessions', mockSessions, 60000)

      const result = await provider.getSessions()
      expect(result).toEqual(mockSessions)
    })

    it('returns speakers from cache when available', async () => {
      const mockSpeakers: Speaker[] = [
        {
          id: 'speaker-1',
          firstName: 'Test',
          lastName: 'Speaker',
          fullName: 'Test Speaker',
          bio: null,
          photoUrl: null,
          sessions: [],
        },
      ]
      cache.set<Speaker[]>('speakers', mockSpeakers, 60000)

      const result = await provider.getSpeakers()
      expect(result).toEqual(mockSpeakers)
    })

    it('returns null for non-existent session', async () => {
      cache.set<Session[]>('sessions', [], 60000)

      const result = await provider.getSession('nonexistent')
      expect(result).toBeNull()
    })

    it('returns null for non-existent speaker', async () => {
      cache.set<Speaker[]>('speakers', [], 60000)

      const result = await provider.getSpeaker('nonexistent')
      expect(result).toBeNull()
    })
  })

  describe('getOrRefresh behavior', () => {
    it('uses cached data when fresh', async () => {
      const mockSessions: Session[] = [
        {
          id: 'session-1',
          title: 'Fresh Session',
          type: 'talk',
          track: 'Track 1',
          room: 'hall A',
          day: '2026-06-03',
          startTime: '2026-06-03T10:00:00',
          endTime: '2026-06-03T10:45:00',
          description: null,
          speakers: [],
        },
      ]
      cache.set<Session[]>('sessions', mockSessions, 60000)

      const result = await provider.getSessions()
      expect(result).toEqual(mockSessions)
    })
  })
})

describe('DataUnavailableError', () => {
  it('has correct name', () => {
    const error = new DataUnavailableError()
    expect(error.name).toBe('DataUnavailableError')
  })

  it('has correct message', () => {
    const error = new DataUnavailableError()
    expect(error.message).toBe('Conference data is unavailable and no cache exists')
  })

  it('is an Error instance', () => {
    const error = new DataUnavailableError()
    expect(error).toBeInstanceOf(Error)
  })
})
