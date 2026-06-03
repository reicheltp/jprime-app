import type { Session, Speaker } from '@jprime/types'

export interface DataProvider {
  getSessions(): Promise<Session[]>
  getSession(id: string): Promise<Session | null>
  getSpeakers(): Promise<Speaker[]>
  getSpeaker(id: string): Promise<Speaker | null>
}
