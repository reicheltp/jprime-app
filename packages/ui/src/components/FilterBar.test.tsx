import React from "react"
import { describe, expect, it, vi } from "bun:test"
import { render, fireEvent } from "@testing-library/react-native"
import { FilterBar } from "./FilterBar"
import type { FilterState } from "@jprime/utils"

describe("FilterBar", () => {
  const mockDays = ["2026-06-04", "2026-06-05"]
  const mockTracks = ["Track A", "Track B"]
  const mockOnChange = vi.fn()

  const baseFilter: FilterState = {
    day: null,
    track: null,
    bookmarksOnly: false,
  }

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it("renders day chips", () => {
    const { getByText } = render(
      <FilterBar days={mockDays} tracks={mockTracks} value={baseFilter} onChange={mockOnChange} />
    )
    expect(getByText("Day 1")).toBeDefined()
    expect(getByText("Day 2")).toBeDefined()
  })

  it("renders track chips", () => {
    const { getByText } = render(
      <FilterBar days={mockDays} tracks={mockTracks} value={baseFilter} onChange={mockOnChange} />
    )
    expect(getByText("Track A")).toBeDefined()
    expect(getByText("Track B")).toBeDefined()
  })

  it("renders Bookmarked chip", () => {
    const { getByText } = render(
      <FilterBar days={mockDays} tracks={mockTracks} value={baseFilter} onChange={mockOnChange} />
    )
    expect(getByText("Bookmarked")).toBeDefined()
  })

  it("does not show Clear button when no filters are active", () => {
    const { queryByText } = render(
      <FilterBar days={mockDays} tracks={mockTracks} value={baseFilter} onChange={mockOnChange} />
    )
    expect(queryByText("✕ Clear")).toBeNull()
  })

  it("shows Clear button when a day filter is active", () => {
    const filterWithDay: FilterState = { ...baseFilter, day: "2026-06-04" }
    const { getByText } = render(
      <FilterBar days={mockDays} tracks={mockTracks} value={filterWithDay} onChange={mockOnChange} />
    )
    expect(getByText("✕ Clear")).toBeDefined()
  })

  it("shows Clear button when a track filter is active", () => {
    const filterWithTrack: FilterState = { ...baseFilter, track: "Track A" }
    const { getByText } = render(
      <FilterBar days={mockDays} tracks={mockTracks} value={filterWithTrack} onChange={mockOnChange} />
    )
    expect(getByText("✕ Clear")).toBeDefined()
  })

  it("shows Clear button when bookmarksOnly filter is active", () => {
    const filterWithBookmarks: FilterState = { ...baseFilter, bookmarksOnly: true }
    const { getByText } = render(
      <FilterBar days={mockDays} tracks={mockTracks} value={filterWithBookmarks} onChange={mockOnChange} />
    )
    expect(getByText("✕ Clear")).toBeDefined()
  })

  it("toggles day filter when pressed", () => {
    const { getByText } = render(
      <FilterBar days={mockDays} tracks={mockTracks} value={baseFilter} onChange={mockOnChange} />
    )
    fireEvent.press(getByText("Day 1"))
    expect(mockOnChange).toHaveBeenCalledWith({
      day: "2026-06-04",
      track: null,
      bookmarksOnly: false,
    })
  })

  it("toggles day filter off when pressed again", () => {
    const filterWithDay: FilterState = { ...baseFilter, day: "2026-06-04" }
    const { getByText } = render(
      <FilterBar days={mockDays} tracks={mockTracks} value={filterWithDay} onChange={mockOnChange} />
    )
    fireEvent.press(getByText("Day 1"))
    expect(mockOnChange).toHaveBeenCalledWith({
      day: null,
      track: null,
      bookmarksOnly: false,
    })
  })

  it("toggles track filter when pressed", () => {
    const { getByText } = render(
      <FilterBar days={mockDays} tracks={mockTracks} value={baseFilter} onChange={mockOnChange} />
    )
    fireEvent.press(getByText("Track A"))
    expect(mockOnChange).toHaveBeenCalledWith({
      day: null,
      track: "Track A",
      bookmarksOnly: false,
    })
  })

  it("toggles bookmarksOnly filter when pressed", () => {
    const { getByText } = render(
      <FilterBar days={mockDays} tracks={mockTracks} value={baseFilter} onChange={mockOnChange} />
    )
    fireEvent.press(getByText("Bookmarked"))
    expect(mockOnChange).toHaveBeenCalledWith({
      day: null,
      track: null,
      bookmarksOnly: true,
    })
  })

  it("toggles bookmarksOnly filter off when pressed again", () => {
    const filterWithBookmarks: FilterState = { ...baseFilter, bookmarksOnly: true }
    const { getByText } = render(
      <FilterBar days={mockDays} tracks={mockTracks} value={filterWithBookmarks} onChange={mockOnChange} />
    )
    fireEvent.press(getByText("Bookmarked"))
    expect(mockOnChange).toHaveBeenCalledWith({
      day: null,
      track: null,
      bookmarksOnly: false,
    })
  })

  it("clears all filters when Clear button is pressed", () => {
    const filterWithAll: FilterState = {
      day: "2026-06-04",
      track: "Track A",
      bookmarksOnly: true,
    }
    const { getByText } = render(
      <FilterBar days={mockDays} tracks={mockTracks} value={filterWithAll} onChange={mockOnChange} />
    )
    fireEvent.press(getByText("✕ Clear"))
    expect(mockOnChange).toHaveBeenCalledWith({
      day: null,
      track: null,
      bookmarksOnly: false,
    })
  })

  it("preserves other filters when toggling one filter", () => {
    const filterWithDay: FilterState = { ...baseFilter, day: "2026-06-04" }
    const { getByText } = render(
      <FilterBar days={mockDays} tracks={mockTracks} value={filterWithDay} onChange={mockOnChange} />
    )
    fireEvent.press(getByText("Track A"))
    expect(mockOnChange).toHaveBeenCalledWith({
      day: "2026-06-04",
      track: "Track A",
      bookmarksOnly: false,
    })
  })
})
