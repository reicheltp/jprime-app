import { Link, Stack } from "expo-router";
import { Text, View, Pressable } from "react-native";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// JPrime Design System Button Component
function Button({ children, variant = "primary", className, ...props }: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "glass";
  className?: string;
  [key: string]: any;
}) {
  const baseStyles = "rounded-md font-medium transition-all duration-200";
  
  const variantStyles = {
    primary: "bg-primary px-6 py-3 shadow-glow-purple hover:bg-primary-strong active:bg-primary-dark",
    secondary: "bg-transparent border-2 border-primary text-primary px-5 py-2.5 hover:bg-primary/10 active:bg-primary/20",
    glass: "glass glass-border text-white px-5 py-2.5 hover:bg-glass-strong active:bg-glass-strong",
  };

  return (
    <Pressable
      className={twMerge(clsx(baseStyles, variantStyles[variant], className))}
      {...props}
    >
      <Text className="text-inherit font-medium">{children}</Text>
    </Pressable>
  );
}

// JPrime Glass Card Component
function GlassCard({ children, className, ...props }: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <View
      className={twMerge(clsx("glass glass-border rounded-lg p-5", className))}
      {...props}
    >
      {children}
    </View>
  );
}

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: "JPrime Conference",
          headerStyle: {
            backgroundColor: "#FFFFFF",
          },
        }}
      />

      {/* Hero Section with Glass Card */}
      <View className="flex-1 justify-center items-center p-6">
        <View className="w-full max-w-md">
          {/* Logo/Title Section */}
          <GlassCard className="mb-8 border-2 border-cyan shadow-glow-cyan">
            <Text className="text-display text-center text-white font-bold">
              JPrime
            </Text>
            <Text className="text-h3 text-center text-cyan mt-1">
              Conference 2026
            </Text>
          </GlassCard>

          {/* Tagline */}
          <Text className="text-body text-center text-neutral-600 mb-8 px-4">
            The premier technology conference for developers, innovators, and
            thought leaders
          </Text>

          {/* Primary Actions */}
          <View className="flex-row gap-4 mb-4">
            <Link href="/(schedule)" asChild>
              <Button variant="primary">
                View Schedule
              </Button>
            </Link>
            <Link href="/(speakers)" asChild>
              <Button variant="secondary">
                Meet Speakers
              </Button>
            </Link>
          </View>

          {/* Secondary Actions */}
          <View className="flex-row gap-4">
            <Link href="/(venue)" asChild>
              <Button variant="glass">Venue Info</Button>
            </Link>
            <Link href="/(auth)/login" asChild>
              <Button variant="glass">Sign In</Button>
            </Link>
          </View>

          {/* Feature Highlights */}
          <View className="flex-row gap-4 mt-10">
            <GlassCard className="flex-1 items-center py-4">
              <Text className="text-cyan text-2xl">📅</Text>
              <Text className="text-caption text-white mt-2 text-center">
                Multi-Day
              </Text>
            </GlassCard>
            <GlassCard className="flex-1 items-center py-4">
              <Text className="text-cyan text-2xl">🎤</Text>
              <Text className="text-caption text-white mt-2 text-center">
                50+ Speakers
              </Text>
            </GlassCard>
            <GlassCard className="flex-1 items-center py-4">
              <Text className="text-cyan text-2xl">🏢</Text>
              <Text className="text-caption text-white mt-2 text-center">
                Hybrid
              </Text>
            </GlassCard>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View className="p-6 border-t border-neutral-100">
        <Text className="text-center text-caption text-neutral-400">
          JPrime Conference © 2026 | Powered with ❤️
        </Text>
      </View>
    </View>
  );
}
