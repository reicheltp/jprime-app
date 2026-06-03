import type { Session, Speaker } from '@jprime/types'
import type { DataProvider } from './DataProvider'
import { Cache } from './cache'
import { scrapeJprime } from '../scrapers/jprime'

export class DataUnavailableError extends Error {
  constructor() {
    super('Conference data is unavailable and no cache exists')
    this.name = 'DataUnavailableError'
  }
}

export class ScraperProvider implements DataProvider {
  private cache: Cache
  private ttlMs: number
  private baseUrl: string

  constructor(baseUrl = 'https://jprime.io', ttlMs = 10 * 60 * 1000) {
    this.baseUrl = baseUrl
    this.ttlMs = ttlMs
    this.cache = new Cache()
  }

  private async refresh(): Promise<void> {
    const result = await scrapeJprime(this.baseUrl)
    this.cache.set('sessions', result.sessions, this.ttlMs)
    this.cache.set('speakers', result.speakers, this.ttlMs)
  }

  private async getOrRefresh<T>(key: string): Promise<{ data: T; stale: boolean }> {
    const fresh = this.cache.get<T>(key)
    if (fresh) return { data: fresh.data, stale: false }

    try {
      await this.refresh()
      const updated = this.cache.get<T>(key)
      if (updated) return { data: updated.data, stale: false }
    } catch {
      const stale = this.cache.getStale<T>(key)
      if (stale) return { data: stale.data, stale: true }
      throw new DataUnavailableError()
    }

    throw new DataUnavailableError()
  }

  async getSessions(): Promise<Session[]> {
    const { data } = await this.getOrRefresh<Session[]>('sessions')
    return data
  }

  async getSession(id: string): Promise<Session | null> {
    const sessions = await this.getSessions()
    return sessions.find((s) => s.id === id) ?? null
  }

  async getSpeakers(): Promise<Speaker[]> {
    const { data } = await this.getOrRefresh<Speaker[]>('speakers')
    return data
  }

  async getSpeaker(id: string): Promise<Speaker | null> {
    const speakers = await this.getSpeakers()
    return speakers.find((s) => s.id === id) ?? null
  }
}
