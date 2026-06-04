import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Button } from './Button'

interface EmptyStateProps {
  message: string
  action?: {
    label: string
    onPress: () => void
  }
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message, action }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="mail-outline" size={48} color="rgba(255,255,255,0.18)" style={styles.icon} />
      <Text style={styles.message}>{message}</Text>
      {action && (
        <Button variant="secondary" size="md" onPress={action.onPress} style={styles.action}>
          {action.label}
        </Button>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    marginBottom: 16,
  },
  message: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  action: {
    minWidth: 160,
  },
})
