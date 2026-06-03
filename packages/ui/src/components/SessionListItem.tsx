import React from 'react'
import { View, Text, Pressable } from 'react-native'
import type { SessionRef } from '@jprime/types'

interface SessionListItemProps {
  session: SessionRef
  onPress: () => void
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

export const SessionListItem: React.FC<SessionListItemProps> = ({ session, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center py-3 border-b border-neutral-100 active:bg-neutral-50 px-1"
    >
      <View className="flex-1">
        <Text className="text-body text-neutral-900 font-medium" numberOfLines={2}>
          {session.title}
        </Text>
        <Text className="text-caption text-neutral-500 mt-0.5">
          🕐 {formatTime(session.startTime)}
        </Text>
      </View>
      <Text className="text-neutral-400 ml-2">›</Text>
    </Pressable>
  )
}
