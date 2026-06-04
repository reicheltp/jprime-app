import type { QRCodeData } from '@jprime/types'

/**
 * QR code utilities for the connections feature
 */

const QR_PREFIX = 'JPRIME_CONN:'

// Characters allowed in connection codes (excluding similar-looking: 0,1,O,I,L)
const CONNECT_CODE_CHARS = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'
const CONNECT_CODE_LENGTH = 5

/**
 * Generate QR code data string from email and displayName
 * Format: JPRIME_CONN:{"email":"...","displayName":"..."}
 */
export function generateQRCodeData(email: string, displayName: string): string {
  const data: QRCodeData = {
    email,
    displayName,
  }
  return `${QR_PREFIX}${JSON.stringify(data)}`
}

/**
 * Parse QR code string to extract QRCodeData
 * Validates the format and prefix
 * @returns QRCodeData if valid, null otherwise
 */
export function parseQRCodeData(qrString: string): QRCodeData | null {
  // Check if it starts with our prefix
  if (!qrString.startsWith(QR_PREFIX)) {
    return null
  }

  try {
    const dataStr = qrString.slice(QR_PREFIX.length)
    const parsed = JSON.parse(dataStr) as Record<string, unknown>

    // Validate required fields
    if (
      typeof parsed.email === 'string' &&
      parsed.email.trim() !== '' &&
      typeof parsed.displayName === 'string'
    ) {
      return {
        email: parsed.email.trim().toLowerCase(),
        displayName: parsed.displayName.trim(),
      }
    }
    return null
  } catch {
    return null
  }
}

/**
 * Check if a string is a valid JPrime connection QR code
 */
export function isValidConnectionQRCode(qrString: string): boolean {
  return parseQRCodeData(qrString) !== null
}

/**
 * Extract just the email from a QR code string (for quick lookups)
 */
export function extractEmailFromQRCode(qrString: string): string | null {
  const data = parseQRCodeData(qrString)
  return data?.email ?? null
}

/**
 * Generate a shareable QR code payload for the current user
 * This is what gets encoded into the QR code image
 */
export function createShareableQRData(email: string, displayName: string): string {
  return generateQRCodeData(email, displayName)
}

/**
 * Generate a random 5-character connection code
 * Uses characters that are easily distinguishable (no 0,1,O,I,L)
 * Format: 5 characters from 2-9, A-H, J-Z (case-insensitive but stored uppercase)
 */
export function generateConnectCode(): string {
  let code = ''
  for (let i = 0; i < CONNECT_CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * CONNECT_CODE_CHARS.length)
    code += CONNECT_CODE_CHARS[randomIndex]
  }
  return code
}

/**
 * Validate a connection code format
 * Must be exactly 5 characters, using only allowed characters
 */
export function isValidConnectCode(code: string): boolean {
  if (code.length !== CONNECT_CODE_LENGTH) return false
  return [...code.toUpperCase()].every(char => CONNECT_CODE_CHARS.includes(char))
}
