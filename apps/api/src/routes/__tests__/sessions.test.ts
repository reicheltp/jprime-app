import { describe, it, expect, beforeEach } from 'bun:test'
import { Hono } from 'hono'
import { registerSessionRoutes } from '../sessions'
import { MockDataProvider, createMockData } from '../../providers/__tests__/MockDataProvider'

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
    it('returns all sessions', async () => {
      const res = await app.request('/api/v1/sessions')
      expect(res.status).toBe(200)

      const json = await res.json()
      expect(json.data).toBeArray()
      expect(json.data.length).toBe(2)
      expect(json.meta.total).toBe(2)
    })

    it('returns sessions with correct shape', async () => {
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
    it('returns a specific session by id', async () => {
      const res = await app.request('/api/v1/sessions/session-1')
      expect(res.status).toBe(200)

      const json = await res.json()
      expect(json.data.id).toBe('session-1')
      expect(json.data.title).toBe('Opening Keynote')
    })

    it('returns 404 for non-existent session', async () => {
      const res = await app.request('/api/v1/sessions/nonexistent')
      expect(res.status).toBe(404)

      const json = await res.json()
      expect(json.error).toBe('Not found')
      expect(json.code).toBe('NOT_FOUND')
    })
  })
})
