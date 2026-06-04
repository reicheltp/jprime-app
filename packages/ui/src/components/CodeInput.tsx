import React, { useEffect, useRef } from 'react'
import { TextInput, TextInputProps, View, Text, StyleSheet, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { validateConnectCode, formatConnectCode, CONNECT_CODE_LENGTH } from '@jprime/utils'

interface CodeInputProps extends Omit<TextInputProps, 'onChangeText' | 'value'> {
  value: string
  onChange: (value: string) => void
  error?: string
  label?: string
  autoFocus?: boolean
  onSubmit?: () => void
  showClear?: boolean
}

const COLORS = {
  cyan: '#39CBFB',
  white: '#FFFFFF',
  errorRed: '#FF4444',
  glass: 'rgba(255,255,255,0.07)',
  glassFocused: 'rgba(255,255,255,0.11)',
  glassBorder: 'rgba(255,255,255,0.13)',
  mutedText: 'rgba(255,255,255,0.45)',
  labelText: 'rgba(255,255,255,0.85)',
  dark: '#212529',
}

export const CodeInput: React.FC<CodeInputProps> = ({
  value,
  onChange,
  error,
  label = 'Connect Code',
  autoFocus = true,
  onSubmit,
  showClear = true,
  ...props
}) => {
  const inputRef = useRef<TextInput>(null)
  const formattedValue = formatConnectCode(value)

  // Auto-focus on mount
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleChange = (text: string) => {
    // Format to uppercase and limit to 5 characters
    const formatted = formatConnectCode(text)
    if (formatted.length <= CONNECT_CODE_LENGTH) {
      onChange(formatted)
    }
  }

  const handleClear = () => {
    onChange('')
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleSubmit = () => {
    if (value && onSubmit) {
      onSubmit()
    }
  }

  // Validate the current value
  const validation = validateConnectCode(formattedValue)
  const isValid = validation.valid
  const charCount = formattedValue.length

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View
        style={[
          styles.inputContainer,
          error ? styles.inputContainerError : {},
          isValid && formattedValue.length === CONNECT_CODE_LENGTH ? styles.inputContainerValid : {},
        ]}
      >
        <TextInput
          ref={inputRef}
          value={formattedValue}
          onChangeText={handleChange}
          placeholder="Enter 5-character code"
          placeholderTextColor={COLORS.mutedText}
          style={styles.input}
          maxLength={CONNECT_CODE_LENGTH}
          autoCapitalize="characters"
          autoCorrect={false}
          keyboardType="default"
          returnKeyType={onSubmit ? 'done' : 'default'}
          onSubmitEditing={handleSubmit}
          blurOnSubmit={!onSubmit}
          {...props}
        />

        {showClear && formattedValue.length > 0 && (
          <Pressable onPress={handleClear} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={20} color={COLORS.mutedText} />
          </Pressable>
        )}

        {isValid && formattedValue.length === CONNECT_CODE_LENGTH && (
          <View style={styles.validIndicator}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.cyan} />
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.charCount}>
          <Text
            style={[
              styles.charCountText,
              charCount === CONNECT_CODE_LENGTH && isValid
                ? styles.charCountValid
                : charCount > 0
                  ? styles.charCountActive
                  : styles.charCountInactive,
            ]}
          >
            {charCount}/{CONNECT_CODE_LENGTH}
          </Text>
        </View>

        {error && (
          <Text style={styles.errorText}>
            <Ionicons name="alert-circle" size={14} color={COLORS.errorRed} /> {error}
          </Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.labelText,
    fontFamily: 'Poppins-600',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: 10,
    paddingHorizontal: 14,
    minHeight: 52,
  },
  inputContainerError: {
    borderColor: COLORS.errorRed,
    borderWidth: 1.5,
  },
  inputContainerValid: {
    borderColor: COLORS.cyan,
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    fontFamily: 'Poppins-700',
    letterSpacing: 2,
    paddingVertical: 14,
  },
  clearBtn: {
    padding: 8,
  },
  validIndicator: {
    padding: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  charCount: {
    alignItems: 'center',
  },
  charCountText: {
    fontSize: 11,
    fontFamily: 'Poppins-400',
  },
  charCountInactive: {
    color: COLORS.mutedText,
  },
  charCountActive: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  charCountValid: {
    color: COLORS.cyan,
  },
  errorText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    color: COLORS.errorRed,
    fontFamily: 'Poppins-400',
  },
})
