import type { Hono } from 'hono'
import { requireAuth } from '../middleware/auth'
import { db, type UserWithProfile } from '../db/index'

// Characters allowed in connection codes (excluding similar-looking: 0,1,O,I,L)
const CONNECT_CODE_CHARS = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'
const CONNECT_CODE_LENGTH = 5

function generateConnectCode(): string {
  let code = ''
  for (let i = 0; i < CONNECT_CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * CONNECT_CODE_CHARS.length)
    code += CONNECT_CODE_CHARS[randomIndex]
  }
  return code
}

interface ProfileResponse {
  id: string
  email: string
  displayName: string | null
  company: string | null
  bio: string | null
  avatarUrl: string | null
  linkedinUrl: string | null
  twitterUrl: string | null
  githubUrl: string | null
  websiteUrl: string | null
  connectionCode: string | null
}

function toResponse(u: UserWithProfile): ProfileResponse {
  return {
    id: u.id,
    email: u.email,
    displayName: u.display_name,
    company: u.company,
    bio: u.bio,
    avatarUrl: u.avatar_url,
    linkedinUrl: u.linkedin_url,
    twitterUrl: u.twitter_url,
    githubUrl: u.github_url,
    websiteUrl: u.website_url,
    connectionCode: u.connection_code,
  }
}

