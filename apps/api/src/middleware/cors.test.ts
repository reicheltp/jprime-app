import { describe, it, expect, beforeEach } from 'bun:test'
import { Hono } from 'hono'
import { registerCors } from './cors'

/**
 * SPEC-004 Conference Data API
 * Tests: AC#8 (CORS headers on all requests)
 */

describe('CORS Middleware', () => {
  let app: Hono

  beforeEach(() => {
    app = new Hono()
    registerCors(app)

    // Add a test route
    app.get('/test', (c) => c.json({ message: 'ok' }))
  })

  describe('CORS headers on OPTIONS', () => {
    it('includes Access-Control-Allow-Origin on preflight', async () => {
      const res = await app.request('/test', { method: 'OPTIONS' })
      expect(res.headers.get('access-control-allow-origin')).toBe('*')
    })

    it('includes Access-Control-Allow-Methods on preflight', async () => {
      const res = await app.request('/test', { method: 'OPTIONS' })
      expect(res.headers.get('access-control-allow-methods')).toBe('GET,OPTIONS')
    })

    it('includes Access-Control-Allow-Headers on preflight', async () => {
      const res = await app.request('/test', { method: 'OPTIONS' })
      expect(res.headers.get('access-control-allow-headers')).toBe('Content-Type,Accept')
    })

    it('returns 204 for OPTIONS preflight', async () => {
      const res = await app.request('/test', { method: 'OPTIONS' })
      expect(res.status).toBe(204)
    })
  })

  describe('Successful requests', () => {
    it('returns 200 for GET requests', async () => {
      const res = await app.request('/test')
      expect(res.status).toBe(200)
    })
  })
})
