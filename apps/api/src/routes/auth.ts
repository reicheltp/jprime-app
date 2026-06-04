import type { Hono } from 'hono'
import { sign, verify } from 'hono/jwt'
import { randomUUID } from 'node:crypto'
import { db, type User, type OtpToken } from '../db/index'
import { generateOtp, hashOtp } from '../auth/otp'
import { sendOtpEmail } from '../email/index'

const OTP_TTL_MS = 10 * 60 * 1000
const JWT_TTL_SECONDS = 7 * 24 * 60 * 60
const OTP_RATE_LIMIT = 3
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function secret(): string {
  return process.env.JWT_SECRET ?? 'dev-secret-change-in-production'
}

export function registerAuthRoutes(app: Hono): void {
  // POST /api/v1/auth/otp/request
  app.post('/api/v1/auth/otp/request', async (c) => {
    let body: Record<string, unknown>
    try { body = await c.req.json<Record<string, unknown>>() } catch { body = {} }
    const email =
      typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!email || !EMAIL_RE.test(email)) {
      return c.json({ error: 'Valid email required', code: 'INVALID_EMAIL' }, 400)
    }

    const windowStart = Date.now() - OTP_TTL_MS
    const recent = db
      .query<{ count: number }, [string, number]>(
        'SELECT COUNT(*) as count FROM otp_tokens WHERE email = ? AND created_at > ?'
      )
      .get(email, windowStart)

    if ((recent?.count ?? 0) >= OTP_RATE_LIMIT) {
      return c.json(
        { error: 'Too many requests, please wait 10 minutes', code: 'RATE_LIMITED' },
        429
      )
    }

    const code = generateOtp()
    const now = Date.now()

    db.query(
      'INSERT INTO otp_tokens (id, email, code_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?)'
    ).run(randomUUID(), email, hashOtp(code), now + OTP_TTL_MS, now)

    await sendOtpEmail(email, code)

    const response: Record<string, string> = { message: 'Code sent to your email' }
    if (process.env.OTP_EXPOSE_IN_RESPONSE === 'true') {
      response.code = code
    }

    return c.json(response)
  })

  // POST /api/v1/auth/otp/verify
  app.post('/api/v1/auth/otp/verify', async (c) => {
    let body: Record<string, unknown>
    try { body = await c.req.json<Record<string, unknown>>() } catch { body = {} }
    const email =
      typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const code = typeof body.code === 'string' ? body.code.trim() : ''

    if (!email || !code) {
      return c.json({ error: 'email and code are required', code: 'INVALID_REQUEST' }, 400)
    }

    const now = Date.now()
    const token = db
      .query<OtpToken, [string, number]>(
        'SELECT * FROM otp_tokens WHERE email = ? AND used = 0 AND expires_at > ? ORDER BY created_at DESC LIMIT 1'
      )
      .get(email, now)

    if (!token || token.code_hash !== hashOtp(code)) {
      return c.json({ error: 'Invalid or expired code', code: 'INVALID_CODE' }, 401)
    }

    db.query('UPDATE otp_tokens SET used = 1 WHERE id = ?').run(token.id)

    let user = db
      .query<User, [string]>('SELECT * FROM users WHERE email = ?')
      .get(email)

    if (!user) {
      const id = randomUUID()
      db.query(
        'INSERT INTO users (id, email, created_at) VALUES (?, ?, ?)'
      ).run(id, email, now)
      user = { id, email, created_at: now }
    }

    const jwt = await sign(
      {
        sub: user.id,
        email: user.email,
        iat: Math.floor(now / 1000),
        exp: Math.floor(now / 1000) + JWT_TTL_SECONDS,
      },
      secret(),
      'HS256'
    )

    return c.json({ data: { token: jwt, user: { id: user.id, email: user.email } } })
  })

  // GET /api/v1/auth/me
  app.get('/api/v1/auth/me', async (c) => {
    const header = c.req.header('Authorization')
    const token = header?.startsWith('Bearer ') ? header.slice(7) : null

    if (!token) {
      return c.json({ error: 'Authorization header required', code: 'UNAUTHORIZED' }, 401)
    }

    try {
      const payload = await verify(token, secret(), 'HS256')
      const sub = typeof payload.sub === 'string' ? payload.sub : null
      const email = typeof payload.email === 'string' ? payload.email : null
      if (!sub || !email) throw new Error('Invalid payload')
      return c.json({ data: { user: { id: sub, email } } })
    } catch {
      return c.json({ error: 'Invalid or expired token', code: 'INVALID_TOKEN' }, 401)
    }
  })
}
