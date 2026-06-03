import { Stack } from 'expo-router'

export default function VenueLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#212529',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '700',
          fontFamily: 'Poppins-700',
          fontSize: 18,
        },
        contentStyle: {
          backgroundColor: '#212529',
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Venue' }} />
    </Stack>
  )
}
