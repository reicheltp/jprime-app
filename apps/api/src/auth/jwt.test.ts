import { describe, it, expect } from 'bun:test'
import { signToken, verifyToken, jwtSecret } from './jwt'

/**
 * SPEC-005 Auth — Magic Link / OTP
 * Tests: JWT signing and verification helpers
 */

const now = Math.floor(Date.now() / 1000)

const validPayload = {
  sub: 'user-abc-123',
  email: 'test@example.com',
  iat: now,
  exp: now + 3600,
}

describe('jwtSecret', () => {
  it('returns the JWT_SECRET env var when set', () => {
    const original = process.env.JWT_SECRET
    process.env.JWT_SECRET = 'my-custom-secret'
    expect(jwtSecret()).toBe('my-custom-secret')
    if (original === undefined) {
      delete process.env.JWT_SECRET
    } else {
      process.env.JWT_SECRET = original
    }
  })

  it('returns the dev default when JWT_SECRET is unset', () => {
    const original = process.env.JWT_SECRET
    delete process.env.JWT_SECRET
    expect(jwtSecret()).toBe('dev-secret-change-in-production')
    if (original !== undefined) process.env.JWT_SECRET = original
  })
})

describe('signToken', () => {
  it('returns a non-empty string', async () => {
    const token = await signToken(validPayload)
    expect(typeof token).toBe('string')
    expect(token.length).toBeGreaterThan(0)
  })

  it('returns a three-segment JWT (header.claims.signature)', async () => {
    const token = await signToken(validPayload)
    expect(token.split('.').length).toBe(3)
  })
})

describe('verifyToken', () => {
  it('returns the original sub claim', async () => {
    const token = await signToken(validPayload)
    const result = await verifyToken(token)
    expect(result.sub).toBe('user-abc-123')
  })

  it('returns the original email claim', async () => {
    const token = await signToken(validPayload)
    const result = await verifyToken(token)
    expect(result.email).toBe('test@example.com')
  })

  it('throws on a tampered signature', async () => {
    const token = await signToken(validPayload)
    const [header, claims] = token.split('.')
    const tampered = `${header}.${claims}.badsignature`
    await expect(verifyToken(tampered)).rejects.toThrow()
  })

  it('throws on a completely invalid token', async () => {
    await expect(verifyToken('not.a.jwt')).rejects.toThrow()
  })

  it('throws on an expired token', async () => {
    const expiredPayload = {
      sub: 'user-expired',
      iat: now - 7200,
      exp: now - 3600,
    }
    const token = await signToken(expiredPayload)
    await expect(verifyToken(token)).rejects.toThrow()
  })
})
