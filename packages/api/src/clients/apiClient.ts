export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'

export async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Accept: 'application/json' },
  })

  if (!res.ok) {
    throw new ApiError(res.status, `API error ${res.status} on ${path}`)
  }

  const json = (await res.json()) as { data: T; meta?: unknown }
  return json.data
}
