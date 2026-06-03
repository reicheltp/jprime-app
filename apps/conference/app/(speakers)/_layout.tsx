import { Stack } from 'expo-router'

export default function SpeakersLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTintColor: '#212529',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Speakers' }} />
      <Stack.Screen name="[speakerId]" options={{ title: 'Speaker' }} />
    </Stack>
  )
}
