import { describe, expect, it } from "bun:test"
import { filterSessions, deriveFilterOptions, type FilterState } from "./sessionFilters"
import type { Session } from "@jprime/types"

// Test fixtures
const mockSessions: Session[] = [
  {
    id: "s1",
    title: "React Hooks Deep Dive",
    type: "talk",
    track: "Track A",
    room: "Room 1",
    day: "2026-06-04",
    startTime: "09:00",
    endTime: "10:00",
    description: "A deep dive into React Hooks",
    speakers: [{ id: "sp1", name: "Jane Doe" }],
  },
  {
    id: "s2",
    title: "Advanced TypeScript",
    type: "workshop",
    track: "Track B",
    room: "Room 2",
    day: "2026-06-04",
    startTime: "10:00",
    endTime: "12:00",
    description: "Advanced TypeScript patterns",
    speakers: [{ id: "sp2", name: "John Smith" }],
  },
  {
    id: "s3",
    title: "Mobile Performance",
    type: "talk",
    track: "Track A",
    room: "Room 3",
    day: "2026-06-05",
    startTime: "09:00",
    endTime: "10:00",
    description: "Performance optimization for mobile apps",
    speakers: [{ id: "sp3", name: "Alice Johnson" }],
  },
  {
    id: "s4",
    title: "State Management",
    type: "talk",
    track: null,
    room: "Room 4",
    day: "2026-06-05",
    startTime: "11:00",
    endTime: "12:00",
    description: null,
    speakers: [],
  },
]

describe("deriveFilterOptions", () => {
  it("extracts unique days from sessions", () => {
    const result = deriveFilterOptions(mockSessions)
    expect(result.days).toEqual(["2026-06-04", "2026-06-05"])
  })

  it("extracts unique tracks from sessions", () => {
    const result = deriveFilterOptions(mockSessions)
    expect(result.tracks).toEqual(["Track A", "Track B"])
  })

  it("handles sessions with null track", () => {
    const sessionsWithNullTrack: Session[] = [
      { ...mockSessions[0], track: null },
      { ...mockSessions[1], track: null },
    ]
    const result = deriveFilterOptions(sessionsWithNullTrack)
    expect(result.tracks).toEqual([])
  })

  it("returns empty arrays for empty session list", () => {
    const result = deriveFilterOptions([])
    expect(result.days).toEqual([])
    expect(result.tracks).toEqual([])
  })
})

describe("filterSessions", () => {
  const baseFilter: FilterState = {
    day: null,
    track: null,
    bookmarksOnly: false,
  }

  it("returns all sessions when no filters are active", () => {
    const result = filterSessions(mockSessions, baseFilter)
    expect(result).toEqual(mockSessions)
  })

  it("filters by day", () => {
    const filter: FilterState = { ...baseFilter, day: "2026-06-04" }
    const result = filterSessions(mockSessions, filter)
    expect(result).toHaveLength(2)
    expect(result.every((s) => s.day === "2026-06-04")).toBe(true)
  })

  it("filters by track", () => {
    const filter: FilterState = { ...baseFilter, track: "Track A" }
    const result = filterSessions(mockSessions, filter)
    expect(result).toHaveLength(2)
    expect(result.every((s) => s.track === "Track A")).toBe(true)
  })

  it("filters by day and track combined", () => {
    const filter: FilterState = {
      ...baseFilter,
      day: "2026-06-04",
      track: "Track A",
    }
    const result = filterSessions(mockSessions, filter)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe("s1")
  })

  it("filters by bookmarksOnly with matching bookmarks", () => {
    const bookmarks = new Set(["s1", "s3"])
    const filter: FilterState = { ...baseFilter, bookmarksOnly: true }
    const result = filterSessions(mockSessions, filter, bookmarks)
    expect(result).toHaveLength(2)
    expect(result.every((s) => bookmarks.has(s.id))).toBe(true)
  })

  it("returns empty array when bookmarksOnly is true but no sessions match", () => {
    const bookmarks = new Set(["non-existent-id"])
    const filter: FilterState = { ...baseFilter, bookmarksOnly: true }
    const result = filterSessions(mockSessions, filter, bookmarks)
    expect(result).toHaveLength(0)
  })

  it("returns empty array when bookmarksOnly is true with empty bookmarks set", () => {
    const bookmarks = new Set<string>()
    const filter: FilterState = { ...baseFilter, bookmarksOnly: true }
    const result = filterSessions(mockSessions, filter, bookmarks)
    expect(result).toHaveLength(0)
  })

  it("filters by bookmarksOnly and day combined", () => {
    const bookmarks = new Set(["s1", "s3"])
    const filter: FilterState = {
      ...baseFilter,
      bookmarksOnly: true,
      day: "2026-06-04",
    }
    const result = filterSessions(mockSessions, filter, bookmarks)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe("s1")
  })

  it("filters by bookmarksOnly and track combined", () => {
    const bookmarks = new Set(["s1", "s3"])
    const filter: FilterState = {
      ...baseFilter,
      bookmarksOnly: true,
      track: "Track A",
    }
    const result = filterSessions(mockSessions, filter, bookmarks)
    expect(result).toHaveLength(2)
    expect(result.every((s) => s.track === "Track A" && bookmarks.has(s.id))).toBe(true)
  })

  it("filters by all three filters combined", () => {
    const bookmarks = new Set(["s1", "s3"])
    const filter: FilterState = {
      day: "2026-06-05",
      track: "Track A",
      bookmarksOnly: true,
    }
    const result = filterSessions(mockSessions, filter, bookmarks)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe("s3")
  })

  it("returns all sessions when bookmarksOnly is false even with bookmarks passed", () => {
    const bookmarks = new Set(["s1"])
    const filter: FilterState = { ...baseFilter, bookmarksOnly: false }
    const result = filterSessions(mockSessions, filter, bookmarks)
    expect(result).toEqual(mockSessions)
  })

  it("handles undefined bookmarks parameter when bookmarksOnly is false", () => {
    const filter: FilterState = { ...baseFilter, bookmarksOnly: false }
    const result = filterSessions(mockSessions, filter, undefined)
    expect(result).toEqual(mockSessions)
  })

  it("handles undefined bookmarks parameter when bookmarksOnly is true", () => {
    const filter: FilterState = { ...baseFilter, bookmarksOnly: true }
    const result = filterSessions(mockSessions, filter, undefined)
    expect(result).toHaveLength(0)
  })

  it("returns empty array for empty session list", () => {
    const result = filterSessions([], baseFilter)
    expect(result).toEqual([])
  })
})
