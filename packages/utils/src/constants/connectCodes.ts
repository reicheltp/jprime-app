/**
 * Connect Codes Constants
 * 
 * 5-character codes for attendee connections as alternative to QR codes
 * Uses non-ambiguous character set to avoid confusion
 * 
 * Character set: 23456789ABCDEFGHJKMNPQRSTUVWXYZ (31 characters)
 * Excluded: 0 (looks like O), 1 (looks like I/L), I (looks like 1/L), O (looks like 0), L (looks like 1/I)
 */

// Allowed characters: digits 2-9 and letters A-H, J-M (without I), N-P (without O), Q-Z
// This gives us: 23456789 (8) + ABCDEFGH (8) + JKM (3) + NP (2) + QRSTUVWXYZ (10) = 31 characters
export const CONNECT_CODE_CHARS = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'

// Length of the code
export const CONNECT_CODE_LENGTH = 5

// Total possible combinations: 31^5 = 28,629,151
export const TOTAL_CODE_COMBINATIONS = CONNECT_CODE_CHARS.length ** CONNECT_CODE_LENGTH

// Regex pattern for validation (case-insensitive)
// Matches exactly the characters in CONNECT_CODE_CHARS
// Excludes: 0, 1, I, O, L
export const CONNECT_CODE_REGEX = /^[2-9A-HJKMNP-Z]{5}$/i

/**
 * Validation result type
 */
export interface ConnectCodeValidationResult {
  valid: boolean
  error?: string
  code?: string
}

/**
 * Validate a connect code
 * @param code - The code to validate
 * @returns Validation result with error message if invalid
 */
export function validateConnectCode(code: string): ConnectCodeValidationResult {
  // Check if empty
  if (!code || code.trim() === '') {
    return { valid: false, error: 'Code is required' }
  }

  const trimmedCode = code.trim()

  // Check length
  if (trimmedCode.length !== CONNECT_CODE_LENGTH) {
    return { valid: false, error: `Code must be ${CONNECT_CODE_LENGTH} characters` }
  }

  // Check character set (case-insensitive)
  if (!CONNECT_CODE_REGEX.test(trimmedCode)) {
    return { valid: false, error: 'Code contains invalid characters' }
  }

  // Return uppercase version
  return { valid: true, code: trimmedCode.toUpperCase() }
}

/**
 * Format a code to uppercase
 * @param code - The code to format
 * @returns Uppercase code
 */
export function formatConnectCode(code: string): string {
  return code.trim().toUpperCase()
}

/**
 * Generate a random connect code (client-side, for testing/mocking only)
 * Note: Server-side generation ensures uniqueness
 * @returns Random 5-character code
 */
export function generateRandomConnectCode(): string {
  let result = ''
  for (let i = 0; i < CONNECT_CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * CONNECT_CODE_CHARS.length)
    result += CONNECT_CODE_CHARS[randomIndex]
  }
  return result
}

/**
 * Check if a character is valid in a connect code
 * @param char - Single character to check
 * @returns True if valid
 */
export function isValidConnectCodeChar(char: string): boolean {
  return CONNECT_CODE_CHARS.includes(char.toUpperCase())
}
