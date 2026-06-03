import { Stack } from 'expo-router'

export default function ScheduleLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: 'rgba(33, 37, 41, 0.95)',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '700',
          fontFamily: 'Poppins-700',
          fontSize: 18,
        },
        headerShadowVisible: true,
        contentStyle: {
          backgroundColor: '#212529',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Schedule',
        }}
      />
      <Stack.Screen
        name="my-schedule"
        options={{
          title: 'My Schedule',
        }}
      />
      <Stack.Screen
        name="[sessionId]"
        options={{
          title: 'Session',
        }}
      />
    </Stack>
  )
}
