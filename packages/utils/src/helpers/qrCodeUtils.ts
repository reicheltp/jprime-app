import type { QRCodeData } from '@jprime/types'

/**
 * QR code utilities for the connections feature
 */

const QR_PREFIX = 'JPRIME_CONN:'

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
