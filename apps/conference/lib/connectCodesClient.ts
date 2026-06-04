import type { ConnectCodeLookupResult, ConnectCodeData } from '@jprime/types'

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'

/**
 * Error types for connect code operations
 */
export interface ConnectCodeError {
  error: 'NOT_FOUND' | 'INVALID_FORMAT' | 'ALREADY_EXISTS' | 'NOT_AUTHENTICATED' | 'SERVER_ERROR'
  message: string
}

/**
 * Get the current user's connect code
 * @param token - Authentication token
 * @returns The user's 5-character connect code
 */
export async function getConnectCode(token: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/v1/profile/connect-code`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  
  const data = (await res.json()) as { data?: { code: string }; error?: ConnectCodeError }
  
  if (!res.ok) {
    throw new Error(data.error?.message ?? 'Failed to get connect code')
  }
  
  if (!data.data?.code) {
    throw new Error('No connect code found')
  }
  
  return data.data.code
}

/**
 * Get or create a connect code for the current user
 * If user already has a code, returns the existing one
 * If user doesn't have a code, generates a new one
 * @param token - Authentication token
 * @returns The user's 5-character connect code
 */
export async function getOrCreateConnectCode(token: string): Promise<string> {
  try {
    // Try to get existing code first
    return await getConnectCode(token)
  } catch {
    // User doesn't have a code, generate one
    return await generateConnectCode(token)
  }
}

/**
 * Generate a connect code for the current user (idempotent)
 * If user already has a code, returns the existing one
 * @param token - Authentication token
 * @returns The user's 5-character connect code (new or existing)
 */
export async function generateConnectCode(token: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/v1/profile/connect-code`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  
  const data = (await res.json()) as { data?: { code: string }; error?: ConnectCodeError }
  
  if (!res.ok) {
    throw new Error(data.error?.message ?? 'Failed to generate connect code')
  }
  
  if (!data.data?.code) {
    throw new Error('No connect code returned')
  }
  
  return data.data.code
}

/**
 * Look up an attendee by their connect code
 * @param code - The 5-character connect code
 * @returns Attendee profile information including their connect code
 */
export async function lookupByConnectCode(code: string): Promise<ConnectCodeLookupResult> {
  // Format code to uppercase for consistency
  const formattedCode = code.trim().toUpperCase()
  
  const res = await fetch(`${API_URL}/api/v1/attendees/by-code/${formattedCode}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  const data = (await res.json()) as { data?: ConnectCodeLookupResult; error?: ConnectCodeError }
  
  if (!res.ok) {
    const errorType = data.error?.error
    // Provide user-friendly error messages
    if (errorType === 'NOT_FOUND') {
      throw new Error(`No attendee found with code: ${formattedCode}`)
    }
    if (errorType === 'INVALID_FORMAT') {
      throw new Error('Invalid code format')
    }
    throw new Error(data.error?.message ?? 'Failed to look up code')
  }
  
  if (!data.data) {
    throw new Error('No attendee found with that code')
  }
  
  return data.data
}

/**
 * Check if a connect code is available (not assigned to anyone)
 * @param token - Authentication token
 * @param code - The code to check
 * @returns True if code is available
 */
export async function isConnectCodeAvailable(token: string, code: string): Promise<boolean> {
  const formattedCode = code.trim().toUpperCase()
  
  const res = await fetch(`${API_URL}/api/v1/profile/connect-code/check?code=${formattedCode}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  
  const data = (await res.json()) as { data?: { available: boolean }; error?: ConnectCodeError }
  
  if (!res.ok) {
    throw new Error(data.error?.message ?? 'Failed to check code availability')
  }
  
  return data.data?.available ?? false
}

/**
 * Batch lookup for multiple connect codes (for potential future use)
 * @param codes - Array of codes to look up
 * @returns Array of results (successful lookups)
 */
export async function lookupMultipleConnectCodes(codes: string[]): Promise<ConnectCodeLookupResult[]> {
  const formattedCodes = codes.map(c => c.trim().toUpperCase())
  
  const res = await fetch(`${API_URL}/api/v1/attendees/by-codes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ codes: formattedCodes }),
  })
  
  const data = (await res.json()) as { data?: ConnectCodeLookupResult[]; error?: ConnectCodeError }
  
  if (!res.ok) {
    throw new Error(data.error?.message ?? 'Failed to look up codes')
  }
  
  return data.data ?? []
}
