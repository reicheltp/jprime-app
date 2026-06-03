import { describe, it, expect, beforeEach } from 'bun:test'
import { Hono } from 'hono'
import { registerSessionRoutes } from './sessions'
import { MockDataProvider, createMockData } from '../providers/MockDataProvider'

/**
 * SPEC-004 Conference Data API
 * Tests: AC#1, AC#2
 */

describe('Session Routes', () => {
  let app: Hono
  let provider: MockDataProvider

  beforeEach(() => {
    const { sessions, speakers } = createMockData()
    provider = new MockDataProvider(sessions, speakers)
    app = new Hono()
    registerSessionRoutes(app, provider)
  })

  describe('GET /api/v1/sessions', () => {
    // SPEC-004 AC#1: returns list of all sessions with required fields
    it('SPEC-004 AC#1: returns all sessions', async () => {
      const res = await app.request('/api/v1/sessions')
      expect(res.status).toBe(200)

      const json = await res.json()
      expect(json.data).toBeArray()
      expect(json.data.length).toBe(2)
      expect(json.meta.total).toBe(2)
    })

    // SPEC-004 AC#1: verify all required fields are present
    it('SPEC-004 AC#1: returns sessions with all required fields', async () => {
      const res = await app.request('/api/v1/sessions')
      const json = await res.json()

      const session = json.data[0]
      expect(session).toHaveProperty('id')
      expect(session).toHaveProperty('title')
      expect(session).toHaveProperty('type')
      expect(session).toHaveProperty('track')
      expect(session).toHaveProperty('room')
      expect(session).toHaveProperty('day')
      expect(session).toHaveProperty('startTime')
      expect(session).toHaveProperty('endTime')
      expect(session).toHaveProperty('description')
      expect(session).toHaveProperty('speakers')
    })
  })

  describe('GET /api/v1/sessions/:id', () => {
    // SPEC-004 AC#2: returns full session object for id
    it('SPEC-004 AC#2: returns a specific session by id', async () => {
      const res = await app.request('/api/v1/sessions/session-1')
      expect(res.status).toBe(200)

      const json = await res.json()
      expect(json.data.id).toBe('session-1')
      expect(json.data.title).toBe('Opening Keynote')
    })

    // SPEC-004 AC#2: returns 404 if not found
    it('SPEC-004 AC#2: returns 404 for non-existent session', async () => {
      const res = await app.request('/api/v1/sessions/nonexistent')
      expect(res.status).toBe(404)

      const json = await res.json()
      expect(json.error).toBe('Not found')
      expect(json.code).toBe('NOT_FOUND')
    })
  })
})
