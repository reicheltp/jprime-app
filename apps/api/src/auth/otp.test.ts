import { describe, it, expect } from 'bun:test'
import { generateOtp, hashOtp } from './otp'

/**
 * SPEC-005 Auth — Magic Link / OTP
 * Tests: OTP generation and hashing helpers
 */

describe('generateOtp', () => {
  it('returns a string', () => {
    expect(typeof generateOtp()).toBe('string')
  })

  it('returns exactly 6 characters', () => {
    for (let i = 0; i < 20; i++) {
      expect(generateOtp()).toHaveLength(6)
    }
  })

  it('contains only digit characters', () => {
    for (let i = 0; i < 20; i++) {
      expect(generateOtp()).toMatch(/^\d{6}$/)
    }
  })

  it('returns values in range 000000–999999', () => {
    for (let i = 0; i < 20; i++) {
      const num = parseInt(generateOtp(), 10)
      expect(num).toBeGreaterThanOrEqual(0)
      expect(num).toBeLessThanOrEqual(999_999)
    }
  })
})

describe('hashOtp', () => {
  it('returns a 64-character hex string (SHA-256)', () => {
    const hash = hashOtp('123456')
    expect(hash).toHaveLength(64)
    expect(hash).toMatch(/^[0-9a-f]{64}$/)
  })

  it('is deterministic — same input produces the same hash', () => {
    expect(hashOtp('123456')).toBe(hashOtp('123456'))
    expect(hashOtp('000000')).toBe(hashOtp('000000'))
  })

  it('produces different hashes for different codes', () => {
    expect(hashOtp('000000')).not.toBe(hashOtp('999999'))
    expect(hashOtp('123456')).not.toBe(hashOtp('654321'))
  })

  it('matches the known SHA-256 digest for "123456"', () => {
    expect(hashOtp('123456')).toBe(
      '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'
    )
  })
})
