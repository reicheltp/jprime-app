import { Stack, router, useLocalSearchParams } from "expo-router"
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native"
import { Button, GlassCard } from "@jprime/ui"
import { useState } from "react"
import { supabase } from "../../lib/supabase"

export default function VerifyScreen() {
  const { email } = useLocalSearchParams<{ email: string }>()
  const [code, setCode] = useState("")
  const [codeError, setCodeError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const handleVerify = async () => {
    if (code.length !== 6) {
      setCodeError("Please enter the full 6-digit code")
      return
    }
    setCodeError("")
    setIsLoading(true)
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    })
    setIsLoading(false)
    if (error) {
      setCodeError(error.message)
      return
    }
    router.replace("/(schedule)")
  }

  const handleResend = async () => {
    setIsResending(true)
    await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    })
    setIsResending(false)
    setCode("")
    setCodeError("")
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
            <Text style={styles.title}>Check Your Email</Text>
            <Text style={styles.subtitle}>
              We sent a 6-digit code to
            </Text>
            <Text style={styles.emailText}>{email}</Text>
          </GlassCard>

          <GlassCard style={styles.formCard}>
            <Text style={styles.label}>Enter Code</Text>
            <TextInput
              style={[styles.codeInput, codeError ? styles.codeInputError : null]}
              value={code}
              onChangeText={(t) => {
                setCode(t.replace(/\D/g, "").slice(0, 6))
                setCodeError("")
              }}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="000000"
              placeholderTextColor="rgba(255,255,255,0.25)"
              textContentType="oneTimeCode"
              autoComplete="one-time-code"
              autoFocus
            />
            {codeError ? (
              <Text style={styles.errorText}>{codeError}</Text>
            ) : null}

            <Button
              variant="primary"
              size="lg"
              onPress={handleVerify}
              loading={isLoading}
              style={styles.verifyButton}
            >
              Verify Code
            </Button>

            <Button
              variant="glass"
              size="md"
              onPress={handleResend}
              loading={isResending}
              style={styles.resendButton}
            >
              Resend Code
            </Button>
          </GlassCard>

          <Button
            variant="glass"
            size="sm"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            ← Use a different email
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#212529",
    padding: 24,
  },
  content: {
    width: "100%",
    maxWidth: 400,
  },
  headerCard: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    marginTop: 8,
  },
  emailText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#39CBFB",
    textAlign: "center",
    marginTop: 4,
  },
  formCard: {
    padding: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
    marginBottom: 12,
  },
  codeInput: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 8,
    color: "#ffffff",
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 10,
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  codeInputError: {
    borderColor: "#E83283",
  },
  errorText: {
    color: "#E83283",
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
  verifyButton: {
    marginTop: 20,
  },
  resendButton: {
    marginTop: 8,
  },
  backButton: {
    marginTop: 16,
    alignSelf: "center",
  },
})
