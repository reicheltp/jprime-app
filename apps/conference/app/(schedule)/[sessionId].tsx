import React from 'react'
import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useSession } from '@jprime/api'
import { BookmarkButton, Badge, EmptyState } from '@jprime/ui'

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

const TYPE_VARIANTS: Record<string, 'primary' | 'info' | 'success' | 'secondary'> = {
  keynote: 'primary',
  talk: 'info',
  workshop: 'success',
  break: 'secondary',
}

export default function SessionDetailScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>()
  const { data: session, isLoading, isError } = useSession(sessionId ?? '')

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-dark">
        <ActivityIndicator size="large" color="#39CBFB" />
      </View>
    )
  }

  if (isError || !session) {
    return (
      <View className="flex-1 bg-dark">
        <EmptyState message="Session not found." />
      </View>
    )
  }

  const timeLabel = `${formatTime(session.startTime)} – ${formatTime(session.endTime)}`
  const badgeVariant = TYPE_VARIANTS[session.type] ?? 'secondary'

  return (
    <ScrollView className="flex-1 bg-dark" contentContainerClassName="pb-12">
      <View className="px-5 pt-5">
        <View className="flex-row items-center gap-2 mb-4">
          <Badge variant={badgeVariant} size="md">
            {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
          </Badge>
          {session.track && (
            <Badge variant="secondary" size="md">{session.track}</Badge>
          )}
        </View>

        <Text className="text-2xl font-bold text-white leading-tight mb-4">
          {session.title}
        </Text>

        <View className="flex-row flex-wrap gap-x-5 gap-y-2 mb-5">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-neutral-400">🕐</Text>
            <Text className="text-body text-neutral-300">{timeLabel}</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <Text className="text-neutral-400">📍</Text>
            <Text className="text-body text-neutral-300">{session.room}</Text>
          </View>
        </View>

        {session.type !== 'break' && (
          <View className="mb-5">
            <BookmarkButton sessionId={session.id} />
          </View>
        )}

        {session.speakers.length > 0 && (
          <View className="mb-6">
            <Text className="text-caption text-neutral-500 font-semibold uppercase tracking-wide mb-3">
              Speakers
            </Text>
            {session.speakers.map((speaker) => (
              <Pressable
                key={speaker.id}
                onPress={() => router.push(`/(speakers)/${speaker.id}`)}
                className="flex-row items-center py-3 active:opacity-70 min-h-[44px]"
              >
                <View className="w-10 h-10 rounded-full bg-primary items-center justify-center mr-3">
                  <Text className="text-white text-sm font-bold">
                    {speaker.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <Text className="text-body text-white font-medium">{speaker.name}</Text>
                <Text className="text-cyan ml-auto text-xl">›</Text>
              </Pressable>
            ))}
          </View>
        )}

        {session.description && (
          <View>
            <Text className="text-caption text-neutral-500 font-semibold uppercase tracking-wide mb-3">
              About this session
            </Text>
            <Text className="text-body text-neutral-300 leading-relaxed">
              {session.description}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}
