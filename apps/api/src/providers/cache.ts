export interface CacheEntry<T> {
  data: T
  fetchedAt: Date
  expiresAt: Date
}

export class Cache {
  private store = new Map<string, CacheEntry<unknown>>()

  set<T>(key: string, data: T, ttlMs: number): void {
    const now = new Date()
    this.store.set(key, {
      data,
      fetchedAt: now,
      expiresAt: new Date(now.getTime() + ttlMs),
    })
  }

  get<T>(key: string): CacheEntry<T> | null {
    const entry = this.store.get(key)
    if (!entry) return null
    if (new Date() > entry.expiresAt) return null
    return entry as CacheEntry<T>
  }

  getStale<T>(key: string): CacheEntry<T> | null {
    const entry = this.store.get(key)
    if (!entry) return null
    return entry as CacheEntry<T>
  }

  isStale(key: string): boolean {
    const entry = this.store.get(key)
    if (!entry) return true
    return new Date() > entry.expiresAt
  }
}
