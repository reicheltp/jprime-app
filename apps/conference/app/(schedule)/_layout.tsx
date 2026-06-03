import { Tabs } from 'expo-router'

export default function ScheduleLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#E83283',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: { borderTopColor: '#F3F4F6' },
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTintColor: '#212529',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Schedule',
          tabBarLabel: 'Schedule',
        }}
      />
      <Tabs.Screen
        name="my-schedule"
        options={{
          title: 'My Schedule',
          tabBarLabel: 'My Schedule',
        }}
      />
      <Tabs.Screen
        name="[sessionId]"
        options={{
          href: null,
          headerShown: true,
          title: 'Session',
        }}
      />
    </Tabs>
  )
}
