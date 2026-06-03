import { Hono } from 'hono'
import { registerCors } from './middleware/cors'
import { registerSessionRoutes } from './routes/sessions'
import { registerSpeakerRoutes } from './routes/speakers'
import { registerHealthRoute } from './routes/health'
import { JsonDataProvider } from './providers/JsonDataProvider'
import { Cache } from './providers/cache'

const app = new Hono()
const cache = new Cache()

const provider = new JsonDataProvider()

registerCors(app)
registerHealthRoute(app, cache)
registerSessionRoutes(app, provider)
registerSpeakerRoutes(app, provider)

app.notFound((c) => c.json({ error: 'Not found', code: 'NOT_FOUND' }, 404))
app.onError((err, c) => {
  const isDev = process.env.NODE_ENV !== 'production'
  return c.json(
    { error: 'Internal error', code: 'INTERNAL_ERROR', ...(isDev && { detail: err.message }) },
    500
  )
})

const port = Number(process.env.PORT ?? 3000)
console.log(`API server running on http://localhost:${port}`)

export default {
  port,
  fetch: app.fetch,
}
