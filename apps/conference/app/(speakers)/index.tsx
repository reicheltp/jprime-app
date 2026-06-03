import React from 'react'
import { View, FlatList, ActivityIndicator, Text, RefreshControl } from 'react-native'
import { router } from 'expo-router'
import { useSpeakers } from '@jprime/api'
import { sortSpeakersByLastName } from '@jprime/utils'
import { SpeakerCard, EmptyState } from '@jprime/ui'
import type { Speaker } from '@jprime/types'

export default function SpeakersScreen() {
  const { data: speakers, isLoading, isError, refetch } = useSpeakers()

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-dark">
        <ActivityIndicator size="large" color="#39CBFB" />
      </View>
    )
  }

  if (isError || !speakers) {
    return (
      <View className="flex-1 bg-dark">
        <EmptyState
          message="Could not load speakers."
          action={{ label: 'Retry', onPress: () => refetch() }}
        />
      </View>
    )
  }

  const sorted = sortSpeakersByLastName(speakers)

  function renderItem({ item }: { item: Speaker }) {
    return (
      <SpeakerCard
        speaker={item}
        onPress={() => router.push(`/(speakers)/${item.id}`)}
      />
    )
  }

  return (
    <View className="flex-1 bg-dark">
      <FlatList
        data={sorted}
        keyExtractor={(s) => s.id}
        renderItem={renderItem}
        contentContainerClassName="px-4 pt-4 pb-8"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#39CBFB" />
        }
        ListHeaderComponent={
          <Text className="text-caption text-neutral-500 mb-3">
            {sorted.length} speakers
          </Text>
        }
      />
    </View>
  )
}
