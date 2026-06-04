import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, StyleSheet, Pressable, Alert, Platform } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { router, useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import {
  parseQRCodeData,
  isValidConnectionQRCode,
  addOutgoingConnection,
  isConnected,
  getConnection,
  validateConnectCode,
  isOwnCode,
  connectCodeToQRCodeData,
} from '@jprime/utils'
import type { Connection, ConnectCodeLookupResult } from '@jprime/types'
import { useAuth } from '../../providers/AuthProvider'
import { CodeEntryModal } from '@jprime/ui'
import { lookupByConnectCode } from '../../lib/connectCodesClient'

const SCAN_DEBOUNCE_MS = 1500 // Prevent rapid multiple scans

export default function QRScannerScreen() {
  const { session } = useAuth()
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)
  const [isScanning, setIsScanning] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastScanTime, setLastScanTime] = useState<number>(0)
  
  // Code entry modal state
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [codeError, setCodeError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [userConnectCode, setUserConnectCode] = useState<string | null>(null)

  // Request camera permission on mount
  useEffect(() => {
    requestPermission()
  }, [requestPermission])

  // Reset scanned state when screen comes back into focus
  useFocusEffect(
    useCallback(() => {
      setScanned(false)
      setIsScanning(true)
      setError(null)
      setCodeError('')
      return () => {}
    }, [])
  )

  // Load user's connect code (or create if doesn't exist)
  useEffect(() => {
    if (session?.token) {
      const loadCode = async () => {
        try {
          // Import dynamically to avoid circular dependency
          const { getOrCreateConnectCode } = await import('../../lib/connectCodesClient')
          const code = await getOrCreateConnectCode(session.token)
          setUserConnectCode(code)
        } catch {
          // Failed to get or create code
          setUserConnectCode(null)
        }
      }
      loadCode()
    }
  }, [session?.token])

  // Toggle between QR and code entry
  const [activeTab, setActiveTab] = useState<'qr' | 'code'>('qr')

  const handleScan = useCallback(
    async (result: { type: string; data: string }) => {
      const now = Date.now()

      // Debounce rapid scans
      if (now - lastScanTime < SCAN_DEBOUNCE_MS) {
        return
      }
      setLastScanTime(now)
      setScanned(true)
      setIsScanning(false)
      setError(null)

      // Check if valid connection QR code
      if (!isValidConnectionQRCode(result.data)) {
        setError('Invalid QR code - please scan an attendee code')
        setIsScanning(true)
        return
      }

      // Parse QR code
      const qrData = parseQRCodeData(result.data)
      if (!qrData) {
        setError('Failed to parse QR code data')
        setIsScanning(true)
        return
      }

      // Process connection
      await processConnection(qrData.email, qrData.displayName, 'qr')
    },
    [lastScanTime, session?.user.email]
  )

  const processConnection = useCallback(
    async (attendeeId: string, displayName: string, source: 'qr' | 'code') => {
      // Check if scanning own QR/code
      if (attendeeId === session?.user.email) {
        setError('Cannot connect to yourself')
        if (source === 'qr') setIsScanning(true)
        return
      }

      try {
        // Check if already connected
        const existing = await isConnected(attendeeId)
        if (existing) {
          const connection = await getConnection(attendeeId)
          const connectionType = connection?.connectionType
          if (connectionType === 'OUTGOING') {
            Alert.alert('Already Connected', `You're already connected to ${displayName}`)
          } else {
            // It's an incoming connection - ask if they want to connect back
            Alert.alert(
              'Connect Back?',
              `${displayName} has connected with you. Would you like to connect back?`,
              [
                { text: 'Cancel', style: 'cancel' as const, onPress: () => source === 'qr' && setIsScanning(true) },
                {
                  text: 'Connect Back',
                  onPress: async () => {
                    const qrData = { email: attendeeId, displayName }
                    await addOutgoingConnection(qrData)
                    Alert.alert(
                      'Connected!',
                      `You've connected with ${displayName}`,
                      [
                        {
                          text: 'View Connections',
                          onPress: () => router.replace('/(connections)/'),
                        },
                      ]
                    )
                  },
                },
              ]
            )
          }
          return
        }

        // Add new connection
        await addOutgoingConnection({ email: attendeeId, displayName })
        Alert.alert(
          'Connected!',
          `You've connected with ${displayName}`,
          [
            {
              text: 'View Connections',
              onPress: () => router.replace('/(connections)/'),
            },
            { text: 'Scan Again', onPress: () => setIsScanning(true) },
          ]
        )
      } catch {
        setError('Failed to save connection')
        if (source === 'qr') setIsScanning(true)
      }
    },
    [session?.user.email]
  )

  const handleCodeSubmit = useCallback(
    async (code: string) => {
      setIsLoading(true)
      setCodeError('')

      try {
        // Validate code
        const validation = validateConnectCode(code)
        if (!validation.valid) {
          setCodeError(validation.error || 'Invalid code')
          setIsLoading(false)
          return
        }

        // Check if own code
        if (isOwnCode(code, userConnectCode)) {
          setCodeError('Cannot connect to yourself')
          setIsLoading(false)
          return
        }

        // Look up attendee by code
        const lookupResult = await lookupByConnectCode(validation.code!)

        // Process the connection
        await processConnection(lookupResult.attendeeId, lookupResult.displayName, 'code')
        
        // Close modal on success
        setShowCodeModal(false)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to connect'
        setCodeError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [userConnectCode, processConnection]
  )

  // Handle tab switch
  const handleTabSwitch = useCallback((tab: 'qr' | 'code') => {
    setActiveTab(tab)
    setError(null)
    setCodeError('')
    if (tab === 'qr') {
      setScanned(false)
      setIsScanning(true)
    }
  }, [])

  // Handle permission states
  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    )
  }

  if (!permission.granted && activeTab === 'qr') {
    return (
      <View style={styles.container}>
        <Ionicons name="camera-off-outline" size={64} color="#808080" />
        <Text style={styles.errorTitle}>Camera Access Required</Text>
        <Text style={styles.errorText}>
          {Platform.OS === 'web'
            ? 'Please allow camera access to scan QR codes.'
            : 'Please enable camera permissions in settings to scan QR codes.'}
        </Text>
        <Pressable style={styles.retryBtn} onPress={requestPermission}>
          <Text style={styles.retryBtnText}>Request Permission</Text>
        </Pressable>
        
        <View style={styles.divider} />
        
        <Pressable style={styles.alternativeBtn} onPress={() => handleTabSwitch('code')}>
          <Ionicons name="code-outline" size={20} color="#39CBFB" />
          <Text style={styles.alternativeBtnText}>Enter Connect Code Instead</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'qr' && styles.tabActive]}
          onPress={() => handleTabSwitch('qr')}
        >
          <Ionicons name="qr-code-outline" size={20} color={activeTab === 'qr' ? '#39CBFB' : 'rgba(255, 255, 255, 0.4)'} />
          <Text style={[styles.tabText, activeTab === 'qr' && styles.tabTextActive]}>Scan QR</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'code' && styles.tabActive]}
          onPress={() => handleTabSwitch('code')}
        >
          <Ionicons name="code-outline" size={20} color={activeTab === 'code' ? '#39CBFB' : 'rgba(255, 255, 255, 0.4)'} />
          <Text style={[styles.tabText, activeTab === 'code' && styles.tabTextActive]}>Enter Code</Text>
        </Pressable>
      </View>

      {activeTab === 'qr' ? (
        <>
          <View style={styles.scannerContainer}>
            <CameraView
              style={styles.scanner}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              onBarcodeScanned={isScanning ? handleScan : undefined}
            />
            <View style={styles.overlay}>
              <View style={styles.overlayTop} />
              <View style={styles.overlaySides} />
              <View style={styles.scanFrame}>
                <View style={styles.cornerTopLeft} />
                <View style={styles.cornerTopRight} />
                <View style={styles.cornerBottomLeft} />
                <View style={styles.cornerBottomRight} />
              </View>
              <View style={styles.overlaySides} />
              <View style={styles.overlayBottom} />
            </View>
          </View>

          <View style={styles.instructions}>
            <Text style={styles.instructionsTitle}>Scan an Attendee QR Code</Text>
            <Text style={styles.instructionsText}>
              Point your camera at another attendee's QR code to connect with them
            </Text>
          </View>
        </>
      ) : (
        <View style={styles.codeContainer}>
          <View style={styles.codeInstructions}>
            <Ionicons name="code-working-outline" size={48} color="#39CBFB" />
            <Text style={styles.codeInstructionsTitle}>Enter Connect Code</Text>
            <Text style={styles.codeInstructionsText}>
              Enter the 5-character code shared by another attendee
            </Text>
          </View>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color="#E83283" />
          <Text style={styles.errorMessage}>{error}</Text>
          {scanned && activeTab === 'qr' && (
            <Pressable onPress={() => setIsScanning(true)} style={styles.scanAgainBtn}>
              <Text style={styles.scanAgainText}>Scan Again</Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Code Entry Modal */}
      <CodeEntryModal
        visible={showCodeModal}
        onSubmit={handleCodeSubmit}
        onCancel={() => setShowCodeModal(false)}
        isLoading={isLoading}
        error={codeError}
      />

      {/* Open code modal when code tab is active and modal isn't shown */}
      {activeTab === 'code' && !showCodeModal && (
        <Pressable
          style={styles.openCodeBtn}
          onPress={() => setShowCodeModal(true)}
        >
          <Ionicons name="code-outline" size={24} color="#FFFFFF" />
          <Text style={styles.openCodeBtnText}>Enter Connect Code</Text>
        </Pressable>
      )}
    </View>
  )
}

const SIZE = 250
const BORDER_WIDTH = 4
const BORDER_COLOR = '#39CBFB'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212529',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: 'rgba(57, 203, 251, 0.1)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: 'Poppins-600',
  },
  tabTextActive: {
    color: '#39CBFB',
  },
  scannerContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  scanner: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  overlaySides: {
    width: '100%',
    height: SIZE,
    flexDirection: 'row',
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  scanFrame: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cornerTopLeft: {
    width: 40,
    height: 40,
    borderLeftWidth: BORDER_WIDTH,
    borderTopWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
  },
  cornerTopRight: {
    width: 40,
    height: 40,
    borderRightWidth: BORDER_WIDTH,
    borderTopWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    alignSelf: 'flex-end',
  },
  cornerBottomLeft: {
    width: 40,
    height: 40,
    borderLeftWidth: BORDER_WIDTH,
    borderBottomWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
  },
  cornerBottomRight: {
    width: 40,
    height: 40,
    borderRightWidth: BORDER_WIDTH,
    borderBottomWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    alignSelf: 'flex-end',
  },
  codeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  codeInstructions: {
    alignItems: 'center',
    marginBottom: 40,
  },
  codeInstructionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins-600',
    marginTop: 16,
  },
  codeInstructionsText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'Poppins-400',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  instructions: {
    padding: 24,
    alignItems: 'center',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins-600',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'Poppins-400',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: 'rgba(232, 50, 131, 0.08)',
    borderRadius: 8,
    margin: 16,
  },
  errorMessage: {
    flex: 1,
    fontSize: 14,
    color: '#E83283',
    fontFamily: 'Poppins-400',
  },
  scanAgainBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#E83283',
    borderRadius: 6,
  },
  scanAgainText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins-600',
  },
  loadingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'Poppins-400',
    textAlign: 'center',
    marginTop: 40,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins-600',
    marginTop: 20,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'Poppins-400',
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 24,
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: 30,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#E83283',
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins-600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 20,
    width: '80%',
    alignSelf: 'center',
  },
  alternativeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: 'rgba(57, 203, 251, 0.1)',
    borderRadius: 10,
    marginHorizontal: 24,
  },
  alternativeBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#39CBFB',
    fontFamily: 'Poppins-600',
  },
  openCodeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: '#39CBFB',
    borderRadius: 12,
    margin: 24,
    minHeight: 56,
  },
  openCodeBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212529',
    fontFamily: 'Poppins-700',
  },
})
