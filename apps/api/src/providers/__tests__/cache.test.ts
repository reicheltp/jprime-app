import { describe, it, expect, beforeEach } from 'bun:test'
import { Cache } from '../cache'

describe('Cache', () => {
  let cache: Cache

  beforeEach(() => {
    cache = new Cache()
  })

  describe('set and get', () => {
    it('returns data when not expired', () => {
      cache.set('key1', { value: 'test' }, 1000)
      const result = cache.get<{ value: string }>('key1')
      expect(result).not.toBeNull()
      expect(result?.data.value).toBe('test')
    })

    it('returns null for non-existent key', () => {
      const result = cache.get<string>('nonexistent')
      expect(result).toBeNull()
    })

    it('returns null when expired', () => {
      cache.set('key1', 'expired', 1) // 1ms TTL
      // Wait for expiry
      const start = Date.now()
      while (Date.now() - start < 5) { /* wait */ }
      
      const result = cache.get<string>('key1')
      expect(result).toBeNull()
    })
  })

  describe('getStale', () => {
    it('returns data even when expired', () => {
      cache.set('key1', 'stale-data', 1)
      // Wait for expiry
      const start = Date.now()
      while (Date.now() - start < 5) { /* wait */ }
      
      const result = cache.getStale<string>('key1')
      expect(result).not.toBeNull()
      expect(result?.data).toBe('stale-data')
    })

    it('returns null for non-existent key', () => {
      const result = cache.getStale<string>('nonexistent')
      expect(result).toBeNull()
    })
  })

  describe('isStale', () => {
    it('returns false when not expired', () => {
      cache.set('key1', 'fresh', 10000)
      expect(cache.isStale('key1')).toBeFalse()
    })

    it('returns true when expired', () => {
      cache.set('key1', 'stale', 1)
      // Wait for expiry
      const start = Date.now()
      while (Date.now() - start < 5) { /* wait */ }
      
      expect(cache.isStale('key1')).toBeTrue()
    })

    it('returns true for non-existent key', () => {
      expect(cache.isStale('nonexistent')).toBeTrue()
    })
  })
})
