import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { Session } from '@jprime/types'

interface SessionCardProps {
  session: Session
  isBookmarked: boolean
  hasConflict?: boolean
  onPress: () => void
}

type TypeConfig = {
  label: string
  accentColor: string
  labelColor: string
  labelBg: string
}

const TYPE_CONFIG: Record<string, TypeConfig> = {
  keynote:  { label: 'Keynote',  accentColor: '#E83283', labelColor: '#FFFFFF',  labelBg: 'rgba(232, 50, 131, 0.2)' },
  talk:     { label: 'Talk',     accentColor: '#39CBFB', labelColor: '#39CBFB',  labelBg: 'rgba(57, 203, 251, 0.15)' },
  workshop: { label: 'Workshop', accentColor: '#41D7A7', labelColor: '#41D7A7',  labelBg: 'rgba(65, 215, 167, 0.15)' },
  break:    { label: 'Break',    accentColor: '#495057', labelColor: '#ADB5BD',  labelBg: 'rgba(255, 255, 255, 0.05)' },
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  isBookmarked,
  hasConflict = false,
  onPress,
}) => {
  const config = TYPE_CONFIG[session.type] ?? TYPE_CONFIG.break
  const timeLabel = `${formatTime(session.startTime)} – ${formatTime(session.endTime)}`
  const speakerNames = session.speakers.map((s) => s.name).join(', ')

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={[styles.accentBar, { backgroundColor: config.accentColor }]} />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>{session.title}</Text>
          <View style={styles.titleIcons}>
            {hasConflict && (
              <View style={styles.conflictBadge}>
                <Text style={styles.conflictText}>!</Text>
              </View>
            )}
            {isBookmarked && <Ionicons name="bookmark" size={16} color="#39CBFB" />}
          </View>
        </View>

        <View style={styles.badgeRow}>
          {session.track && (
            <View style={styles.trackBadge}>
              <Text style={styles.trackText}>{session.track}</Text>
            </View>
          )}
          <View style={[styles.typeBadge, { backgroundColor: config.labelBg }]}>
            <Text style={[styles.typeText, { color: config.labelColor }]}>{config.label}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={13} color="#808080" />
            <Text style={styles.metaText}> {timeLabel}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={13} color="#808080" />
            <Text style={styles.metaText}> {session.room}</Text>
          </View>
        </View>

        {speakerNames.length > 0 && (
          <View style={styles.speakerRow}>
            <Ionicons name="person-outline" size={13} color="#808080" />
            <Text style={styles.speakerText} numberOfLines={1}> {speakerNames}</Text>
          </View>
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
  },
  accentBar: {
    width: 3,
  },
  content: {
    flex: 1,
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  titleIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 2,
  },
  conflictBadge: {
    backgroundColor: '#FFC107',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  conflictText: {
    fontSize: 11,
    color: '#212529',
    fontWeight: '700',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  trackBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  trackText: {
    fontSize: 11,
    color: '#CACACA',
    fontWeight: '600',
  },
  typeBadge: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#808080',
    lineHeight: 18,
  },
  speakerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  speakerText: {
    fontSize: 12,
    color: '#ADB5BD',
    lineHeight: 18,
    flex: 1,
  },
})
