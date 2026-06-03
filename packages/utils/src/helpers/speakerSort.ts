import type { Speaker } from '@jprime/types'

export function sortSpeakersByLastName(speakers: Speaker[]): Speaker[] {
  return [...speakers].sort((a, b) => {
    const last = a.lastName.localeCompare(b.lastName, undefined, { sensitivity: 'base' })
    if (last !== 0) return last
    return a.firstName.localeCompare(b.firstName, undefined, { sensitivity: 'base' })
  })
}
