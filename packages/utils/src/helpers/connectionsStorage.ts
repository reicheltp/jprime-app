import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Connection, ConnectionType, QRCodeData } from '@jprime/types'

// Storage keys
const OUTGOING_KEY = '@connections_outgoing'
const INCOMING_KEY = '@connections_incoming'

/**
 * Connection storage utilities for managing attendee connections
 * Uses AsyncStorage for offline-capable persistence
 */

/**
 * Get all outgoing connections (users I've scanned)
 */
export async function getOutgoingConnections(): Promise<Connection[]> {
  try {
    const data = await AsyncStorage.getItem(OUTGOING_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

/**
 * Get all incoming connections (users who have scanned me)
 */
export async function getIncomingConnections(): Promise<Connection[]> {
  try {
    const data = await AsyncStorage.getItem(INCOMING_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

/**
 * Save outgoing connections
 */
async function saveOutgoingConnections(connections: Connection[]): Promise<void> {
  await AsyncStorage.setItem(OUTGOING_KEY, JSON.stringify(connections))
}

/**
 * Save incoming connections
 */
async function saveIncomingConnections(connections: Connection[]): Promise<void> {
  await AsyncStorage.setItem(INCOMING_KEY, JSON.stringify(connections))
}

/**
 * Add a new outgoing connection
 * Prevents duplicates by checking attendeeId
 */
export async function addOutgoingConnection(qrData: QRCodeData): Promise<Connection> {
  const now = Date.now()
  const newConnection: Connection = {
    attendeeId: qrData.email,
    displayName: qrData.displayName,
    connectedAt: now,
    connectionType: ConnectionType.OUTGOING,
  }

  const connections = await getOutgoingConnections()
  
  // Check if already connected
  const existingIndex = connections.findIndex(c => c.attendeeId === qrData.email)
  if (existingIndex >= 0) {
    // Update the connection timestamp
    connections[existingIndex] = newConnection
  } else {
    connections.push(newConnection)
  }

  await saveOutgoingConnections(connections)
  return newConnection
}

/**
 * Add a new incoming connection (when someone scans my QR)
 * Prevents duplicates by checking attendeeId
 */
export async function addIncomingConnection(qrData: QRCodeData): Promise<Connection> {
  const now = Date.now()
  const newConnection: Connection = {
    attendeeId: qrData.email,
    displayName: qrData.displayName,
    connectedAt: now,
    connectionType: ConnectionType.INCOMING,
  }

  const connections = await getIncomingConnections()
  
  // Check if already connected
  const existingIndex = connections.findIndex(c => c.attendeeId === qrData.email)
  if (existingIndex >= 0) {
    // Update the connection timestamp
    connections[existingIndex] = newConnection
  } else {
    connections.push(newConnection)
  }

  await saveIncomingConnections(connections)
  return newConnection
}

/**
 * Check if a connection exists in either outgoing or incoming
 */
export async function isConnected(attendeeId: string): Promise<boolean> {
  const [outgoing, incoming] = await Promise.all([
    getOutgoingConnections(),
    getIncomingConnections(),
  ])
  return [
    ...outgoing,
    ...incoming,
  ].some(c => c.attendeeId === attendeeId)
}

/**
 * Get connection by attendee ID from either list
 */
export async function getConnection(attendeeId: string): Promise<Connection | null> {
  const [outgoing, incoming] = await Promise.all([
    getOutgoingConnections(),
    getIncomingConnections(),
  ])
  return [...outgoing, ...incoming].find(c => c.attendeeId === attendeeId) ?? null
}

/**
 * Convert incoming connection to outgoing (connect back)
 * Returns the updated connection
 */
export async function connectBack(attendeeId: string): Promise<Connection | null> {
  const incoming = await getIncomingConnections()
  const existing = incoming.find(c => c.attendeeId === attendeeId)
  
  if (!existing) {
    return null
  }

  // Add to outgoing
  const outgoing: Connection = {
    ...existing,
    connectedAt: Date.now(),
    connectionType: ConnectionType.OUTGOING,
  }

  const outgoingConnections = await getOutgoingConnections()
  const updatedOutgoing = [...outgoingConnections.filter(c => c.attendeeId !== attendeeId), outgoing]
  await saveOutgoingConnections(updatedOutgoing)

  return outgoing
}

/**
 * Get both outgoing and incoming connections
 */
export async function getAllConnections(): Promise<{ outgoing: Connection[]; incoming: Connection[] }> {
  const [outgoing, incoming] = await Promise.all([
    getOutgoingConnections(),
    getIncomingConnections(),
  ])
  return { outgoing, incoming }
}

/**
 * Remove a connection from both lists
 */
export async function removeConnection(attendeeId: string): Promise<void> {
  const [outgoing, incoming] = await Promise.all([
    getOutgoingConnections(),
    getIncomingConnections(),
  ])

  const updatedOutgoing = outgoing.filter(c => c.attendeeId !== attendeeId)
  const updatedIncoming = incoming.filter(c => c.attendeeId !== attendeeId)

  await Promise.all([
    saveOutgoingConnections(updatedOutgoing),
    saveIncomingConnections(updatedIncoming),
  ])
}

/**
 * Clear all connections
 */
export async function clearAllConnections(): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(OUTGOING_KEY),
    AsyncStorage.removeItem(INCOMING_KEY),
  ])
}

/**
 * React Query compatible hook for connections
 * Note: This is a simple wrapper; for React Query integration, use useQuery with these functions
 */
export const connectionsStorage = {
  getOutgoing: getOutgoingConnections,
  getIncoming: getIncomingConnections,
  getAll: getAllConnections,
  addOutgoing: addOutgoingConnection,
  addIncoming: addIncomingConnection,
  isConnected,
  getConnection,
  connectBack,
  remove: removeConnection,
  clearAll: clearAllConnections,
}
