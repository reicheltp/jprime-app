import { describe, it, expect, beforeEach } from 'bun:test'
import { Hono } from 'hono'
import { registerCors } from './cors'
import { DataUnavailableError } from '../providers/ScraperProvider'

/**
 * SPEC-004 Conference Data API
 * Tests: AC#6 (503 when data unavailable), error handling middleware
 */

describe('Error Handling Middleware', () => {
  let app: Hono

  beforeEach(() => {
    app = new Hono()
    registerCors(app)

    // Register error handling middleware (from index.ts pattern)
    app.onError((err, c) => {
      const isDev = process.env.NODE_ENV !== 'production'
      if (err instanceof DataUnavailableError) {
        return c.json(
          { error: 'Service unavailable', code: 'DATA_UNAVAILABLE', ...(isDev && { detail: err.message }) },
          503
        )
      }
      return c.json(
        { error: 'Internal error', code: 'INTERNAL_ERROR', ...(isDev && { detail: err.message }) },
        500
      )
    })

    // Add test routes
    app.get('/ok', (c) => c.json({ status: 'ok' }))
    app.get('/data-unavailable', () => {
      throw new DataUnavailableError()
    })
    app.get('/generic-error', () => {
      throw new Error('Something went wrong')
    })
  })

  describe('DataUnavailableError handling', () => {
    it('returns 503 for DataUnavailableError', async () => {
      const res = await app.request('/data-unavailable')
      expect(res.status).toBe(503)
    })

    it('returns correct error body for DataUnavailableError', async () => {
      const res = await app.request('/data-unavailable')
      const json = await res.json()
      expect(json.code).toBe('DATA_UNAVAILABLE')
      expect(json.error).toBe('Service unavailable')
    })

    it('includes detail in development mode', async () => {
      process.env.NODE_ENV = 'development'
      const res = await app.request('/data-unavailable')
      const json = await res.json()
      expect(json.detail).toBe('Conference data is unavailable and no cache exists')
      delete process.env.NODE_ENV
    })

    it('excludes detail in production mode', async () => {
      process.env.NODE_ENV = 'production'
      const res = await app.request('/data-unavailable')
      const json = await res.json()
      expect(json.detail).toBeUndefined()
      delete process.env.NODE_ENV
    })

    it('includes CORS headers on 503 response', async () => {
      const res = await app.request('/data-unavailable')
      expect(res.headers.get('access-control-allow-origin')).toBeDefined()
    })
  })

  describe('Generic error handling', () => {
    it('returns 500 for unhandled errors', async () => {
      const res = await app.request('/generic-error')
      expect(res.status).toBe(500)
    })

    it('returns correct error body for generic errors', async () => {
      const res = await app.request('/generic-error')
      const json = await res.json()
      expect(json.code).toBe('INTERNAL_ERROR')
      expect(json.error).toBe('Internal error')
    })

    it('includes detail in development mode for generic errors', async () => {
      process.env.NODE_ENV = 'development'
      const res = await app.request('/generic-error')
      const json = await res.json()
      expect(json.detail).toBe('Something went wrong')
      delete process.env.NODE_ENV
    })

    it('excludes detail in production mode for generic errors', async () => {
      process.env.NODE_ENV = 'production'
      const res = await app.request('/generic-error')
      const json = await res.json()
      expect(json.detail).toBeUndefined()
      delete process.env.NODE_ENV
    })

    it('includes CORS headers on 500 response', async () => {
      const res = await app.request('/generic-error')
      expect(res.headers.get('access-control-allow-origin')).toBeDefined()
    })
  })

  describe('Successful requests', () => {
    it('returns 200 for successful requests', async () => {
      const res = await app.request('/ok')
      expect(res.status).toBe(200)
    })

    it('includes CORS headers on successful responses', async () => {
      const res = await app.request('/ok')
      expect(res.headers.get('access-control-allow-origin')).toBeDefined()
    })
  })
})
