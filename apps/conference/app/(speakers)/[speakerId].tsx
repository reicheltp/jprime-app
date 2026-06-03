import React from 'react'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useSpeaker } from '@jprime/api'
import { SpeakerAvatar, SessionListItem, EmptyState } from '@jprime/ui'

export default function SpeakerDetailScreen() {
  const { speakerId } = useLocalSearchParams<{ speakerId: string }>()
  const { data: speaker, isLoading, isError } = useSpeaker(speakerId ?? '')

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#E83283" />
      </View>
    )
  }

  if (isError || !speaker) {
    return <EmptyState message="Speaker not found." />
  }

  return (
    <ScrollView className="flex-1 bg-white" contentContainerClassName="pb-12">
      <View className="px-5 pt-6">
        <View className="items-center mb-5">
          <SpeakerAvatar photoUrl={speaker.photoUrl} name={speaker.fullName} size="lg" />
          <Text className="text-2xl font-bold text-neutral-900 mt-4 text-center">
            {speaker.fullName}
          </Text>
        </View>

        {speaker.bio && (
          <View className="mb-7">
            <Text className="text-caption text-neutral-400 font-semibold uppercase tracking-wide mb-3">
              About
            </Text>
            <Text className="text-body text-neutral-700 leading-relaxed">{speaker.bio}</Text>
          </View>
        )}

        <View>
          <Text className="text-caption text-neutral-400 font-semibold uppercase tracking-wide mb-3">
            Sessions
          </Text>
          {speaker.sessions.length === 0 ? (
            <Text className="text-body text-neutral-500">No sessions scheduled.</Text>
          ) : (
            speaker.sessions.map((session) => (
              <SessionListItem
                key={session.id}
                session={session}
                onPress={() => router.push(`/(schedule)/${session.id}`)}
              />
            ))
          )}
        </View>
      </View>
    </ScrollView>
  )
}
