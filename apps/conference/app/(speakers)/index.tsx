import React from 'react'
import { View, FlatList, ActivityIndicator, Text, RefreshControl, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { useSpeakers } from '@jprime/api'
import { sortSpeakersByLastName } from '@jprime/utils'
import { SpeakerCard, EmptyState } from '@jprime/ui'
import type { Speaker } from '@jprime/types'

export default function SpeakersScreen() {
  const { data: speakers, isLoading, isError, refetch } = useSpeakers()

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#39CBFB" />
      </View>
    )
  }

  if (isError || !speakers) {
    return (
      <View style={styles.screen}>
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
    <View style={styles.screen}>
      <FlatList
        data={sorted}
        keyExtractor={(s) => s.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#39CBFB" />
        }
        ListHeaderComponent={
          <Text style={styles.count}>{sorted.length} speakers</Text>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#212529',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212529',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  count: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
})
