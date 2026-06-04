import type { Hono } from 'hono'
import { requireAuth } from '../middleware/auth'
import { db, type UserWithProfile } from '../db/index'

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
}