function isHttpsUrl(value: string): boolean {
  try {
    const u = new URL(value)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

function nullify(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export function registerProfileRoutes(app: Hono): void {
  // GET /api/v1/profile
  app.get('/api/v1/profile', requireAuth, (c) => {
    const userId = c.get('userId')
    const user = db
      .query<UserWithProfile, [string]>('SELECT * FROM users WHERE id = ?')
      .get(userId)

    if (!user) return c.json({ error: 'User not found', code: 'NOT_FOUND' }, 404)
    return c.json({ data: toResponse(user) })
  })

  // PUT /api/v1/profile
  app.put('/api/v1/profile', requireAuth, async (c) => {
    const userId = c.get('userId')

    let body: Record<string, unknown>
    try { body = await c.req.json<Record<string, unknown>>() } catch { body = {} }

    const displayName = nullify(body.displayName)
    const company = nullify(body.company)
    const bio = nullify(body.bio)
    const avatarUrl = nullify(body.avatarUrl)
    const linkedinUrl = nullify(body.linkedinUrl)
    const twitterUrl = nullify(body.twitterUrl)
    const githubUrl = nullify(body.githubUrl)
    const websiteUrl = nullify(body.websiteUrl)

    // Validate lengths
    if (displayName && displayName.length > 100) {
      return c.json({ error: 'Display name must be 100 characters or fewer', code: 'VALIDATION_ERROR', field: 'displayName' }, 400)
    }
    if (company && company.length > 100) {
      return c.json({ error: 'Company must be 100 characters or fewer', code: 'VALIDATION_ERROR', field: 'company' }, 400)
    }
    if (bio && bio.length > 280) {
      return c.json({ error: 'Bio must be 280 characters or fewer', code: 'VALIDATION_ERROR', field: 'bio' }, 400)
    }

    // Validate URLs
    const urlFields: Array<[string | null, string]> = [
      [avatarUrl, 'avatarUrl'],
      [linkedinUrl, 'linkedinUrl'],
      [twitterUrl, 'twitterUrl'],
      [githubUrl, 'githubUrl'],
      [websiteUrl, 'websiteUrl'],
    ]
    for (const [url, field] of urlFields) {
      if (url !== null && !isHttpsUrl(url)) {
        return c.json({ error: `${field} must be a valid URL`, code: 'VALIDATION_ERROR', field }, 400)
      }
    }

    db.query(`
      UPDATE users SET
        display_name = ?,
        company      = ?,
        bio          = ?,
        avatar_url   = ?,
        linkedin_url = ?,
        twitter_url  = ?,
        github_url   = ?,
        website_url  = ?
      WHERE id = ?
    `).run(displayName, company, bio, avatarUrl, linkedinUrl, twitterUrl, githubUrl, websiteUrl, userId)

    const updated = db
      .query<UserWithProfile, [string]>('SELECT * FROM users WHERE id = ?')
      .get(userId)

    if (!updated) return c.json({ error: 'User not found', code: 'NOT_FOUND' }, 404)
    return c.json({ data: toResponse(updated) })
  })

  // GET /api/v1/profile/connect-code - Get or create user's connection code
  app.get('/api/v1/profile/connect-code', requireAuth, (c) => {
    const userId = c.get('userId')
    const userEmail = c.get('userEmail')
    
    // Check if user already has a connection code
    const existing = db
      .query<{ connection_code: string | null }, [string]>(`
        SELECT connection_code FROM users WHERE id = ?
      `)
      .get(userId)

    if (!existing) return c.json({ error: 'User not found', code: 'NOT_FOUND' }, 404)
    
    if (existing.connection_code) {
      return c.json({ data: { code: existing.connection_code } })
    }
    
    // Generate a new unique connection code
    let code: string
    let isUnique = false
    
    // Try up to 10 times to generate a unique code
    for (let attempt = 0; attempt < 10; attempt++) {
      code = generateConnectCode()
      const existingCode = db
        .query<{ count: number }, [string]>(`
          SELECT COUNT(*) as count FROM users WHERE connection_code = ?
        `)
        .get(code)
      
      if ((existingCode?.count ?? 0) === 0) {
        isUnique = true
        break
      }
    }

    if (!isUnique) {
      return c.json({ error: 'Failed to generate unique code, please try again', code: 'SERVER_ERROR' }, 500)
    }

    // Save the connection code
    db.query(`
      UPDATE users SET connection_code = ? WHERE id = ?
    `).run(code, userId)

    return c.json({ data: { code } })
  })

  // PUT /api/v1/profile/connect-code - Generate connection code for user
  app.put('/api/v1/profile/connect-code', requireAuth, (c) => {
    const userId = c.get('userId')
    const userEmail = c.get('userEmail')
    
    // Check if user already has a connection code
    const existing = db
      .query<{ connection_code: string | null }, [string]>(`
        SELECT connection_code FROM users WHERE id = ?
      `)
      .get(userId)

    if (existing?.connection_code) {
      // User already has a code, return it
      return c.json({ data: { code: existing.connection_code } })
    }

    // Generate a new unique connection code
    let code: string
    let isUnique = false
    
    // Try up to 10 times to generate a unique code
    for (let attempt = 0; attempt < 10; attempt++) {
      code = generateConnectCode()
      const existingCode = db
        .query<{ count: number }, [string]>(`
          SELECT COUNT(*) as count FROM users WHERE connection_code = ?
        `)
        .get(code)
      
      if ((existingCode?.count ?? 0) === 0) {
        isUnique = true
        break
      }
    }

    if (!isUnique) {
      return c.json({ error: 'Failed to generate unique code, please try again', code: 'SERVER_ERROR' }, 500)
    }

    // Save the connection code
    db.query(`
      UPDATE users SET connection_code = ? WHERE id = ?
    `).run(code, userId)

    return c.json({ data: { code } })
  })

  // GET /api/v1/profile/connect-code/check - Check if a code is available
  app.get('/api/v1/profile/connect-code/check', requireAuth, (c) => {
    const userId = c.get('userId')
    const code = c.req.query('code')?.toUpperCase() ?? null
    
    if (!code) {
      return c.json({ error: 'Code is required', code: 'INVALID_REQUEST' }, 400)
    }

    // Check if code is already in use by someone else
    const existing = db
      .query<{ id: string }, [string]>(`
        SELECT id FROM users WHERE connection_code = ?
      `)
      .get(code)

    if (existing && existing.id !== userId) {
      return c.json({ data: { available: false } })
    }

    return c.json({ data: { available: true } })
  })
}
