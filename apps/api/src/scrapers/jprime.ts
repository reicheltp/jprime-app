import type { Session, Speaker, SessionRef } from '@jprime/types'

export interface ScrapeResult {
  sessions: Session[]
  speakers: Speaker[]
  scrapedAt: Date
}

/**
 * Scrapes session and speaker data from the jprime.io website.
 *
 * TODO: Implement once jprime.io HTML structure is available for inspection.
 * The site currently blocks automated requests (HTTP 403). Inspect manually
 * and populate the selectors below.
 *
 * The interface is stable — only this implementation file changes when
 * the site structure is known. All callers depend on ScrapeResult.
 */
export async function scrapeJprime(_baseUrl: string): Promise<ScrapeResult> {
  throw new Error(
    'Scraper not yet implemented — jprime.io HTML structure needs inspection. ' +
    'Use MockDataProvider for development.'
  )
}

// --- Helpers (to be used once scraper is implemented) ---

export function parseTime(dateStr: string, timeStr: string): string {
  // Expected: dateStr = "2026-05-29", timeStr = "10:00"
  return `${dateStr}T${timeStr}:00`
}

export function slugId(prefix: string, value: string): string {
  return `${prefix}-${value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`
}

export function buildSpeakerRefs(speakerIds: string[], allSpeakers: Pick<Speaker, 'id' | 'fullName'>[]): SessionRef[] {
  return speakerIds.flatMap((id) => {
    const s = allSpeakers.find((sp) => sp.id === id)
    return s ? [{ id: s.id, title: s.fullName, day: '', startTime: '' }] : []
  })
}
