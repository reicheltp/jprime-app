import { Stack } from 'expo-router'
import { Redirect, useSegments } from 'expo-router'
import { useAuth } from '../../providers/AuthProvider'

/**
 * Connections route group layout
 * Requires authentication - redirects to login if not signed in
 */
export default function ConnectionsLayout() {
  const { session, isLoading } = useAuth()
  const segments = useSegments()

  // Redirect to login if not authenticated
  if (!isLoading && !session) {
    return <Redirect href="/(auth)/login" />
  }

  // Only render when authenticated
  if (isLoading) {
    return null
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        contentStyle: { backgroundColor: '#212529' },
        headerStyle: {
          backgroundColor: '#1a1d20',
          borderBottomColor: 'rgba(255, 255, 255, 0.08)',
          borderBottomWidth: 1,
        },
        headerTintColor: '#39CBFB',
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          fontFamily: 'Poppins-600',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'My Connections',
        }}
      />
      <Stack.Screen
        name="scan"
        options={{
          title: 'Scan QR Code',
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  )
}
