import { sign, verify } from 'hono/jwt'
import type { JWTPayload } from 'hono/utils/jwt/types'

export function jwtSecret(): string {
  return process.env.JWT_SECRET ?? 'dev-secret-change-in-production'
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return sign(payload, jwtSecret(), 'HS256')
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  return verify(token, jwtSecret(), 'HS256')
}
