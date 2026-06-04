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
} from '@jprime/utils'
import type { Connection } from '@jprime/types'
import { useAuth } from '../../providers/AuthProvider'

const SCAN_DEBOUNCE_MS = 1500 // Prevent rapid multiple scans

export default function QRScannerScreen() {
  const { session } = useAuth()
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)
  const [isScanning, setIsScanning] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastScanTime, setLastScanTime] = useState<number>(0)

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
      return () => {}
    }, [])
  )

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

      // Check if scanning own QR code
      if (qrData.email === session?.user.email) {
        setError('Cannot connect to yourself')
        setIsScanning(true)
        return
      }

      try {
        // Check if already connected
        const existing = await isConnected(qrData.email)
        if (existing) {
          const connection = await getConnection(qrData.email)
          const connectionType = connection?.connectionType
          if (connectionType === 'OUTGOING') {
            Alert.alert('Already Connected', `You're already connected to ${qrData.displayName}`)
          } else {
            // It's an incoming connection - ask if they want to connect back
            Alert.alert(
              'Connect Back?',
              `${qrData.displayName} has connected with you. Would you like to connect back?`,
              [
                { text: 'Cancel', style: 'cancel', onPress: () => setIsScanning(true) },
                {
                  text: 'Connect Back',
                  onPress: async () => {
                    await addOutgoingConnection(qrData)
                    Alert.alert(
                      'Connected!',
                      `You've connected with ${qrData.displayName}`,
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
        await addOutgoingConnection(qrData)
        Alert.alert(
          'Connected!',
          `You've connected with ${qrData.displayName}`,
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
        setIsScanning(true)
      }
    },
    [lastScanTime, session?.user.email]
  )

  // Handle permission states
  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    )
  }

  if (!permission.granted) {
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
      </View>
    )
  }

  return (
    <View style={styles.container}>
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

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color="#E83283" />
          <Text style={styles.errorMessage}>{error}</Text>
          {scanned && (
            <Pressable onPress={() => setIsScanning(true)} style={styles.scanAgainBtn}>
              <Text style={styles.scanAgainText}>Scan Again</Text>
            </Pressable>
          )}
        </View>
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
  },
  retryBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins-600',
  },
})
