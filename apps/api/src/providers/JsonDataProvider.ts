import type { Session, Speaker } from '@jprime/types'
import type { DataProvider } from './DataProvider'
import rawData from '../data/jprime-2026.json'

// Strip internal `_confirmed` and `_note` fields that are not part of the Session type
const sessions: Session[] = (rawData.sessions as Record<string, unknown>[]).map(
  ({ _confirmed: _c, ...rest }) => rest as unknown as Session,
)
const speakers: Speaker[] = rawData.speakers as unknown as Speaker[]

export class JsonDataProvider implements DataProvider {
  async getSessions(): Promise<Session[]> {
    return sessions
  }

  async getSession(id: string): Promise<Session | null> {
    return sessions.find((s) => s.id === id) ?? null
  }

  async getSpeakers(): Promise<Speaker[]> {
    return speakers
  }

  async getSpeaker(id: string): Promise<Speaker | null> {
    return speakers.find((s) => s.id === id) ?? null
  }
}
