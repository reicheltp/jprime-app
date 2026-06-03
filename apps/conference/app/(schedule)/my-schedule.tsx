import React from 'react'
import { View, FlatList, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import { useSessions, useBookmarks } from '@jprime/api'
import { detectConflicts } from '@jprime/utils'
import { SessionCard, EmptyState } from '@jprime/ui'
import type { Session } from '@jprime/types'

export default function MyScheduleScreen() {
  const { data: allSessions, isLoading: sessionsLoading } = useSessions()
  const { data: bookmarks, isLoading: bookmarksLoading } = useBookmarks()

  const isLoading = sessionsLoading || bookmarksLoading

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#E83283" />
      </View>
    )
  }

  const bookmarkedSessions =
    allSessions?.filter((s) => bookmarks?.has(s.id)) ?? []

  const sorted = [...bookmarkedSessions].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  )

  const conflictIds = detectConflicts(bookmarkedSessions)

  if (sorted.length === 0) {
    return (
      <EmptyState
        message="No sessions bookmarked yet."
        action={{
          label: 'Browse schedule',
          onPress: () => router.push('/(schedule)/'),
        }}
      />
    )
  }

  function renderItem({ item }: { item: Session }) {
    return (
      <SessionCard
        session={item}
        isBookmarked
        hasConflict={conflictIds.has(item.id)}
        onPress={() => router.push(`/(schedule)/${item.id}`)}
      />
    )
  }

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={sorted}
        keyExtractor={(s) => s.id}
        renderItem={renderItem}
        contentContainerClassName="px-4 pt-4 pb-8"
      />
    </View>
  )
}
