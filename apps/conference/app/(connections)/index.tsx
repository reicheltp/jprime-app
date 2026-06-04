import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import {
  getOutgoingConnections,
  getIncomingConnections,
  connectBack,
  getAllConnections,
} from '@jprime/utils'
import type { Connection, AttendeeProfile } from '@jprime/types'
import { ConnectionCard, QRCodeDisplay, CodeDisplay } from '@jprime/ui'
import { useAuth } from '../../providers/AuthProvider'
import { useProfile } from '../../hooks/useProfile'

// Mock attendee profiles - in a real app, this would come from a conference API
// For now, we'll use the profile data from the app's existing data
const createMockProfile = (
  email: string,
  displayName: string
): AttendeeProfile => ({
  id: email,
  email,
  displayName,
  company: null,
  bio: null,
  avatarUrl: null,
  linkedinUrl: null,
  twitterUrl: null,
  githubUrl: null,
  websiteUrl: null,
})

export default function ConnectionsScreen() {
  const { session } = useAuth()
  const { data: userProfile } = useProfile()
  const [outgoing, setOutgoing] = useState<Connection[]>([])
  const [incoming, setIncoming] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [userConnectCode, setUserConnectCode] = useState<string | null>(null)
  const [loadingCode, setLoadingCode] = useState(false)

  // Get user's own data
  const userDisplayName = userProfile?.displayName ?? session?.user.email.split('@')[0] ?? ''
  const userEmail = session?.user.email ?? ''

  // Load user's connect code (backend auto-creates if doesn't exist)
  useEffect(() => {
    if (session?.token) {
      const loadCode = async () => {
        try {
          setLoadingCode(true)
          const { getConnectCode } = await import('../../lib/connectCodesClient')
          const code = await getConnectCode(session.token)
          setUserConnectCode(code)
        } catch {
          // Failed to load code
          setUserConnectCode(null)
        } finally {
          setLoadingCode(false)
        }
      }
      loadCode()
    }
  }, [session?.token])

  // Load connections
  const loadConnections = useCallback(async () => {
    try {
      const { outgoing: out, incoming: inc } = await getAllConnections()
      setOutgoing(out)
      setIncoming(inc)
    } catch {
      // Error loading connections - continue with empty arrays
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadConnections()
  }, [loadConnections])

  const handleRefresh = () => {
    setRefreshing(true)
    loadConnections()
  }

  const handleConnectBack = useCallback(
    async (attendeeId: string) => {
      try {
        await connectBack(attendeeId)
        // Refresh the lists
        await loadConnections()
      } catch {
        // Error - could show toast
      }
    },
    [loadConnections]
  )

  const renderConnection = useCallback(
    ({ item }: { item: Connection }) => {
      // In a real app, we'd look up the full profile from conference data
      // For now, create a mock profile
      const profile = createMockProfile(item.attendeeId, item.displayName)
      const isIncoming = item.connectionType === 'INCOMING'

      return (
        <ConnectionCard
          connection={item}
          attendeeProfile={profile}
          onConnectBack={() => handleConnectBack(item.attendeeId)}
          showConnectBackButton={isIncoming}
        />
      )
    },
    [handleConnectBack]
  )

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      {/* User's QR Code and Connect Code */}
      <View style={styles.codeSection}>
        <View style={styles.qrAndCodeRow}>
          <QRCodeDisplay email={userEmail} displayName={userDisplayName} size={140} showLabel={false} />
          {userConnectCode && !loadingCode ? (
            <CodeDisplay code={userConnectCode} size="small" showLabel={false} showCopyButton={true} />
          ) : (
            <View style={styles.codePlaceholder}>
              <ActivityIndicator size="small" color="#39CBFB" />
              <Text style={styles.codePlaceholderText}>Loading code...</Text>
            </View>
          )}
        </View>
        
        <View style={styles.shareInfo}>
          <Text style={styles.shareTitle}>Share to Connect</Text>
          <Text style={styles.shareText}>
            {userConnectCode
              ? `Share your QR code or code: ${userConnectCode.toUpperCase()}`
              : 'Share your QR code for others to scan'}
          </Text>
        </View>
        
        <Pressable
          style={styles.profileBtn}
          onPress={() => router.push('/(profile)')}
        >
          <Ionicons name="person-circle-outline" size={20} color="#39CBFB" />
          <Text style={styles.profileBtnText}>Profile</Text>
        </Pressable>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{outgoing.length}</Text>
          <Text style={styles.statLabel}>My Connections</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{incoming.length}</Text>
          <Text style={styles.statLabel}>Connected to Me</Text>
        </View>
      </View>

      {/* Section Headers */}
      <Text style={styles.sectionTitle}>My Connections</Text>
      {outgoing.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={48} color="rgba(255,255,255,0.3)" />
          <Text style={styles.emptyStateText}>
            You haven't connected with anyone yet
          </Text>
          <Text style={styles.emptyStateSubtext}>
            {userConnectCode 
              ? `Enter someone's code or scan their QR`
              : 'Scan someone\'s QR code to connect'
            }
          </Text>
        </View>
      )}
    </View>
  )

  const ListFooter = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Connected to Me</Text>
      {incoming.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="person-add-outline" size={48} color="rgba(255,255,255,0.3)" />
          <Text style={styles.emptyStateText}>
            No one has connected with you yet
          </Text>
          <Text style={styles.emptyStateSubtext}>
            {userConnectCode
              ? `Share your code or QR for others to connect`
              : 'Share your QR code for others to scan'}
          </Text>
        </View>
      )}
    </View>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#39CBFB" />
        <Text style={styles.loadingText}>Loading connections...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <FlatList
          data={outgoing}
          renderItem={renderConnection}
          keyExtractor={(item) => item.attendeeId}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={ListFooter}
          scrollEnabled={false}
        />

        {/* Incoming connections list */}
        <FlatList
          data={incoming}
          renderItem={renderConnection}
          keyExtractor={(item) => item.attendeeId}
          scrollEnabled={false}
        />
      </ScrollView>

      {/* Scan Button */}
      <Pressable
        style={({ pressed }) => [
          styles.scanBtn,
          pressed && styles.scanBtnPressed,
        ]}
        onPress={() => router.push('/(connections)/scan')}
      >
        <Ionicons name="scan-outline" size={24} color="#FFFFFF" />
        <Text style={styles.scanBtnText}>Scan</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212529',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100, // Space for scan button
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212529',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'Poppins-400',
  },
  headerContainer: {
    marginBottom: 16,
  },
  codeSection: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 14,
  },
  qrAndCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  shareInfo: {
    alignItems: 'center',
    marginTop: 8,
  },
  shareTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins-600',
    marginBottom: 4,
  },
  shareText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: 'Poppins-400',
  },
  codePlaceholder: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  codePlaceholderText: {
    marginTop: 8,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.3)',
    fontFamily: 'Poppins-400',
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(57, 203, 251, 0.08)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(57, 203, 251, 0.25)',
  },
  profileBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#39CBFB',
    fontFamily: 'Poppins-600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#39CBFB',
    fontFamily: 'Poppins-700',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: 'Poppins-400',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins-600',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionContainer: {
    marginTop: 24,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginTop: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: 'Poppins-400',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.25)',
    fontFamily: 'Poppins-400',
    marginTop: 6,
  },
  scanBtn: {
    position: 'absolute',
    bottom: 24,
    left: '50%',
    transform: [{ translateX: -60 }],
    width: 120,
    height: 56,
    backgroundColor: '#E83283',
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#E83283',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  scanBtnPressed: {
    backgroundColor: '#D71A5C',
  },
  scanBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins-600',
  },
})
