import { router } from 'expo-router'
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Button, GlassCard } from '@jprime/ui'
import { useAuth } from '../../providers/AuthProvider'
import { useProfile } from '../../hooks/useProfile'
import type { Profile } from '../../lib/profileClient'

// ─── Avatar ───────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  '#E83283', '#39CBFB', '#7C3AED', '#059669', '#D97706', '#DC2626',
]

function avatarColor(seed: string): string {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = seed.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length] ?? '#39CBFB'
}

function profileInitials(profile: Profile): string {
  if (profile.displayName) {
    return profile.displayName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => (w[0] ?? '').toUpperCase())
      .join('')
  }
  return (profile.email[0] ?? '?').toUpperCase()
}

function Avatar({ profile }: { profile: Profile }) {
  return (
    <View style={[styles.avatar, { backgroundColor: avatarColor(profile.id) }]}>
      <Text style={styles.avatarText}>{profileInitials(profile)}</Text>
    </View>
  )
}

// ─── Social link ──────────────────────────────────────────────────────────────

type SocialIcon = 'logo-linkedin' | 'logo-twitter' | 'logo-github' | 'globe-outline'

function SocialLink({ icon, url, label }: { icon: SocialIcon; url: string; label: string }) {
  return (
    <Pressable style={styles.socialRow} onPress={() => void Linking.openURL(url)}>
      <Ionicons name={icon} size={18} color="#39CBFB" />
      <Text style={styles.socialLabel} numberOfLines={1}>{label}</Text>
      <Ionicons name="open-outline" size={14} color="rgba(255,255,255,0.3)" />
    </Pressable>
  )
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const { session, signOut } = useAuth()
  const { data: profile, isLoading, isError } = useProfile()

  if (!session) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="person-circle-outline" size={80} color="rgba(255,255,255,0.15)" />
        <Text style={styles.gateTitle}>Sign in to view your profile</Text>
        <Text style={styles.gateSub}>
          Create a profile so other attendees can find you during the conference.
        </Text>
        <Button
          variant="primary"
          size="lg"
          onPress={() => router.push('/(auth)/login')}
          style={styles.gateBtn}
        >
          Sign In
        </Button>
      </View>
    )
  }

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color="#39CBFB" size="large" />
      </View>
    )
  }

  if (isError || !profile) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Could not load profile. Try again later.</Text>
      </View>
    )
  }

  const socials: Array<{ icon: SocialIcon; url: string | null; label: string }> = [
    { icon: 'logo-linkedin', url: profile.linkedinUrl, label: 'LinkedIn' },
    { icon: 'logo-twitter',  url: profile.twitterUrl,  label: 'Twitter / X' },
    { icon: 'logo-github',   url: profile.githubUrl,   label: 'GitHub' },
    { icon: 'globe-outline', url: profile.websiteUrl,  label: 'Website' },
  ]
  const activeSocials = socials.filter((s) => !!s.url)

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>My Profile</Text>
        <Pressable style={styles.editBtn} onPress={() => router.push('/(profile)/edit')}>
          <Ionicons name="pencil-outline" size={18} color="#39CBFB" />
          <Text style={styles.editBtnText}>Edit</Text>
        </Pressable>
      </View>

      {/* Identity */}
      <GlassCard style={styles.identityCard}>
        <Avatar profile={profile} />
        <Text style={styles.name}>{profile.displayName ?? profile.email}</Text>
        {profile.company ? <Text style={styles.company}>{profile.company}</Text> : null}
        <Text style={styles.emailText}>{profile.email}</Text>
      </GlassCard>

      {/* Bio */}
      {profile.bio ? (
        <GlassCard style={styles.section}>
          <Text style={styles.sectionLabel}>About</Text>
          <Text style={styles.bio}>{profile.bio}</Text>
        </GlassCard>
      ) : null}

      {/* Social links */}
      {activeSocials.length > 0 ? (
        <GlassCard style={styles.section}>
          <Text style={styles.sectionLabel}>Links</Text>
          {activeSocials.map((s) => (
            <SocialLink key={s.label} icon={s.icon} url={s.url!} label={s.label} />
          ))}
        </GlassCard>
      ) : null}

      {/* Sign out */}
      <Button
        variant="glass"
        size="md"
        onPress={() => void signOut()}
        style={styles.signOutBtn}
      >
        Sign Out
      </Button>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#212529' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  scroll: { padding: 20, paddingBottom: 40 },

  // Unauthenticated
  gateTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginTop: 20, textAlign: 'center' },
  gateSub: { fontSize: 14, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 8, lineHeight: 20 },
  gateBtn: { marginTop: 24, width: '100%', maxWidth: 280 },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  screenTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: 'rgba(57,203,251,0.1)' },
  editBtnText: { color: '#39CBFB', fontSize: 14, fontWeight: '600' },

  // Identity card
  identityCard: { alignItems: 'center', padding: 24, marginBottom: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  name: { fontSize: 20, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  company: { fontSize: 14, color: '#39CBFB', marginTop: 4, textAlign: 'center' },
  emailText: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 6 },

  // Sections
  section: { padding: 20, marginBottom: 16 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  bio: { fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 22 },

  // Social
  socialRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  socialLabel: { flex: 1, fontSize: 14, color: 'rgba(255,255,255,0.75)' },

  // Sign out
  signOutBtn: { marginTop: 8 },

  errorText: { color: 'rgba(255,255,255,0.5)', fontSize: 14 },
})
