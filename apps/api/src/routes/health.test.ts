import { describe, it, expect, beforeEach } from 'bun:test'
import { Hono } from 'hono'
import { registerHealthRoute } from './health'
import { Cache } from '../providers/cache'

/**
 * SPEC-004 Conference Data API
 * Tests: AC#7
 */

describe('Health Route', () => {
  let app: Hono
  let cache: Cache

  beforeEach(() => {
    app = new Hono()
    cache = new Cache()
    registerHealthRoute(app, cache)
  })

  describe('GET /health', () => {
    it('returns 200 status', async () => {
      const res = await app.request('/health')
      expect(res.status).toBe(200)
    })

    it('returns status: ok', async () => {
      const res = await app.request('/health')
      const json = await res.json()
      expect(json.status).toBe('ok')
    })

    it('returns cachedAt as null when cache is empty', async () => {
      const res = await app.request('/health')
      const json = await res.json()
      expect(json.cachedAt).toBeNull()
    })

    it('returns cacheExpired as null when cache is empty', async () => {
      const res = await app.request('/health')
      const json = await res.json()
      expect(json.cacheExpired).toBeNull()
    })

    it('returns cachedAt timestamp when sessions are cached', async () => {
      const now = new Date()
      cache.set('sessions', [{ id: 'test' }], 60000, now.getTime())

      const res = await app.request('/health')
      const json = await res.json()
      expect(json.cachedAt).toBe(now.toISOString())
      expect(json.cacheExpired).toBe(false)
    })

    it('returns cacheExpired true when sessions cache is stale', async () => {
      // Set cache with very short TTL so it expires immediately
      cache.set('sessions', [{ id: 'test' }], 1) // 1ms TTL
      
      // Wait for it to expire
      await new Promise(resolve => setTimeout(resolve, 10))

      const res = await app.request('/health')
      const json = await res.json()
      expect(json.cachedAt).not.toBeNull()
      expect(json.cacheExpired).toBe(true)
    })

    it('returns content-type application/json', async () => {
      const res = await app.request('/health')
      expect(res.headers.get('content-type')).toContain('application/json')
    })
  })
})
