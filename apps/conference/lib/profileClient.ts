const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'

export interface Profile {
  id: string
  email: string
  displayName: string | null
  company: string | null
  bio: string | null
  avatarUrl: string | null
  linkedinUrl: string | null
  twitterUrl: string | null
  githubUrl: string | null
  websiteUrl: string | null
  connectionCode: string | null
}

export type ProfileUpdate = Omit<Profile, 'id' | 'email'>

async function authFetch<T>(
  path: string,
  token: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options?.headers as Record<string, string> | undefined),
    },
  })
  const data = (await res.json()) as { data?: T; error?: string }
  if (!res.ok) throw new Error(data.error ?? 'Request failed')
  if (!data.data) throw new Error('Empty response')
  return data.data
}

export function getProfile(token: string): Promise<Profile> {
  return authFetch<Profile>('/api/v1/profile', token)
}

export function updateProfile(token: string, update: ProfileUpdate): Promise<Profile> {
  return authFetch<Profile>('/api/v1/profile', token, {
    method: 'PUT',
    body: JSON.stringify(update),
  })
}
