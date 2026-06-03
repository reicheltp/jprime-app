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
      <Text className="text-body text-neutral-400 text-center mb-6">{message}</Text>
      {action && (
        <Pressable
          onPress={action.onPress}
          className="px-6 py-3 bg-primary rounded-md min-h-[44px] justify-center"
        >
          <Text className="text-white font-medium">{action.label}</Text>
        </Pressable>
      )}
    </View>
  )
}
