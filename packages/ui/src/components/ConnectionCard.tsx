import React from 'react'
import { View, Text, Pressable, StyleSheet, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { AttendeeProfile, Connection } from '@jprime/types'

interface ConnectionCardProps {
  connection: Connection
  attendeeProfile: AttendeeProfile | null
  onConnectBack?: () => void
  showConnectBackButton?: boolean
}

const getInitials = (displayName: string | null, email: string): string => {
  if (displayName) {
    return displayName
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0]?.toUpperCase())
      .slice(0, 2)
      .join('')
  }
  return email[0]?.toUpperCase() ?? '?'
}

export const ConnectionCard: React.FC<ConnectionCardProps> = ({
  connection,
  attendeeProfile,
  onConnectBack,
  showConnectBackButton = false,
}) => {
  const profile = attendeeProfile
  const displayName = connection.displayName
  const initials = getInitials(displayName, connection.attendeeId)

  return (
    <View style={styles.card}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {profile?.avatarUrl ? (
          <Image
            source={{ uri: profile.avatarUrl }}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name}>{displayName}</Text>
        {profile && (
          <>
            {profile.company && (
              <Text style={styles.detail} numberOfLines={1}>
                {profile.company}
              </Text>
            )}
            {profile.bio && (
              <Text style={styles.detail} numberOfLines={1}>
                {profile.bio}
              </Text>
            )}
          </>
        )}
        <Text style={styles.email}>{connection.attendeeId}</Text>
      </View>

      {/* Connect Back Button */}
      {showConnectBackButton && onConnectBack && (
        <Pressable
          onPress={onConnectBack}
          style={({ pressed }) => [
            styles.connectBackBtn,
            pressed && styles.connectBackBtnPressed,
          ]}
        >
          <Ionicons name="add-circle" size={20} color="#39CBFB" />
          <Text style={styles.connectBackText}>Connect</Text>
        </Pressable>
      )}

      {/* Connection Type Indicator */}
      <View style={styles.typeIndicator}>
        <Text style={styles.typeText}>
          {connection.connectionType === 'OUTGOING' ? 'Connected' : 'Connected to Me'}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 14,
    minHeight: 80,
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#39CBFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(57, 203, 251, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#39CBFB',
    fontFamily: 'Poppins-600',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins-600',
    marginBottom: 2,
  },
  detail: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'Poppins-400',
    marginBottom: 1,
  },
  email: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.35)',
    fontFamily: 'Poppins-400',
  },
  connectBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(57, 203, 251, 0.08)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(57, 203, 251, 0.3)',
    minHeight: 36,
  },
  connectBackBtnPressed: {
    backgroundColor: 'rgba(57, 203, 251, 0.15)',
  },
  connectBackText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#39CBFB',
    fontFamily: 'Poppins-600',
  },
  typeIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(57, 203, 251, 0.1)',
    borderRadius: 6,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#39CBFB',
    fontFamily: 'Poppins-600',
    textAlign: 'center',
  },
})
