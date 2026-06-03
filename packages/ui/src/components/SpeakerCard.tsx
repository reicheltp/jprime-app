import React from 'react'
import { View, Text, Pressable } from 'react-native'
import type { Speaker } from '@jprime/types'
import { SpeakerAvatar } from './SpeakerAvatar'

interface SpeakerCardProps {
  speaker: Speaker
  onPress: () => void
}

export const SpeakerCard: React.FC<SpeakerCardProps> = ({ speaker, onPress }) => {
  const sessionCount = speaker.sessions.length

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center bg-white border border-neutral-100 rounded-lg p-4 mb-3 shadow-sm active:bg-neutral-50"
    >
      <SpeakerAvatar photoUrl={speaker.photoUrl} name={speaker.fullName} size="sm" />
      <View className="flex-1 ml-3">
        <Text className="text-body text-neutral-900 font-semibold">{speaker.fullName}</Text>
        <Text className="text-caption text-neutral-500 mt-0.5">
          {sessionCount} {sessionCount === 1 ? 'session' : 'sessions'}
        </Text>
      </View>
      <Text className="text-neutral-400">›</Text>
    </Pressable>
  )
}
