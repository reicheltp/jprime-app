import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { generateQRCodeData } from '@jprime/utils'

interface QRCodeDisplayProps {
  email: string
  displayName: string
  size?: number
  showLabel?: boolean
}

const DEFAULT_SIZE = 200

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  email,
  displayName,
  size = DEFAULT_SIZE,
  showLabel = true,
}) => {
  const qrData = generateQRCodeData(email, displayName)
  const containerSize = size + 32 // size + 2*padding (16 each side)

  return (
    <View style={styles.container}>
      <View style={[styles.qrContainer, { width: containerSize, height: containerSize }]}>
        <QRCode
          value={qrData}
          size={size}
          color="#39CBFB"
          backgroundColor="transparent"
          logoSize={0}
          logoBackgroundColor="transparent"
          getRef={() => {}}
        />
      </View>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={styles.labelTitle}>My QR Code</Text>
          <Text style={styles.labelSubtitle}>
            Share this to connect with others
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(57, 203, 251, 0.2)',
    shadowColor: '#39CBFB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    marginTop: 14,
    alignItems: 'center',
  },
  labelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins-600',
  },
  labelSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: 'Poppins-400',
    marginTop: 4,
  },
})
