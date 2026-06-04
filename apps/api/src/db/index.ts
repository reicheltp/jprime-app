import { Database } from 'bun:sqlite'

export interface User {
  id: string
  email: string
  created_at: number
}

export interface UserWithProfile extends User {
  display_name: string | null
  company: string | null
  bio: string | null
  avatar_url: string | null
  linkedin_url: string | null
  twitter_url: string | null
  github_url: string | null
  website_url: string | null
}

export interface OtpToken {
  id: string
  email: string
  code_hash: string
  expires_at: number
  used: number
  created_at: number
}

const dbPath = process.env.DATABASE_PATH ?? './jprime-auth.db'

export const db = new Database(dbPath, { create: true })

// Fresh install: full schema including profile columns
db.exec(`
  PRAGMA journal_mode=WAL;

  CREATE TABLE IF NOT EXISTS users (
    id           TEXT PRIMARY KEY,
    email        TEXT UNIQUE NOT NULL,
    display_name TEXT,
    company      TEXT,
    bio          TEXT,
    avatar_url   TEXT,
    linkedin_url TEXT,
    twitter_url  TEXT,
    github_url   TEXT,
    website_url  TEXT,
    created_at   INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS otp_tokens (
    id         TEXT PRIMARY KEY,
    email      TEXT NOT NULL,
    code_hash  TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    used       INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_otp_email
    ON otp_tokens(email, used, expires_at);
`)

// Migration for existing DBs — each ALTER fails silently if column already exists
const profileColumns = [
  'display_name TEXT',
  'company TEXT',
  'bio TEXT',
  'avatar_url TEXT',
  'linkedin_url TEXT',
  'twitter_url TEXT',
  'github_url TEXT',
  'website_url TEXT',
]
for (const col of profileColumns) {
  try { db.exec(`ALTER TABLE users ADD COLUMN ${col}`) } catch { /* already exists */ }
}
