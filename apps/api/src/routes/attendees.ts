import type { Hono } from 'hono'
import { db } from '../db/index'

export interface AttendeeProfile {
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
  connectCode: string | null
}

function toAttendeeProfile(u: any): AttendeeProfile {
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
    connectCode: u.connection_code,
  }
}

export function registerAttendeeRoutes(app: Hono): void {
  // GET /api/v1/attendees - List all attendees with profiles
  app.get('/api/v1/attendees', (c) => {
    const attendees = db
      .query<any, []>('SELECT * FROM users WHERE display_name IS NOT NULL ORDER BY display_name ASC')
      .all()
      .map(toAttendeeProfile)
    
    return c.json({ data: attendees })
  })

  // GET /api/v1/attendees/:email - Get a specific attendee by email
  app.get('/api/v1/attendees/:email', (c) => {
    const email = c.req.param('email')
    const attendee = db
      .query<any, [string]>('SELECT * FROM users WHERE email = ?')
      .get(email)
    
    if (!attendee) {
      return c.json({ error: 'Attendee not found', code: 'NOT_FOUND' }, 404)
    }
    
    return c.json({ data: toAttendeeProfile(attendee) })
  })

  // GET /api/v1/attendees/by-code/:code - Get attendee by connection code
  app.get('/api/v1/attendees/by-code/:code', (c) => {
    const code = c.req.param('code').toUpperCase()
    const attendee = db
      .query<any, [string]>('SELECT * FROM users WHERE connection_code = ?')
      .get(code)
    
    if (!attendee) {
      return c.json({ error: 'Attendee not found', code: 'NOT_FOUND' }, 404)
    }
    
    return c.json({ 
      data: {
        attendeeId: attendee.id,
        email: attendee.email,
        displayName: attendee.display_name ?? attendee.email.split('@')[0],
        connectCode: attendee.connection_code,
      }
    })
  })

  // POST /api/v1/attendees/by-codes - Batch lookup by connection codes
  app.post('/api/v1/attendees/by-codes', async (c) => {
    let body: Record<string, unknown>
    try { body = await c.req.json<Record<string, unknown>>() } catch { body = {} }
    
    const codesRaw = body.codes
    if (!Array.isArray(codesRaw)) {
      return c.json({ error: 'codes array required', code: 'INVALID_REQUEST' }, 400)
    }
    
    const codes = codesRaw.map((c: unknown) => 
      typeof c === 'string' ? c.trim().toUpperCase() : ''
    ).filter(Boolean)
    
    if (codes.length === 0) {
      return c.json({ data: [] })
    }
    
    const placeholders = codes.map(() => '?').join(',')
    const attendees = db
      .query<any, string[]>(`
        SELECT * FROM users 
        WHERE connection_code IN (${placeholders})
      `)
      .all(...codes)
      .map(toAttendeeProfile)
    
    return c.json({ data: attendees })
  })
}
