import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Modal, Pressable, KeyboardAvoidingView, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { CodeInput } from './CodeInput'
import { Button } from './Button'
import { validateConnectCode, CONNECT_CODE_LENGTH } from '@jprime/utils'

interface CodeEntryModalProps {
  visible: boolean
  onSubmit: (code: string) => void
  onCancel: () => void
  isLoading?: boolean
  error?: string
}

export const CodeEntryModal: React.FC<CodeEntryModalProps> = ({
  visible,
  onSubmit,
  onCancel,
  isLoading = false,
  error: externalError,
}) => {
  const [code, setCode] = useState('')
  const [internalError, setInternalError] = useState<string>('')

  // Clear code when modal opens/closes
  useEffect(() => {
    if (visible) {
      setCode('')
      setInternalError('')
    }
  }, [visible])

  const handleSubmit = () => {
    const validation = validateConnectCode(code)
    
    if (!validation.valid) {
      setInternalError(validation.error || 'Invalid code')
      return
    }

    if (code.length !== CONNECT_CODE_LENGTH) {
      setInternalError(`Code must be ${CONNECT_CODE_LENGTH} characters`)
      return
    }

    onSubmit(validation.code!)
  }

  const handleCancel = () => {
    setCode('')
    setInternalError('')
    onCancel()
  }

  const isValid = validateConnectCode(code).valid && code.length === CONNECT_CODE_LENGTH

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoiding}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Enter Connect Code</Text>
              <Text style={styles.subtitle}>
                Enter the 5-character code from the attendee you want to connect with
              </Text>
            </View>

            {/* Input */}
            <CodeInput
              value={code}
              onChange={setCode}
              error={internalError || externalError}
              autoFocus={visible}
              onSubmit={handleSubmit}
            />

            {/* Buttons */}
            <View style={styles.buttons}>
              <Button
                variant="ghost"
                onPress={handleCancel}
                disabled={isLoading}
                style={styles.cancelBtn}
                leftIcon={<Ionicons name="close-outline" size={18} color="rgba(255,255,255,0.7)" />}
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                onPress={handleSubmit}
                disabled={!isValid || isLoading}
                loading={isLoading}
                style={styles.submitBtn}
                leftIcon={<Ionicons name="person-add-outline" size={18} color="#FFFFFF" />}
              >
                Connect
              </Button>
            </View>

            {/* Help Text */}
            <View style={styles.helpContainer}>
              <Ionicons name="information-circle-outline" size={16} color="rgba(255, 255, 255, 0.4)" />
              <Text style={styles.helpText}>
                Use characters: 2-9, A-Z (excluding 0, 1, I, O, L)
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  keyboardAvoiding: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#212529',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins-700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'Poppins-400',
    lineHeight: 18,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  cancelBtn: {
    flex: 1,
  },
  submitBtn: {
    flex: 1,
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  helpText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.45)',
    fontFamily: 'Poppins-400',
  },
})
