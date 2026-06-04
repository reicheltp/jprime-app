---
title: Component Style Reference
description: Canonical React Native StyleSheet values for all shared UI components. The source of truth for visual consistency — use these exact values when building screens, not Tailwind className props.
type: architecture
last_updated: 2026-06-04
status: approved
---

# Component Style Reference

## The Golden Rule

**Use `StyleSheet.create` with explicit values. Never rely on `className` for React Native components.**

NativeWind/Tailwind `className` props work on the web but silently fail on iOS and Android — the styles are dropped without errors. The result is unstyled components that look broken on device. Always use `StyleSheet.create` with the concrete values documented here.

```tsx
// Wrong — className silently does nothing on native
<Pressable className="bg-primary rounded-md px-5 py-3">

// Correct — explicit StyleSheet values always apply
<Pressable style={[styles.btn, styles.btnPrimary]}>
```

---

## Shared Color Constants

These constants live in `packages/ui/src/components/Button.tsx` and `Input.tsx` today. **When adding a third component that needs them, extract to `packages/utils/src/constants/colors.ts` instead of duplicating.**

```ts
const COLORS = {
  // Brand
  magenta:      '#E83283',
  magentaDark:  '#C5226B',
  magentaGlow:  'rgba(232, 50, 131, 0.45)',
  cyan:         '#39CBFB',

  // Text
  white:        '#FFFFFF',
  mutedText:    'rgba(255, 255, 255, 0.45)',
  labelText:    'rgba(255, 255, 255, 0.85)',
  hintText:     'rgba(255, 255, 255, 0.38)',

  // Surfaces
  background:   '#212529',
  glass:        'rgba(255, 255, 255, 0.07)',
  glassFocused: 'rgba(255, 255, 255, 0.11)',
  glassBorder:  'rgba(255, 255, 255, 0.13)',
  ghostBorder:  'rgba(255, 255, 255, 0.22)',

  // States
  errorRed:     '#FF4444',
} as const
```

---

## Button

**File:** `packages/ui/src/components/Button.tsx`  
**Import:** `import { Button, PrimaryButton, SecondaryButton, GhostButton, GlassButton } from '@jprime/ui'`

### Variants

#### `primary` — main CTA

```ts
container: {
  backgroundColor: '#E83283',
  borderRadius: 10,
  shadowColor: '#E83283',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.55,
  shadowRadius: 14,
  elevation: 8,           // Android glow equivalent
}
text: { color: '#FFFFFF', fontWeight: '700', letterSpacing: 0.3 }
```

Use for: Sign In, Send Magic Code, Save, primary action per screen.

#### `secondary` — outlined action

```ts
container: {
  backgroundColor: 'transparent',
  borderWidth: 2,
  borderColor: '#E83283',
  borderRadius: 10,
}
text: { color: '#E83283', fontWeight: '700', letterSpacing: 0.3 }
```

Use for: secondary actions alongside a primary button.

#### `ghost` — subtle tertiary

```ts
container: {
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.22)',
  borderRadius: 10,
}
text: { color: 'rgba(255, 255, 255, 0.7)', fontWeight: '700' }
```

Use for: low-emphasis actions, filter chips, navigation hints.

#### `glass` — dark-surface contextual

```ts
container: {
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.14)',
  borderRadius: 10,
}
text: { color: '#FFFFFF', fontWeight: '700' }
```

Use for: Sign Out, destructive-but-not-dangerous actions placed on cards/dark surfaces.

### Sizes

| Size | `paddingHorizontal` | `paddingVertical` | `minHeight` | `fontSize` |
|------|---------------------|-------------------|-------------|------------|
| `sm` | 14 | 8 | 36 | 14 |
| `md` | 20 | 12 | 44 | 15 |
| `lg` | 28 | 15 | 52 | 17 |

All sizes meet the 44pt minimum touch target (AGENTS.md §3.6).

### Press & disabled states

```ts
pressed:  { opacity: 0.82, transform: [{ scale: 0.975 }] }
disabled: { opacity: 0.4 }
```

Apply `pressed` via the `Pressable` style callback:
```tsx
style={({ pressed }) => [styles.base, pressed && styles.pressed]}
```

### Usage examples

```tsx
// Full-width primary CTA
<Button variant="primary" size="lg" style={{ width: '100%' }}>
  Sign In
</Button>

// Inline secondary
<Button variant="secondary" size="md" onPress={onCancel}>
  Cancel
</Button>

// Sign out on profile screen
<Button variant="glass" size="md" onPress={signOut}>
  Sign Out
</Button>

// Loading state (shows ActivityIndicator, disables interaction)
<Button variant="primary" loading={isPending}>
  Save
</Button>
```

---

## Input

**File:** `packages/ui/src/components/Input.tsx`  
**Import:** `import { Input, GlassInput } from '@jprime/ui'`

