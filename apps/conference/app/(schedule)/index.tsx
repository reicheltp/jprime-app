import React, { useState } from 'react'
import { View, FlatList, Text, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import { useSessions, useBookmarks } from '@jprime/api'
import { filterSessions, deriveFilterOptions } from '@jprime/utils'
import type { FilterState } from '@jprime/utils'
import { SessionCard, FilterBar, EmptyState } from '@jprime/ui'
import type { Session } from '@jprime/types'

export default function ScheduleScreen() {
  const [filter, setFilter] = useState<FilterState>({ day: null, track: null })
  const { data: sessions, isLoading, isError, refetch } = useSessions()
  const { data: bookmarks } = useBookmarks()

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#E83283" />
      </View>
    )
  }

  if (isError || !sessions) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-8">
        <Text className="text-4xl mb-4">⚠️</Text>
        <Text className="text-body text-neutral-500 text-center mb-6">
          Could not load the schedule. Please try again.
        </Text>
        <EmptyState
          message="Could not load schedule."
          action={{ label: 'Retry', onPress: () => refetch() }}
        />
      </View>
    )
  }

  const { days, tracks } = deriveFilterOptions(sessions)
  const filtered = filterSessions(sessions, filter)

  function renderItem({ item }: { item: Session }) {
    return (
      <SessionCard
        session={item}
        isBookmarked={bookmarks?.has(item.id) ?? false}
        onPress={() => router.push(`/(schedule)/${item.id}`)}
      />
    )
  }

  return (
    <View className="flex-1 bg-white">
      <FilterBar days={days} tracks={tracks} value={filter} onChange={setFilter} />
      {filtered.length === 0 ? (
        <EmptyState
          message="No sessions found."
          action={{ label: 'Clear filters', onPress: () => setFilter({ day: null, track: null }) }}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(s) => s.id}
          renderItem={renderItem}
          contentContainerClassName="px-4 pt-4 pb-8"
        />
      )}
    </View>
  )
}
