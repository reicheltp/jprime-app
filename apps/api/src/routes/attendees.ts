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
}
