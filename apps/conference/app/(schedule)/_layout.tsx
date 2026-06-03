import { Stack } from "expo-router";

export default function ScheduleLayout() {
  return (
    <Stack
      screenOptions={{
        title: "Schedule",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[sessionId]" />
    </Stack>
  );
}
