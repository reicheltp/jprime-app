import { Link, Stack, router } from "expo-router";
import { Text, TextInput, View, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { Button, GlassCard, Input, SuccessBadge, WarningBadge } from "@jprime/ui";
import { clsx } from "clsx";
import { useState } from "react";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        router.replace("/(schedule)");
      }, 1500);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 justify-center items-center bg-neutral-50 p-6">
        <Stack.Screen
          options={{
            title: "Sign In",
            headerStyle: {
              backgroundColor: "#FFFFFF",
            },
            headerTintColor: "#212529",
          }}
        />

        <View className="w-full max-w-md">
          {/* Header */}
          <GlassCard className="mb-8 border-2 border-cyan shadow-glow-cyan">
            <Text className="text-h2 text-center text-white font-bold">
              Welcome Back
            </Text>
            <Text className="text-body text-center text-cyan mt-1">
              Sign in to access your conference schedule
            </Text>
          </GlassCard>

          {/* Form */}
          <GlassCard className="p-6">
            <View className="gap-4">
              {/* Email Input */}
              <Input
                variant="glass"
                label="Email Address"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                error={errors.email}
                hint="We'll never share your email"
              />

              {/* Password Input */}
              <Input
                variant="glass"
                label="Password"
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                error={errors.password}
                hint="Minimum 6 characters"
              />

              {/* Forgot Password */}
              <View className="flex-row justify-end">
                <Link href="/(auth)/forgot-password">
                  <Text className="text-caption text-cyan font-medium">
                    Forgot password?
                  </Text>
                </Link>
              </View>

              {/* Submit Button */}
              <Button
                variant="primary"
                size="lg"
                onPress={handleSubmit}
                loading={isLoading}
                className="w-full"
              >
                Sign In
              </Button>

              {/* Divider */}
              <View className="flex-row items-center gap-4 my-2">
                <View className="flex-1 h-px bg-glass-border" />
                <Text className="text-caption text-white/50">or</Text>
                <View className="flex-1 h-px bg-glass-border" />
              </View>

              {/* Social Login Buttons */}
              <View className="gap-3">
                <Button
                  variant="glass"
                  size="md"
                  className="w-full"
                  leftIcon={<Text className="text-lg">📧</Text>}
                >
                  Continue with Email
                </Button>
                <Button
                  variant="glass"
                  size="md"
                  className="w-full"
                  leftIcon={<Text className="text-lg">G</Text>}
                >
                  Continue with Google
                </Button>
                <Button
                  variant="glass"
                  size="md"
                  className="w-full"
                  leftIcon={<Text className="text-lg">🍎</Text>}
                >
                  Continue with Apple
                </Button>
              </View>
            </View>
          </GlassCard>

          {/* Footer */}
          <View className="flex-row justify-center gap-2 mt-6">
            <Text className="text-caption text-white/70">
              Don't have an account?
            </Text>
            <Link href="/(auth)/register">
              <Text className="text-caption text-cyan font-medium">
                Sign Up
              </Text>
            </Link>
          </View>

          {/* Security Notice */}
          <View className="flex-row items-center justify-center gap-2 mt-4">
            <SuccessBadge size="sm">✓</SuccessBadge>
            <Text className="text-xs text-white/50">
              Your data is secure with us
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
