import React from 'react'
import { View, Text, Pressable, ScrollView } from 'react-native'
import type { FilterState } from '@jprime/utils'

interface FilterBarProps {
  days: string[]
  tracks: string[]
  value: FilterState
  onChange: (filter: FilterState) => void
}

function dayLabel(iso: string, index: number): string {
  return `Day ${index + 1}`
}

export const FilterBar: React.FC<FilterBarProps> = ({ days, tracks, value, onChange }) => {
  const hasActiveFilter = value.day !== null || value.track !== null

  return (
    <View className="bg-neutral-800 border-b border-neutral-700 py-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4 gap-2 flex-row items-center"
      >
        {days.map((day, i) => {
          const active = value.day === day
          return (
            <Pressable
              key={day}
              onPress={() => onChange({ ...value, day: active ? null : day })}
              className={`px-4 py-2 rounded-full border ${
                active
                  ? 'bg-primary border-primary'
                  : 'bg-neutral-700 border-neutral-600'
              }`}
            >
              <Text className={`text-sm font-medium ${active ? 'text-white' : 'text-neutral-300'}`}>
                {dayLabel(day, i)}
              </Text>
            </Pressable>
          )
        })}

        <View className="w-px h-5 bg-neutral-600" />

        {tracks.map((track) => {
          const active = value.track === track
          return (
            <Pressable
              key={track}
              onPress={() => onChange({ ...value, track: active ? null : track })}
              className={`px-4 py-2 rounded-full border ${
                active
                  ? 'bg-cyan border-cyan'
                  : 'bg-neutral-700 border-neutral-600'
              }`}
            >
              <Text className={`text-sm font-medium ${active ? 'text-white' : 'text-neutral-300'}`}>
                {track}
              </Text>
            </Pressable>
          )
        })}

        {hasActiveFilter && (
          <>
            <View className="w-px h-5 bg-neutral-600" />
            <Pressable
              onPress={() => onChange({ day: null, track: null })}
              className="px-4 py-2 rounded-full border border-neutral-600"
            >
              <Text className="text-sm text-neutral-400">✕ Clear</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  )
}
