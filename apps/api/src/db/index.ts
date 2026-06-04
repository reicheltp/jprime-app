import { Database } from 'bun:sqlite'

export interface User {
  id: string
  email: string
  created_at: number
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

db.exec(`
  PRAGMA journal_mode=WAL;

  CREATE TABLE IF NOT EXISTS users (
    id         TEXT PRIMARY KEY,
    email      TEXT UNIQUE NOT NULL,
    created_at INTEGER NOT NULL
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
