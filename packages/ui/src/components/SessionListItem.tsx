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
      className="flex-row items-center py-3 border-b border-neutral-700 active:bg-neutral-800 px-1 min-h-[44px]"
    >
      <View className="flex-1">
        <Text className="text-body text-white font-medium" numberOfLines={2}>
          {session.title}
        </Text>
        <Text className="text-caption text-neutral-400 mt-0.5">
          🕐 {formatTime(session.startTime)}
        </Text>
      </View>
      <Text className="text-cyan ml-2 text-xl">›</Text>
    </Pressable>
  )
}
