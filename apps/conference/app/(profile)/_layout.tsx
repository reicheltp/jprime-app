import { Stack } from 'expo-router'

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#212529' } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="edit" />
    </Stack>
  )
}
