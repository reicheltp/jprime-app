import type { Hono } from 'hono'
import type { Cache } from '../providers/cache'

export function registerHealthRoute(app: Hono, cache: Cache): void {
  app.get('/health', (c) => {
    const entry = cache.getStale<unknown>('sessions')
    return c.json({
      status: 'ok',
      cachedAt: entry ? entry.fetchedAt.toISOString() : null,
      cacheExpired: entry ? cache.isStale('sessions') : null,
    })
  })
}