### Anatomy

```
[Label text]
┌─────────────────────────────┐
│ [leftIcon?]  [text]  [rightIcon?] │
└─────────────────────────────┘
[Error text or hint text]
```

### Variants

#### `glass` — default for dark screens

```ts
// Default
wrapper: {
  backgroundColor: 'rgba(255, 255, 255, 0.07)',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.13)',
  borderRadius: 10,
  minHeight: 46,
}

// Focused
wrapper: {
  backgroundColor: 'rgba(255, 255, 255, 0.11)',
  borderColor: '#39CBFB',
  shadowColor: '#39CBFB',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.25,
  shadowRadius: 8,
}

// Error
wrapper: { borderColor: '#FF4444' }

text:            { color: '#FFFFFF', fontSize: 15 }
placeholderColor: 'rgba(255, 255, 255, 0.45)'
```

#### `standard` — light backgrounds only

```ts
wrapper: {
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: 'rgba(0, 0, 0, 0.15)',
  borderRadius: 10,
}
// Focused: borderColor: '#39CBFB' + cyan glow
text:            { color: '#212529', fontSize: 15 }
placeholderColor: 'rgba(0, 0, 0, 0.35)'
```

#### `minimal` — borderless, bottom-border only

```ts
wrapper: {
  backgroundColor: 'transparent',
  borderBottomWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.13)',
}
// Focused: borderColor: '#39CBFB'
```

### Label, hint, error typography

```ts
label: {
  fontSize: 13,
  fontWeight: '600',
  color: 'rgba(255, 255, 255, 0.85)',
  marginBottom: 7,
  letterSpacing: 0.1,
}
hint: { fontSize: 12, color: 'rgba(255, 255, 255, 0.38)', marginTop: 5 }
error: { fontSize: 12, color: '#FF4444', fontWeight: '500', marginTop: 5 }
```

### With icons

Pass an `<Ionicons>` node to `leftIcon` or `rightIcon`. The component handles padding automatically (`paddingLeft: 8` when `leftIcon` present, icon itself sits in a 12pt left-padded container).

```tsx
<Input
  variant="glass"
  label="LinkedIn"
  placeholder="https://linkedin.com/in/you"
  leftIcon={<Ionicons name="logo-linkedin" size={16} color="rgba(255,255,255,0.4)" />}
  value={value}
  onChangeText={onChange}
/>
```

### Multiline

Pass `multiline` and `numberOfLines`. The wrapper switches to `alignItems: 'flex-start'` and `minHeight: 96`.

```tsx
<Input
  variant="glass"
  label="Bio"
  placeholder="A short bio (max 280 chars)"
  multiline
  numberOfLines={4}
  hint={`${bio.length}/280`}
/>
```

---

## GlassCard

**File:** `packages/ui/src/components/GlassCard.tsx`  
**Import:** `import { GlassCard } from '@jprime/ui'`

Glass cards group related content on dark screens.

```ts
card: {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',   // glass surface
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.10)',        // glass border
  borderRadius: 12,
  padding: 20,
  marginBottom: 16,
}
```

> **Implementation note:** GlassCard must use `StyleSheet.create` — do not use `className="glass"`. CSS backdrop-filter is not supported in React Native; the visual effect comes from the semi-transparent `backgroundColor` alone.

### Section label inside a card

Use this pattern for section headers inside GlassCard (e.g. "BASIC INFO", "LINKS"):

```ts
sectionLabel: {
  fontSize: 11,
  fontWeight: '700',
  color: 'rgba(255, 255, 255, 0.40)',
  textTransform: 'uppercase',
  letterSpacing: 1,
  marginBottom: 12,
}
```

---

## Screen-level layout constants

Every screen uses these values. Hardcode them — do not derive from theme tokens at runtime.

```ts
const SCREEN = {
  background:     '#212529',
  padding:        20,          // horizontal screen padding
  paddingBottom:  40,          // scroll view bottom padding
  sectionGap:     16,          // vertical gap between GlassCards
}
```

---

## Implementing a new component — checklist

- [ ] Write all styles in `StyleSheet.create`. No `className` on native components.
- [ ] Use color values from the constants above. Do not hardcode new hex values without adding them to the constants block.
- [ ] Every interactive element has `minHeight: 44` (touch target rule, AGENTS.md §3.6).
- [ ] Pressed state uses `opacity: 0.82` + `scale(0.975)` via `Pressable` style callback.
- [ ] Disabled state uses `opacity: 0.4`.
- [ ] Focus state on inputs uses cyan border (`#39CBFB`) + cyan shadow.
- [ ] Error state uses `#FF4444` border and label text.
- [ ] Use `Ionicons` from `@expo/vector-icons` for all icons — no emoji.
- [ ] Run the app and visually verify before marking the task done.
