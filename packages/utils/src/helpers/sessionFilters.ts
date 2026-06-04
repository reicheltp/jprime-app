import type { Session } from '@jprime/types'

export interface FilterState {
  day: string | null
  track: string | null
  bookmarksOnly: boolean
}

export interface FilterOptions {
  days: string[]
  tracks: string[]
}

export function deriveFilterOptions(sessions: Session[]): FilterOptions {
  const days = [...new Set(sessions.map((s) => s.day))].sort()
  const tracks = [...new Set(
    sessions.flatMap((s) => (s.track ? [s.track] : []))
  )].sort()
  return { days, tracks }
}

export function filterSessions(
  sessions: Session[],
  filter: FilterState,
  bookmarks?: Set<string>
): Session[] {
  return sessions.filter((s) => {
    if (filter.day !== null && s.day !== filter.day) return false
    if (filter.track !== null && s.track !== filter.track) return false
    if (filter.bookmarksOnly && !bookmarks?.has(s.id)) return false
    return true
  })
}
