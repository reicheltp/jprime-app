import type { Session } from '@jprime/types'

function overlaps(a: Session, b: Session): boolean {
  return a.startTime < b.endTime && b.startTime < a.endTime
}

export function detectConflicts(sessions: Session[]): Set<string> {
  const conflicts = new Set<string>()
  for (let i = 0; i < sessions.length; i++) {
    for (let j = i + 1; j < sessions.length; j++) {
      const a = sessions[i]
      const b = sessions[j]
      if (a !== undefined && b !== undefined && overlaps(a, b)) {
        conflicts.add(a.id)
        conflicts.add(b.id)
      }
    }
  }
  return conflicts
}
