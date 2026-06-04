import { describe, expect, it } from 'bun:test'
import {
  CONNECT_CODE_CHARS,
  CONNECT_CODE_LENGTH,
  CONNECT_CODE_REGEX,
  TOTAL_CODE_COMBINATIONS,
  validateConnectCode,
  formatConnectCode,
  generateRandomConnectCode,
  isValidConnectCodeChar,
} from './connectCodes'

describe('Connect Codes Constants', () => {
  it('CONNECT_CODE_CHARS has correct length', () => {
    expect(CONNECT_CODE_CHARS.length).toBe(31)
  })

  it('CONNECT_CODE_CHARS contains only allowed characters', () => {
    const expectedChars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'
    expect(CONNECT_CODE_CHARS).toBe(expectedChars)
  })

  it('CONNECT_CODE_CHARS excludes ambiguous characters', () => {
    const ambiguousChars = ['0', '1', 'I', 'O', 'L', 'i', 'o', 'l']
    for (const char of ambiguousChars) {
      expect(CONNECT_CODE_CHARS).not.toContain(char)
    }
  })

  it('CONNECT_CODE_LENGTH is 5', () => {
    expect(CONNECT_CODE_LENGTH).toBe(5)
  })

  it('TOTAL_CODE_COMBINATIONS calculates correctly', () => {
    expect(TOTAL_CODE_COMBINATIONS).toBe(31 ** 5)
    expect(TOTAL_CODE_COMBINATIONS).toBe(28629151)
  })

  it('CONNECT_CODE_REGEX matches valid codes', () => {
    expect(CONNECT_CODE_REGEX.test('ABCDE')).toBe(true)
    expect(CONNECT_CODE_REGEX.test('23456')).toBe(true)
    expect(CONNECT_CODE_REGEX.test('2A3B4')).toBe(true)
    expect(CONNECT_CODE_REGEX.test('ABCDE')).toBe(true)
  })

  it('CONNECT_CODE_REGEX rejects invalid codes', () => {
    expect(CONNECT_CODE_REGEX.test('ABCDEFG')).toBe(false) // Too long
    expect(CONNECT_CODE_REGEX.test('ABCD')).toBe(false) // Too short
    expect(CONNECT_CODE_REGEX.test('abcde')).toBe(true) // Case insensitive
    expect(CONNECT_CODE_REGEX.test('01234')).toBe(false) // Contains 0
    expect(CONNECT_CODE_REGEX.test('12345')).toBe(false) // Contains 1
    expect(CONNECT_CODE_REGEX.test('OABCD')).toBe(false) // Contains O
    expect(CONNECT_CODE_REGEX.test('IABCD')).toBe(false) // Contains I
    expect(CONNECT_CODE_REGEX.test('LABCD')).toBe(false) // Contains L
    expect(CONNECT_CODE_REGEX.test('2ABCD')).toBe(true) // Valid
    expect(CONNECT_CODE_REGEX.test('MABCD')).toBe(true) // M is valid
    expect(CONNECT_CODE_REGEX.test('JKMNP')).toBe(true) // All valid chars
  })
})

describe('validateConnectCode', () => {
  it('accepts valid codes', () => {
    const result = validateConnectCode('ABCDE')
    expect(result.valid).toBe(true)
    expect(result.code).toBe('ABCDE')
  })

  it('converts to uppercase', () => {
    const result = validateConnectCode('abcde')
    expect(result.valid).toBe(true)
    expect(result.code).toBe('ABCDE')
  })

  it('rejects empty string', () => {
    const result = validateConnectCode('')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Code is required')
  })

  it('rejects whitespace-only string', () => {
    const result = validateConnectCode('   ')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Code is required')
  })

  it('rejects codes that are too short', () => {
    const result = validateConnectCode('ABCD')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Code must be 5 characters')
  })

  it('rejects codes that are too long', () => {
    const result = validateConnectCode('ABCDEFG')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Code must be 5 characters')
  })

  it('rejects codes with invalid characters (0)', () => {
    const result = validateConnectCode('ABCD0')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Code contains invalid characters')
  })

  it('rejects codes with invalid characters (1)', () => {
    const result = validateConnectCode('1BCDE')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Code contains invalid characters')
  })

  it('rejects codes with invalid characters (I)', () => {
    const result = validateConnectCode('IBCDE')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Code contains invalid characters')
  })

  it('rejects codes with invalid characters (O)', () => {
    const result = validateConnectCode('OBCDE')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Code contains invalid characters')
  })

  it('rejects codes with invalid characters (X is valid, use invalid char)', () => {
    const result = validateConnectCode('OBCDE')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Code contains invalid characters')
  })

  it('rejects codes with spaces', () => {
    const result = validateConnectCode('AB CDE')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Code must be 5 characters')
  })

  it('trims whitespace before validation', () => {
    const result = validateConnectCode(' ABCDE ')
    expect(result.valid).toBe(true)
    expect(result.code).toBe('ABCDE')
  })
})

describe('formatConnectCode', () => {
  it('converts to uppercase', () => {
    expect(formatConnectCode('abcde')).toBe('ABCDE')
  })

  it('trims whitespace', () => {
    expect(formatConnectCode(' abcde ')).toBe('ABCDE')
  })

  it('handles already uppercase codes', () => {
    expect(formatConnectCode('ABCDE')).toBe('ABCDE')
  })

  it('handles mixed case codes', () => {
    expect(formatConnectCode('AbCdE')).toBe('ABCDE')
  })
})

describe('generateRandomConnectCode', () => {
  it('generates a 5-character code', () => {
    const code = generateRandomConnectCode()
    expect(code.length).toBe(5)
  })

  it('generates only valid characters', () => {
    for (let i = 0; i < 100; i++) {
      const code = generateRandomConnectCode()
      expect(validateConnectCode(code).valid).toBe(true)
    }
  })

  it('generates uppercase codes', () => {
    const code = generateRandomConnectCode()
    expect(code).toBe(code.toUpperCase())
  })

  it('generates varied codes', () => {
    // Generate many codes and check they're not all the same
    const codes = new Set()
    for (let i = 0; i < 100; i++) {
      codes.add(generateRandomConnectCode())
    }
    // Should have some variety (unlikely all 100 are unique but should have many)
    expect(codes.size).toBeGreaterThan(50)
  })
})

describe('isValidConnectCodeChar', () => {
  it('accepts valid characters', () => {
    // Valid chars: 2-9, A-H, J-M (without L), N-P, Q-Z
    const validChars = ['2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    for (const char of validChars) {
      expect(isValidConnectCodeChar(char)).toBe(true)
    }
  })

  it('accepts lowercase valid characters', () => {
    expect(isValidConnectCodeChar('a')).toBe(true)
    expect(isValidConnectCodeChar('b')).toBe(true)
    expect(isValidConnectCodeChar('m')).toBe(true)
    expect(isValidConnectCodeChar('z')).toBe(true)
  })

  it('rejects invalid characters', () => {
    const invalidChars = ['0', '1', 'I', 'O', 'L', 'i', 'o', 'l', ' ']
    for (const char of invalidChars) {
      expect(isValidConnectCodeChar(char)).toBe(false)
    }
  })
})
