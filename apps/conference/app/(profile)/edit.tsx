import { router } from 'expo-router'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { GlassCard, Input } from '@jprime/ui'
import { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useProfile, useUpdateProfile } from '../../hooks/useProfile'
import type { ProfileUpdate } from '../../lib/profileClient'

type FieldErrors = Partial<Record<keyof ProfileUpdate, string>>

function isHttpUrl(val: string): boolean {
  try {
    const u = new URL(val)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

function validate(form: ProfileUpdate): FieldErrors {
  const errors: FieldErrors = {}
  if (form.displayName && form.displayName.length > 100) {
    errors.displayName = 'Max 100 characters'
  }
  if (form.company && form.company.length > 100) {
    errors.company = 'Max 100 characters'
  }
  if (form.bio && form.bio.length > 280) {
    errors.bio = `${form.bio.length}/280 — too long`
  }
  const urlFields = ['avatarUrl', 'linkedinUrl', 'twitterUrl', 'githubUrl', 'websiteUrl'] as const
  for (const field of urlFields) {
    const val = form[field]
    if (val && !isHttpUrl(val)) {
      errors[field] = 'Must be a valid URL (https://…)'
    }
  }
  return errors
}

function nullify(s: string): string | null {
  const t = s.trim()
  return t.length > 0 ? t : null
}

export default function EditProfileScreen() {
  const { data: profile, isLoading } = useProfile()
  const { mutateAsync: save, isPending } = useUpdateProfile()

  const [form, setForm] = useState<ProfileUpdate>({
    displayName: null, company: null, bio: null,
    avatarUrl: null, linkedinUrl: null, twitterUrl: null,
    githubUrl: null, websiteUrl: null,
  })
  const [errors, setErrors] = useState<FieldErrors>({})

  // Populate form once profile loads
  useEffect(() => {
    if (profile) {
      setForm({
        displayName: profile.displayName,
        company: profile.company,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        linkedinUrl: profile.linkedinUrl,
        twitterUrl: profile.twitterUrl,
        githubUrl: profile.githubUrl,
        websiteUrl: profile.websiteUrl,
      })
    }
  }, [profile])

  const set = (field: keyof ProfileUpdate) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSave = async () => {
    const update: ProfileUpdate = {
      displayName: nullify(form.displayName ?? ''),
      company: nullify(form.company ?? ''),
      bio: nullify(form.bio ?? ''),
      avatarUrl: nullify(form.avatarUrl ?? ''),
      linkedinUrl: nullify(form.linkedinUrl ?? ''),
      twitterUrl: nullify(form.twitterUrl ?? ''),
      githubUrl: nullify(form.githubUrl ?? ''),
      websiteUrl: nullify(form.websiteUrl ?? ''),
    }
    const fieldErrors = validate(update)
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }
    await save(update)
    router.back()
  }

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color="#39CBFB" size="large" />
      </View>
    )
  }

  const str = (v: string | null | undefined) => v ?? ''

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.cancelBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="rgba(255,255,255,0.6)" />
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Text style={styles.title}>Edit Profile</Text>
          <Pressable
            style={[styles.saveBtn, isPending && styles.saveBtnDisabled]}
            onPress={() => void handleSave()}
            disabled={isPending}
          >
            {isPending
              ? <ActivityIndicator size="small" color="#212529" />
              : <Text style={styles.saveBtnText}>Save</Text>}
          </Pressable>
        </View>

        {/* Basic info */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionLabel}>Basic Info</Text>
          <Input
            variant="glass"
            label="Display Name"
            placeholder="Your full name"
            value={str(form.displayName)}
            onChangeText={set('displayName')}
            error={errors.displayName}
            autoCapitalize="words"
          />
          <View style={styles.spacer} />
          <Input
            variant="glass"
            label="Company"
            placeholder="Where you work"
            value={str(form.company)}
            onChangeText={set('company')}
            error={errors.company}
            autoCapitalize="words"
          />
        </GlassCard>

        {/* Bio */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionLabel}>About</Text>
          <Input
            variant="glass"
            label="Bio"
            placeholder="A short bio (max 280 chars)"
            value={str(form.bio)}
            onChangeText={set('bio')}
            error={errors.bio}
            hint={form.bio ? `${(form.bio ?? '').length}/280` : undefined}
            multiline
            numberOfLines={4}
          />
        </GlassCard>

        {/* Avatar */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionLabel}>Avatar</Text>
          <Input
            variant="glass"
            label="Avatar URL"
            placeholder="https://example.com/photo.jpg"
            value={str(form.avatarUrl)}
            onChangeText={set('avatarUrl')}
            error={errors.avatarUrl}
            hint="Leave empty to use your initials"
            keyboardType="url"
            autoCapitalize="none"
          />
        </GlassCard>

        {/* Social links */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionLabel}>Social Links</Text>
          <Input
            variant="glass"
            label="LinkedIn"
            placeholder="https://linkedin.com/in/you"
            value={str(form.linkedinUrl)}
            onChangeText={set('linkedinUrl')}
            error={errors.linkedinUrl}
            keyboardType="url"
            autoCapitalize="none"
            leftIcon={<Ionicons name="logo-linkedin" size={16} color="rgba(255,255,255,0.4)" />}
          />
          <View style={styles.spacer} />
          <Input
            variant="glass"
            label="Twitter / X"
            placeholder="https://x.com/you"
            value={str(form.twitterUrl)}
            onChangeText={set('twitterUrl')}
            error={errors.twitterUrl}
            keyboardType="url"
            autoCapitalize="none"
            leftIcon={<Ionicons name="logo-twitter" size={16} color="rgba(255,255,255,0.4)" />}
          />
          <View style={styles.spacer} />
          <Input
            variant="glass"
            label="GitHub"
            placeholder="https://github.com/you"
            value={str(form.githubUrl)}
            onChangeText={set('githubUrl')}
            error={errors.githubUrl}
            keyboardType="url"
            autoCapitalize="none"
            leftIcon={<Ionicons name="logo-github" size={16} color="rgba(255,255,255,0.4)" />}
          />
          <View style={styles.spacer} />
          <Input
            variant="glass"
            label="Website"
            placeholder="https://yoursite.com"
            value={str(form.websiteUrl)}
            onChangeText={set('websiteUrl')}
            error={errors.websiteUrl}
            keyboardType="url"
            autoCapitalize="none"
            leftIcon={<Ionicons name="globe-outline" size={16} color="rgba(255,255,255,0.4)" />}
          />
        </GlassCard>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#212529' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 20, paddingBottom: 60 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  cancelBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 4 },
  cancelText: { color: 'rgba(255,255,255,0.6)', fontSize: 14 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  saveBtn: { backgroundColor: '#39CBFB', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, minWidth: 60, alignItems: 'center' },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#212529', fontWeight: '700', fontSize: 14 },

  section: { padding: 20, marginBottom: 16 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
  spacer: { height: 16 },
})
