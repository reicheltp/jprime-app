import type { ConnectCodeLookupResult, Connection, QRCodeData } from '@jprime/types'
import { addOutgoingConnection, isConnected, getConnection, connectBack } from './connectionsStorage'
import { validateConnectCode, formatConnectCode } from '../constants/connectCodes'

/**
 * Convert a ConnectCodeLookupResult to QRCodeData format
 * This allows code-based connections to reuse the existing QR-based logic
 */
export function connectCodeToQRCodeData(lookupResult: ConnectCodeLookupResult): QRCodeData {
  return {
    email: lookupResult.email,
    displayName: lookupResult.displayName,
  }
}

/**
 * Create a connection from a connect code
 * Validates the code, looks up the attendee, and adds the connection
 * @param code - The 5-character connect code
 * @param lookupFunction - Function to look up attendee by code (injected for testability)
 * @returns The created connection
 */
export async function createConnectionFromCode(
  code: string,
  lookupFunction: (code: string) => Promise<ConnectCodeLookupResult>
): Promise<Connection> {
  // Validate the code format
  const validation = validateConnectCode(code)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  // Look up the attendee by code
  const lookupResult = await lookupFunction(validation.code!)

  // Convert to QRCodeData format for reuse of existing logic
  const qrData = connectCodeToQRCodeData(lookupResult)

  // Add the outgoing connection
  const connection = await addOutgoingConnection(qrData)

  return connection
}

/**
 * Check if a code belongs to the current user
 * @param code - The code to check
 * @param userCode - The current user's code
 * @returns True if the code matches the user's own code
 */
export function isOwnCode(code: string, userCode: string | null): boolean {
  if (!userCode) return false
  return formatConnectCode(code) === formatConnectCode(userCode)
}

/**
 * Check if already connected via code or email
 * @param code - The connect code to check
 * @param lookupFunction - Function to look up attendee by code
 * @returns True if already connected to this attendee
 */
export async function isConnectedByCode(
  code: string,
  lookupFunction: (code: string) => Promise<ConnectCodeLookupResult>
): Promise<boolean> {
  const validation = validateConnectCode(code)
  if (!validation.valid) {
    return false
  }

  const lookupResult = await lookupFunction(validation.code!)
  return isConnected(lookupResult.email)
}

/**
 * Get connection by code
 * @param code - The connect code
 * @param lookupFunction - Function to look up attendee by code
 * @returns The connection if exists, null otherwise
 */
export async function getConnectionByCode(
  code: string,
  lookupFunction: (code: string) => Promise<ConnectCodeLookupResult>
): Promise<Connection | null> {
  const validation = validateConnectCode(code)
  if (!validation.valid) {
    return null
  }

  const lookupResult = await lookupFunction(validation.code!)
  return getConnection(lookupResult.email)
}

/**
 * Connect back to someone who connected via code
 * @param code - The connect code of the incoming connection
 * @param lookupFunction - Function to look up attendee by code
 * @returns The updated connection or null if not found
 */
export async function connectBackByCode(
  code: string,
  lookupFunction: (code: string) => Promise<ConnectCodeLookupResult>
): Promise<Connection | null> {
  const validation = validateConnectCode(code)
  if (!validation.valid) {
    return null
  }

  const lookupResult = await lookupFunction(validation.code!)
  return connectBack(lookupResult.email)
}

/**
 * Get the user's own QRCodeData for sharing
 * @param email - User's email
 * @param displayName - User's display name
 * @param connectCode - User's connect code (optional)
 * @returns QRCodeData for sharing
 */
export function getShareableData(
  email: string,
  displayName: string,
  connectCode: string | undefined
): { qrData: QRCodeData; code: string | undefined } {
  return {
    qrData: {
      email,
      displayName,
    },
    code: connectCode,
  }
}
