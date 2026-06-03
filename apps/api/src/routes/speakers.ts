import type { Hono } from 'hono'
import type { DataProvider } from '../providers/DataProvider'

export function registerSpeakerRoutes(app: Hono, provider: DataProvider): void {
  app.get('/api/v1/speakers', async (c) => {
    const speakers = await provider.getSpeakers()
    return c.json({ data: speakers, meta: { total: speakers.length } })
  })

  app.get('/api/v1/speakers/:id', async (c) => {
    const speaker = await provider.getSpeaker(c.req.param('id'))
    if (!speaker) {
      return c.json({ error: 'Not found', code: 'NOT_FOUND' }, 404)
    }
    return c.json({ data: speaker })
  })
}
