import React from 'react'
import { View, Text, StyleSheet, Pressable, Clipboard, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface CodeDisplayProps {
  code: string
  size?: 'small' | 'medium' | 'large'
  showLabel?: boolean
  showCopyButton?: boolean
}

const SIZE_MAP = {
  small: { container: 120, codeFont: 24, labelFont: 12 },
  medium: { container: 160, codeFont: 32, labelFont: 14 },
  large: { container: 220, codeFont: 48, labelFont: 16 },
}

const DEFAULT_SIZE: 'medium' = 'medium'

export const CodeDisplay: React.FC<CodeDisplayProps> = ({
  code,
  size = DEFAULT_SIZE,
  showLabel = true,
  showCopyButton = true,
}) => {
  const sizes = SIZE_MAP[size]
  const formattedCode = code.toUpperCase()

  const handleCopy = async () => {
    try {
      await Clipboard.setString(formattedCode)
      Alert.alert('Copied!', 'Code copied to clipboard')
    } catch {
      Alert.alert('Error', 'Failed to copy code')
    }
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.codeContainer,
          {
            width: sizes.container,
            height: sizes.container,
            borderRadius: sizes.container * 0.15,
          },
        ]}
      >
        <Text style={[styles.codeText, { fontSize: sizes.codeFont }]}>
          {formattedCode}
        </Text>
      </View>

      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={[styles.labelTitle, { fontSize: sizes.labelFont }]}>
            My Connect Code
          </Text>
          <Text style={styles.labelSubtitle}>Share this code with others</Text>
        </View>
      )}

      {showCopyButton && (
        <Pressable
          onPress={handleCopy}
          style={({ pressed }) => [
            styles.copyBtn,
            pressed && styles.copyBtnPressed,
          ]}
        >
          <Ionicons name="copy-outline" size={sizes.labelFont + 2} color="#39CBFB" />
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1.5,
    borderColor: 'rgba(57, 203, 251, 0.25)',
    shadowColor: '#39CBFB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  codeText: {
    fontWeight: '700',
    color: '#39CBFB',
    fontFamily: 'Poppins-700',
    letterSpacing: 4,
  },
  labelContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  labelTitle: {
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins-600',
  },
  labelSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: 'Poppins-400',
    marginTop: 2,
  },
  copyBtn: {
    padding: 8,
    backgroundColor: 'rgba(57, 203, 251, 0.08)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(57, 203, 251, 0.25)',
  },
  copyBtnPressed: {
    backgroundColor: 'rgba(57, 203, 251, 0.15)',
  },
})
