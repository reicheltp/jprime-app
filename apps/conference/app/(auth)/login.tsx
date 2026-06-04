import { Stack, router } from "expo-router"
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { Button, GlassCard, Input } from "@jprime/ui"
import { useState } from "react"
import { requestOtp } from "../../lib/authClient"

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (): boolean => {
    if (!email.trim()) {
      setEmailError("Email is required")
      return false
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address")
      return false
    }
    setEmailError("")
    return true
  }

  const handleSendCode = async () => {
    if (!validateEmail()) return
    setIsLoading(true)
    try {
      await requestOtp(email.trim().toLowerCase())
      router.push({
        pathname: "/(auth)/verify",
        params: { email: email.trim().toLowerCase() },
      })
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Failed to send code")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardView}
    >
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />

        <View style={styles.content}>
          <GlassCard style={styles.headerCard}>
            <Text style={styles.title}>Welcome to JPrime</Text>
            <Text style={styles.subtitle}>
              Enter your email to receive a sign-in code.{"\n"}No password
              needed.
            </Text>
          </GlassCard>

          <GlassCard style={styles.formCard}>
            <Input
              variant="glass"
              label="Email Address"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              value={email}
              onChangeText={(t) => {
                setEmail(t)
                setEmailError("")
              }}
              error={emailError}
            />

            <Button
              variant="primary"
              size="lg"
              onPress={handleSendCode}
              loading={isLoading}
              style={styles.button}
            >
              Send Magic Code
            </Button>
          </GlassCard>

          <Text style={styles.hint}>
            A 6-digit code will be sent to your inbox. It expires after 10
            minutes.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  keyboardView: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#212529",
    padding: 24,
  },
  content: { width: "100%", maxWidth: 400 },
  headerCard: { marginBottom: 24, alignItems: "center" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#39CBFB",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  formCard: { padding: 24 },
  button: { marginTop: 16 },
  hint: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 18,
  },
})
