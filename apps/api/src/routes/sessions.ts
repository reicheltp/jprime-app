import type { Hono } from 'hono'
import type { DataProvider } from '../providers/DataProvider'

export function registerSessionRoutes(app: Hono, provider: DataProvider): void {
  app.get('/api/v1/sessions', async (c) => {
    const sessions = await provider.getSessions()
    return c.json({ data: sessions, meta: { total: sessions.length } })
  })

  app.get('/api/v1/sessions/:id', async (c) => {
    const session = await provider.getSession(c.req.param('id'))
    if (!session) {
      return c.json({ error: 'Not found', code: 'NOT_FOUND' }, 404)
    }
    return c.json({ data: session })
  })
}
