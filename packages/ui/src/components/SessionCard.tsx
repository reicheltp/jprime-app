import React from 'react'
import { View, Text, Pressable } from 'react-native'
import type { Session } from '@jprime/types'

interface SessionCardProps {
  session: Session
  isBookmarked: boolean
  hasConflict?: boolean
  onPress: () => void
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

const TRACK_COLORS: Record<string, string> = {
  'Track 1': 'bg-primary',
  'Track 2': 'bg-cyan',
  'Workshop': 'bg-teal',
}

function trackColor(track: string | null): string {
  if (!track) return 'bg-neutral-600'
  return TRACK_COLORS[track] ?? 'bg-neutral-600'
}

const TYPE_LABELS: Record<string, string> = {
  talk: 'Talk',
  workshop: 'Workshop',
  keynote: 'Keynote',
  break: 'Break',
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  isBookmarked,
  hasConflict = false,
  onPress,
}) => {
  const timeLabel = `${formatTime(session.startTime)} – ${formatTime(session.endTime)}`
  const speakerNames = session.speakers.map((s) => s.name).join(', ')

  return (
    <Pressable
      onPress={onPress}
      className="glass glass-border rounded-lg p-4 mb-3 active:bg-glass-strong"
    >
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 mr-3">
          <Text className="text-h4 text-white font-semibold leading-tight" numberOfLines={2}>
            {session.title}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          {hasConflict && (
            <View className="bg-warning rounded-sm px-1.5 py-0.5">
              <Text className="text-xs text-neutral-900 font-semibold">!</Text>
            </View>
          )}
          {isBookmarked && (
            <Text className="text-cyan text-lg">🔖</Text>
          )}
        </View>
      </View>

      <View className="flex-row items-center flex-wrap gap-2 mb-2">
        {session.track && (
          <View className={`${trackColor(session.track)} rounded-sm px-2 py-0.5`}>
            <Text className="text-xs text-white font-semibold">{session.track}</Text>
          </View>
        )}
        <View className="bg-neutral-700 rounded-sm px-2 py-0.5">
          <Text className="text-xs text-neutral-300 font-medium">{TYPE_LABELS[session.type] ?? session.type}</Text>
        </View>
      </View>

      <View className="flex-row items-center gap-3">
        <Text className="text-caption text-neutral-400">🕐 {timeLabel}</Text>
        <Text className="text-caption text-neutral-400">📍 {session.room}</Text>
      </View>

      {speakerNames.length > 0 && (
        <Text className="text-caption text-neutral-300 mt-1" numberOfLines={1}>
          🎤 {speakerNames}
        </Text>
      )}
    </Pressable>
  )
}
