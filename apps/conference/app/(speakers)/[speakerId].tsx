import React from 'react'
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useSpeaker } from '@jprime/api'
import { SpeakerAvatar, SessionListItem, EmptyState } from '@jprime/ui'

export default function SpeakerDetailScreen() {
  const { speakerId } = useLocalSearchParams<{ speakerId: string }>()
  const { data: speaker, isLoading, isError } = useSpeaker(speakerId ?? '')

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#39CBFB" />
      </View>
    )
  }

  if (isError || !speaker) {
    return (
      <View style={styles.screen}>
        <EmptyState message="Speaker not found." />
      </View>
    )
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.avatarRing}>
          <SpeakerAvatar photoUrl={speaker.photoUrl} name={speaker.fullName} size="lg" />
        </View>
        <Text style={styles.name}>{speaker.fullName}</Text>
        {speaker.sessions.length > 0 && (
          <Text style={styles.sessionCount}>
            {speaker.sessions.length} {speaker.sessions.length === 1 ? 'session' : 'sessions'}
          </Text>
        )}
      </View>

      {/* Bio */}
      {speaker.bio && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>About</Text>
          <Text style={styles.bio}>{speaker.bio}</Text>
        </View>
      )}

      {/* Sessions */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Sessions</Text>
        {speaker.sessions.length === 0 ? (
          <Text style={styles.empty}>No sessions scheduled.</Text>
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
    </ScrollView>
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
  content: {
    paddingBottom: 48,
  },
  hero: {
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 28,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
    marginBottom: 8,
  },
  avatarRing: {
    padding: 4,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'rgba(232,50,131,0.4)',
    shadowColor: '#E83283',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 18,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 30,
  },
  sessionCount: {
    marginTop: 6,
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 22,
  },
  empty: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
  },
})
