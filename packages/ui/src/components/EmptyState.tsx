import React from 'react'
import { View, Text, Pressable } from 'react-native'

interface EmptyStateProps {
  message: string
  action?: {
    label: string
    onPress: () => void
  }
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message, action }) => {
  return (
    <View className="flex-1 justify-center items-center p-8">
      <Text className="text-4xl mb-4">📭</Text>
      <Text className="text-body text-neutral-500 text-center mb-6">{message}</Text>
      {action && (
        <Pressable
          onPress={action.onPress}
          className="px-5 py-2.5 border border-primary rounded-md"
        >
          <Text className="text-primary font-medium">{action.label}</Text>
        </Pressable>
      )}
    </View>
  )
}
