import React from 'react'
import { View, Text, ScrollView, ActivityIndicator, Pressable, StyleSheet } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSession } from '@jprime/api'
import { BookmarkButton, Badge, EmptyState } from '@jprime/ui'

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

const TYPE_VARIANTS: Record<string, 'primary' | 'info' | 'success' | 'glass'> = {
  keynote: 'primary',
  talk: 'info',
  workshop: 'success',
  break: 'glass',
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
  const badgeVariant = TYPE_VARIANTS[session.type] ?? 'glass'

  return (
    <ScrollView className="flex-1 bg-dark" contentContainerClassName="pb-12">
      <View style={styles.accentLine} />

      <View className="px-5 pt-5">
        <View className="flex-row items-center gap-2 mb-4">
          <Badge variant={badgeVariant} size="md">
            {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
          </Badge>
          {session.track && (
            <Badge variant="glass" size="md">{session.track}</Badge>
          )}
        </View>

        <Text className="text-h1 font-bold text-white mb-4">
          {session.title}
        </Text>

        <View style={styles.neonCard} className="mb-5">
          <View className="flex-row items-center gap-2 mb-2">
            <Ionicons name="time-outline" size={16} color="#39CBFB" />
            <Text className="text-body text-neutral-300">{timeLabel}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Ionicons name="location-outline" size={16} color="#39CBFB" />
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
            <View style={styles.sectionHeading} className="mb-3">
              <Text className="text-caption text-neutral-400 font-semibold uppercase tracking-wide">
                Speakers
              </Text>
            </View>
            {session.speakers.map((speaker) => (
              <Pressable
                key={speaker.id}
                onPress={() => router.push(`/(speakers)/${speaker.id}`)}
                style={styles.speakerRow}
                className="flex-row items-center active:opacity-70 mb-2 min-h-[44px]"
              >
                <View className="w-10 h-10 rounded-full bg-primary items-center justify-center mr-3">
                  <Text className="text-white text-sm font-bold">
                    {speaker.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <Text className="text-body text-white font-medium flex-1">{speaker.name}</Text>
                <Ionicons name="chevron-forward" size={18} color="#39CBFB" />
              </Pressable>
            ))}
          </View>
        )}

        {session.description && (
          <View className="mb-6">
            <View style={styles.sectionHeading} className="mb-3">
              <Text className="text-caption text-neutral-400 font-semibold uppercase tracking-wide">
                About this session
              </Text>
            </View>
            <Text className="text-body text-neutral-300 leading-relaxed">
              {session.description}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  accentLine: {
    height: 2,
    backgroundColor: '#E83283',
  },
  neonCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: '#39CBFB',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#39CBFB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionHeading: {
    borderLeftWidth: 2,
    borderLeftColor: '#39CBFB',
    paddingLeft: 12,
  },
  speakerRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
})
