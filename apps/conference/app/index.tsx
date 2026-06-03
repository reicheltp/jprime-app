import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const FEATURES: { icon: IoniconName; label: string }[] = [
  { icon: "calendar-outline", label: "Multi-Day" },
  { icon: "people-outline", label: "50+ Speakers" },
  { icon: "wifi-outline", label: "Hybrid" },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <View style={styles.inner}>
          {/* Brand card */}
          <View style={styles.brandCard}>
            <Text style={styles.brandTitle}>JPrime</Text>
            <Text style={styles.brandSubtitle}>Conference 2026</Text>
          </View>

          {/* Tagline */}
          <Text style={styles.tagline}>
            The premier technology conference for developers, innovators, and
            thought leaders
          </Text>

          {/* Primary CTAs */}
          <View style={styles.ctaRow}>
            <Link href="/(schedule)" asChild>
              <Pressable
                style={({ pressed }) => [
                  styles.btnPrimary,
                  pressed && styles.btnPrimaryPressed,
                ]}
              >
                <Text style={styles.btnPrimaryText}>View Schedule</Text>
              </Pressable>
            </Link>
            <Link href="/(speakers)" asChild>
              <Pressable
                style={({ pressed }) => [
                  styles.btnSecondary,
                  pressed && styles.btnSecondaryPressed,
                ]}
              >
                <Text style={styles.btnSecondaryText}>Meet Speakers</Text>
              </Pressable>
            </Link>
          </View>

          {/* Secondary links */}
          <View style={styles.linkRow}>
            <Link href="/(venue)" asChild>
              <Pressable style={styles.linkBtn}>
                <Text style={styles.linkCyan}>Venue Info</Text>
              </Pressable>
            </Link>
            <Link href="/(auth)/login" asChild>
              <Pressable style={styles.linkBtn}>
                <Text style={styles.linkMuted}>Sign In</Text>
              </Pressable>
            </Link>
          </View>

          {/* Feature highlights */}
          <View style={styles.featureRow}>
            {FEATURES.map(({ icon, label }) => (
              <View key={label} style={styles.featureCard}>
                <Ionicons name={icon} size={28} color="#39CBFB" />
                <Text style={styles.featureLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>JPrime Conference © 2026</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#212529",
  },
  container: {
    flexGrow: 1,
  },
  hero: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  inner: {
    width: "100%",
    maxWidth: 480,
  },
  brandCard: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 2,
    borderColor: "#39CBFB",
    borderRadius: 12,
    paddingVertical: 28,
    paddingHorizontal: 24,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#39CBFB",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 6,
  },
  brandTitle: {
    fontSize: 42,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 50,
    fontFamily: "Poppins-700",
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#39CBFB",
    marginTop: 4,
    fontFamily: "Poppins-600",
  },
  tagline: {
    fontSize: 14,
    color: "#ADB5BD",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  ctaRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: "#E83283",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  btnPrimaryPressed: {
    backgroundColor: "#D71A5C",
  },
  btnPrimaryText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Poppins-600",
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#E83283",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  btnSecondaryPressed: {
    backgroundColor: "rgba(232, 50, 131, 0.1)",
  },
  btnSecondaryText: {
    color: "#E83283",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Poppins-600",
  },
  linkRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 36,
  },
  linkBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  linkCyan: {
    color: "#39CBFB",
    fontSize: 14,
    fontWeight: "500",
  },
  linkMuted: {
    color: "#808080",
    fontSize: 14,
    fontWeight: "500",
  },
  featureRow: {
    flexDirection: "row",
    gap: 12,
  },
  featureCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  featureLabel: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
  },
  footer: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#495057",
  },
});
