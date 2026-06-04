import { cors } from 'hono/cors'
import type { Hono } from 'hono'

export function registerCors(app: Hono): void {
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['*']

  app.use(
    '*',
    cors({
      origin:
        allowedOrigins.length === 1 && allowedOrigins[0] === '*'
          ? '*'
          : (origin) => (allowedOrigins.includes(origin) ? origin : (allowedOrigins[0] ?? '')),
      allowMethods: ['GET', 'POST', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Accept', 'Authorization'],
      maxAge: 600,
    })
  )
}
