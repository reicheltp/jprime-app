import AsyncStorage from '@react-native-async-storage/async-storage'

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'
const SESSION_KEY = '@jprime/auth-session'

export interface AuthUser {
  id: string
  email: string
}

export interface AuthSession {
  token: string
  user: AuthUser
}

export async function requestOtp(email: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/auth/otp/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  const data = (await res.json()) as { error?: string }
  if (!res.ok) throw new Error(data.error ?? 'Failed to send code')
}

export async function verifyOtp(email: string, code: string): Promise<AuthSession> {
  const res = await fetch(`${API_URL}/api/v1/auth/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  })
  const data = (await res.json()) as { data?: AuthSession; error?: string }
  if (!res.ok) throw new Error(data.error ?? 'Verification failed')
  if (!data.data) throw new Error('Invalid server response')
  return data.data
}

export async function loadSession(): Promise<AuthSession | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY)
  return raw ? (JSON.parse(raw) as AuthSession) : null
}

export async function saveSession(session: AuthSession): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY)
}
