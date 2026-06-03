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
      className="flex-row items-center glass glass-border rounded-lg p-4 mb-3 active:bg-glass-strong"
    >
      <SpeakerAvatar photoUrl={speaker.photoUrl} name={speaker.fullName} size="sm" />
      <View className="flex-1 ml-3">
        <Text className="text-body text-white font-semibold">{speaker.fullName}</Text>
        <Text className="text-caption text-neutral-400 mt-0.5">
          {sessionCount} {sessionCount === 1 ? 'session' : 'sessions'}
        </Text>
      </View>
      <Text className="text-cyan">›</Text>
    </Pressable>
  )
}
