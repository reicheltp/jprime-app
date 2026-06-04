import { createMiddleware } from 'hono/factory'
import { verifyToken } from '../auth/jwt'

declare module 'hono' {
  interface ContextVariableMap {
    userId: string
    userEmail: string
  }
}

export const requireAuth = createMiddleware(async (c, next) => {
  const header = c.req.header('Authorization')
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return c.json({ error: 'Authorization required', code: 'UNAUTHORIZED' }, 401)
  }

  try {
    const payload = await verifyToken(token)
    const userId = typeof payload.sub === 'string' ? payload.sub : null
    const userEmail = typeof payload.email === 'string' ? payload.email : null
    if (!userId || !userEmail) throw new Error('Invalid payload')
    c.set('userId', userId)
    c.set('userEmail', userEmail)
    return await next()
  } catch {
    return c.json({ error: 'Invalid or expired token', code: 'INVALID_TOKEN' }, 401)
  }
})
