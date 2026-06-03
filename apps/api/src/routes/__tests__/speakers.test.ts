import { describe, it, expect, beforeEach } from 'bun:test'
import { Hono } from 'hono'
import { registerSpeakerRoutes } from '../speakers'
import { MockDataProvider, createMockData } from '../../providers/__tests__/MockDataProvider'

describe('Speaker Routes', () => {
  let app: Hono
  let provider: MockDataProvider

  beforeEach(() => {
    const { sessions, speakers } = createMockData()
    provider = new MockDataProvider(sessions, speakers)
    app = new Hono()
    registerSpeakerRoutes(app, provider)
  })

  describe('GET /api/v1/speakers', () => {
    it('returns all speakers', async () => {
      const res = await app.request('/api/v1/speakers')
      expect(res.status).toBe(200)

      const json = await res.json()
      expect(json.data).toBeArray()
      expect(json.data.length).toBe(2)
      expect(json.meta.total).toBe(2)
    })

    it('returns speakers with correct shape', async () => {
      const res = await app.request('/api/v1/speakers')
      const json = await res.json()

      const speaker = json.data[0]
      expect(speaker).toHaveProperty('id')
      expect(speaker).toHaveProperty('firstName')
      expect(speaker).toHaveProperty('lastName')
      expect(speaker).toHaveProperty('fullName')
      expect(speaker).toHaveProperty('bio')
      expect(speaker).toHaveProperty('photoUrl')
      expect(speaker).toHaveProperty('sessions')
    })
  })

  describe('GET /api/v1/speakers/:id', () => {
    it('returns a specific speaker by id', async () => {
      const res = await app.request('/api/v1/speakers/speaker-jane-doe')
      expect(res.status).toBe(200)

      const json = await res.json()
      expect(json.data.id).toBe('speaker-jane-doe')
      expect(json.data.fullName).toBe('Jane Doe')
    })

    it('returns 404 for non-existent speaker', async () => {
      const res = await app.request('/api/v1/speakers/nonexistent')
      expect(res.status).toBe(404)

      const json = await res.json()
      expect(json.error).toBe('Not found')
      expect(json.code).toBe('NOT_FOUND')
    })
  })
})
