import type { DataProvider, Session, Speaker } from './DataProvider'

/**
 * Mock data provider for testing. Returns predictable fixture data.
 */
export class MockDataProvider implements DataProvider {
  private sessions: Session[]
  private speakers: Speaker[]

  constructor(sessions: Session[], speakers: Speaker[]) {
    this.sessions = sessions
    this.speakers = speakers
  }

  async getSessions(): Promise<Session[]> {
    return [...this.sessions]
  }

  async getSession(id: string): Promise<Session | null> {
    return this.sessions.find((s) => s.id === id) ?? null
  }

  async getSpeakers(): Promise<Speaker[]> {
    return [...this.speakers]
  }

  async getSpeaker(id: string): Promise<Speaker | null> {
    return this.speakers.find((s) => s.id === id) ?? null
  }
}

// Factory for creating mock data
export function createMockData() {
  const sessions: Session[] = [
    {
      id: 'session-1',
      title: 'Opening Keynote',
      type: 'keynote',
      track: 'Track 1',
      room: 'hall A',
      day: '2026-06-03',
      startTime: '2026-06-03T09:00:00',
      endTime: '2026-06-03T09:45:00',
      description: 'Welcome to JPrime 2026!',
      speakers: [{ id: 'speaker-jane-doe', name: 'Jane Doe' }],
    },
    {
      id: 'session-2',
      title: 'Advanced TypeScript',
      type: 'talk',
      track: 'Track 1',
      room: 'hall A',
      day: '2026-06-03',
      startTime: '2026-06-03T10:00:00',
      endTime: '2026-06-03T10:45:00',
      description: 'Deep dive into TypeScript.',
      speakers: [{ id: 'speaker-john-smith', name: 'John Smith' }],
    },
  ]

  const speakers: Speaker[] = [
    {
      id: 'speaker-jane-doe',
      firstName: 'Jane',
      lastName: 'Doe',
      fullName: 'Jane Doe',
      bio: null,
      photoUrl: null,
      sessions: [
        {
          id: 'session-1',
          title: 'Opening Keynote',
          day: '2026-06-03',
          startTime: '2026-06-03T09:00:00',
        },
      ],
    },
    {
      id: 'speaker-john-smith',
      firstName: 'John',
      lastName: 'Smith',
      fullName: 'John Smith',
      bio: null,
      photoUrl: null,
      sessions: [
        {
          id: 'session-2',
          title: 'Advanced TypeScript',
          day: '2026-06-03',
          startTime: '2026-06-03T10:00:00',
        },
      ],
    },
  ]

  return { sessions, speakers }
}
