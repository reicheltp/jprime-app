import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Inter_400Regular } from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// Import global CSS for Tailwind
import "./global.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Prevent splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

// Font loading hook
function useLoadedFonts() {
  const [fontsLoaded, fontError] = useFonts({
    "Poppins-400": Poppins_400Regular,
    "Poppins-500": Poppins_500Medium,
    "Poppins-600": Poppins_600SemiBold,
    "Poppins-700": Poppins_700Bold,
    "Inter-400": Inter_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  return fontsLoaded;
}

// This is the root layout for the entire app
// All other layouts inherit from this

export default function RootLayout() {
  useLoadedFonts();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerStyle: styles.header,
            headerTintColor: "#212529",
            headerTitleStyle: styles.headerTitle,
            contentStyle: styles.content,
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: "JPrime Conference",
            }}
          />
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(schedule)"
            options={{
              title: "Schedule",
            }}
          />
          <Stack.Screen
            name="(speakers)"
            options={{
              title: "Speakers",
            }}
          />
          <Stack.Screen
            name="(venue)"
            options={{
              title: "Venue",
            }}
          />
        </Stack>
      </QueryClientProvider>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#FFFFFF",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontWeight: "700",
    fontFamily: "Poppins-700",
    fontSize: 18,
  },
  content: {
    backgroundColor: "#FFFFFF",
  },
});
