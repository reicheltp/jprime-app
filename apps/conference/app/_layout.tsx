import { Tabs } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
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
// Using Tabs for route groups with nested navigation
export default function RootLayout() {
  useLoadedFonts();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" />
        <Tabs
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: "#212529",
            },
            tabBarActiveTintColor: "#39CBFB",
            tabBarInactiveTintColor: "#ADB5BD",
            tabBarStyle: {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderTopColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <Tabs.Screen
            name="(schedule)"
            options={{
              title: "Schedule",
              href: null,
            }}
          />
          <Tabs.Screen
            name="(speakers)"
            options={{
              title: "Speakers",
              href: null,
            }}
          />
          <Tabs.Screen
            name="(venue)"
            options={{
              title: "Venue",
              href: null,
            }}
          />
        </Tabs>
      </QueryClientProvider>
    </>
  );
}
