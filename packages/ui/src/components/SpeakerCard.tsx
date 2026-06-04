import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
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
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <SpeakerAvatar photoUrl={speaker.photoUrl} name={speaker.fullName} size="sm" />
      <View style={styles.info}>
        <Text style={styles.name}>{speaker.fullName}</Text>
        <Text style={styles.sessions}>
          {sessionCount} {sessionCount === 1 ? 'session' : 'sessions'}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.3)" />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 14,
  },
  cardPressed: {
    backgroundColor: 'rgba(255,255,255,0.11)',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sessions: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 3,
  },
})
