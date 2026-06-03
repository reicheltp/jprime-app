---
version: alpha
name: JPrime Conference
description: Cyberpunk-inspired conference app design system with neon accents, glass-morphism, and high-contrast dark themes

colors:
  # Primary Palette
  primary: "#E83283"
  primary-strong: "#E92763"
  primary-status: "#E91E63"

  # Accent Colors
  cyan: "#39CBFB"
  cyan-neon: "#39CBFB"
  orange: "#FD7E14"
  teal: "#41D7A7"

  # Warning/Alert
  warning: "#FFC107"

  # Neutral Scale
  neutral-900: "#212529"
  neutral-800: "#343A40"
  neutral-600: "#666666"
  neutral-500: "#808080"
  neutral-400: "#ADB5BD"
  neutral-300: "#CACACA"
  neutral-200: "#E9E9E8"
  neutral-100: "#DEE2E6"
  neutral-50: "#808080"

  # Surface & Borders
  white: "#FFFFFF"
  black: "#000000"
  glass: "rgba(255, 255, 255, 0.05)"
  glass-strong: "rgba(255, 255, 255, 0.08)"
  glass-border: "rgba(255, 255, 255, 0.1)"
  disabled: "#808080"
  muted: "#ADB5BD"

  # Semantic Colors
  success: "{colors.teal}"
  error: "{colors.primary}"

typography:
  font-family-sans: "Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
  font-family-secondary: "'Open Sans', 'Trebuchet MS', 'Lucida Grande', sans-serif"

  display:
    fontFamily: "{typography.font-family-sans}"
    fontSize: 38px
    fontWeight: 700
    lineHeight: 45.6px
    letterSpacing: 0px

  h1:
    fontFamily: "{typography.font-family-sans}"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 52px
    letterSpacing: 0px

  h2:
    fontFamily: "{typography.font-family-sans}"
    fontSize: 22px
    fontWeight: 400
    lineHeight: 40px
    letterSpacing: 0px

  h3:
    fontFamily: "{typography.font-family-sans}"
    fontSize: 16px
    fontWeight: 700
    lineHeight: 19.2px
    letterSpacing: 0px

  h4:
    fontFamily: "{typography.font-family-sans}"
    fontSize: 14px
    fontWeight: 700
    lineHeight: 16.8px
    letterSpacing: 0px

  body:
    fontFamily: "{typography.font-family-sans}"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 25px
    letterSpacing: 0px

  button:
    fontFamily: "{typography.font-family-sans}"
    fontSize: 20px
    fontWeight: 400
    lineHeight: 20px

  input:
    fontFamily: "{typography.font-family-secondary}"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 26px

  caption:
    fontFamily: "{typography.font-family-sans}"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 18px
    letterSpacing: 0px

spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 32px
  3xl: 60px
  4xl: 72px
  5xl: 152px
  mega: 152px

rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px

elevation:
  none: "none"
  surface: "0 2px 8px 0 rgba(0, 0, 0, 0.1)"
  raised: "0 4px 16px 0 rgba(0, 0, 0, 0.15)"
  floating: "0 8px 24px 0 rgba(0, 0, 0, 0.2)"
  high: "0 4px 30px 0 rgba(0, 0, 0, 0.3)"
  glow-purple: "0 4px 15px 0 rgba(139, 92, 246, 0.4)"
  glow-cyan: "0 0 20px 0 rgba(57, 203, 251, 0.3)"
  glow-white: "0 0 15px 0 rgba(255, 255, 255, 0.6)"
  glass-shadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "{spacing.md} {spacing.xl}"
    typography: "{typography.button}"
    shadow: "{elevation.glow-purple}"
    border: "none"
    height: auto

  button-primary-hover:
    backgroundColor: "{colors.primary-strong}"
    shadow: "0 6px 20px 0 rgba(139, 92, 246, 0.6)"

  button-primary-active:
    backgroundColor: "#D71A5C"
    shadow: "0 2px 10px 0 rgba(139, 92, 246, 0.3)"

  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    borderColor: "{colors.primary}"
    borderWidth: 1px
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.lg}"
    typography: "{typography.button}"

  button-secondary-hover:
    backgroundColor: "rgba(232, 50, 131, 0.1)"
    borderColor: "{colors.primary-strong}"

  button-secondary-active:
    backgroundColor: "rgba(232, 50, 131, 0.2)"
    borderColor: "#D71A5C"

  button-ghost:
    backgroundColor: "transparent"
    textColor: "rgba(0, 0, 0, 0.65)"
    borderColor: "rgba(0, 0, 0, 0.15)"
    borderWidth: 1px
    rounded: "{rounded.md}"
    padding: "{spacing.xs} {spacing.md}"

  button-ghost-hover:
    backgroundColor: "rgba(0, 0, 0, 0.05)"
    textColor: "{colors.black}"
    borderColor: "rgba(0, 0, 0, 0.25)"

  button-ghost-active:
    backgroundColor: "rgba(0, 0, 0, 0.1)"
    textColor: "{colors.neutral-900}"

  card:
    backgroundColor: "{colors.white}"
    borderColor: "{colors.neutral-100}"
    borderWidth: 1px
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    shadow: "{elevation.surface}"

  card-hover:
    shadow: "{elevation.raised}"

  card-glass:
    backgroundColor: "{colors.glass}"
    borderColor: "{colors.glass-border}"
    borderWidth: 1px
    rounded: "{rounded.lg}"
    padding: "{spacing.xl} {spacing.lg}"
    shadow: "{elevation.glass-shadow}"
    backdropFilter: "blur(10px)"

  card-neon:
    backgroundColor: "rgba(255, 255, 255, 0.02)"
    borderColor: "{colors.cyan}"
    borderWidth: 2px
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
    shadow: "{elevation.glow-cyan}"

  input:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.white}"
    borderColor: "{colors.glass-border}"
    borderWidth: 1px
    rounded: "{rounded.md}"
    height: 43px
    padding: "{spacing.sm} {spacing.lg}"
    typography: "{typography.input}"

  input-focus:
    borderColor: "{colors.cyan}"
    shadow: "0 0 12px 0 rgba(57, 203, 251, 0.2)"
    backgroundColor: "{colors.glass-strong}"

  input-error:
    borderColor: "{colors.primary}"
    shadow: "0 0 12px 0 rgba(232, 50, 131, 0.2)"

  input-disabled:
    backgroundColor: "rgba(255, 255, 255, 0.02)"
    textColor: "rgba(255, 255, 255, 0.3)"
    borderColor: "rgba(255, 255, 255, 0.05)"

  badge-success:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.md}"
    typography: "{typography.caption}"
    fontWeight: 600

  badge-warning:
    backgroundColor: "{colors.warning}"
    textColor: "{colors.neutral-900}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.md}"
    typography: "{typography.caption}"
    fontWeight: 600

  navigation:
    backgroundColor: "{colors.glass}"
    height: 101px
    padding: "{spacing.md} {spacing.xl}"
    shadow: "{elevation.high}"

  navigation-link:
    textColor: "{colors.white}"
    typography: "{typography.body}"
    padding: "{spacing.sm} {spacing.lg}"
    rounded: "{rounded.sm}"

  navigation-link-hover:
    backgroundColor: "rgba(255, 255, 255, 0.1)"
    textColor: "{colors.cyan}"

  navigation-link-active:
    textColor: "{colors.primary}"
    borderBottom: "2px solid {colors.primary}"

  cta-button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.lg}"
    typography: "{typography.body}"
    fontWeight: 600
    shadow: "{elevation.glow-purple}"

layout:
  max-width: 1440px
  container-padding-desktop: 32px
  container-padding-tablet: 20px
  container-padding-mobile: 16px
  gutter-desktop: 16px
  gutter-tablet: 12px
  gutter-mobile: 8px

breakpoints:
  mobile: "320px-639px"
  tablet: "640px-1023px"
  desktop: "1024px-1439px"
  large-desktop: "1440px+"

---

# Design System Inspired by jPrime Conference

## 1. Visual Theme & Atmosphere

The jPrime design system embodies a cutting-edge, cyberpunk aesthetic with a forward-thinking technological edge. The visual personality merges neon-bright accent colors with deep, sophisticated dark backgrounds, creating high-contrast compositions that feel energetic and immersive. Layered glass-morphism effects, glowing neon outlines, and geometric glass containers establish a futuristic, premium conference identity. The atmosphere is bold yet professional—designed to captivate tech industry audiences while maintaining clarity and sophistication. Grid-based layouts, luminescent accents, and sleek typography combine to evoke innovation, connectivity, and digital transformation.

**Key Characteristics**
- High-contrast neon accents against dark, modern backgrounds
- Glass-morphism components with subtle transparency and luminescent borders
- Geometric, angular design language with clean lines
- Vibrant cyan, magenta, and orange accent colors creating visual excitement
- Premium feel through layered shadows and glow effects
- Tech-forward aesthetic suitable for developer and innovation conferences
- Clean white typography for maximum readability and sophistication

## 2. Color Palette & Roles

### Primary
- **Magenta Accent** (`#E83283`): Primary brand accent for CTAs, highlights, and key interactive elements; creates visual hierarchy and energy
- **Magenta Strong** (`#E92763`): Darker magenta variant for hover states and deeper emphasis on primary actions
- **Magenta Status** (`#E91E63`): Alternative magenta tone for secondary highlights and status indicators

### Accent Colors
- **Cyan Neon** (`#39CBFB`): Futuristic cyan for secondary accents, glass borders, and neon-glow effects
- **Orange Accent** (`#FD7E14`): Warm tertiary accent for tertiary actions and complementary highlights
- **Teal Accent** (`#41D7A7`): Mint-green accent for success states and interactive feedback

### Interactive
- **Warning Yellow** (`#FFC107`): Warning and alert states, drawing attention to important notices

### Neutral Scale
- **Near Black** (`#212529`): Primary text on light backgrounds and deep UI elements
- **Dark Charcoal** (`#343A40`): Secondary text and subtle background variations
- **Medium Gray** (`#666666`): Tertiary text for disabled or muted states
- **Light Gray** (`#CACACA`): Borders, dividers, and subtle contrast elements
- **Lighter Gray** (`#E9E9E8`): Light surface backgrounds and subtle UI separation
- **Border Gray** (`#DEE2E6`): Refined borders and container outlines
- **Disabled Gray** (`#808080`): Disabled component states and inactive elements
- **Muted Gray** (`#ADB5BD`): Low-emphasis text and placeholders

### Surface & Borders
- **Pure White** (`#FFFFFF`): Primary surface color, backgrounds, and text on dark surfaces
- **Pure Black** (`#000000`): Deep shadow, strong text contrast, and premium dark elements
- **Glass Surface** (rgba values): Transparent overlays with `rgba(255, 255, 255, 0.05)` for frosted-glass effect; used on navigation and input fields for depth

## 3. Typography Rules

### Font Family
**Primary:** Poppins (400, 500, 700 weights) – modern, geometric sans-serif optimized for screens
Fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`

**Secondary:** Open Sans (400 weight) – clean, readable sans-serif for input and form fields
Fallback: `"Trebuchet MS", "Lucida Grande", sans-serif`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|-----------------|-------|
| Display | Poppins | 38px | 700 | 45.6px | 0px | Hero headline, section titles, maximum impact |
| Heading 1 | Poppins | 24px | 700 | 52px | 0px | Major section headers, strong prominence |
| Heading 2 | Poppins | 22px | 400 | 40px | 0px | Subsection headers, reduced weight for hierarchy |
| Heading 3 | Poppins | 16px | 700 | 19.2px | 0px | Card titles, component headers |
| Heading 4 | Poppins | 14px | 700 | 16.8px | 0px | Smaller headers, sidebar titles |
| Body | Poppins | 14px | 400 | 25px | 0px | Primary body text, readable and spacious |
| Button | Poppins | 20px | 400 | 20px | 0px | Call-to-action text, prominent and clear |
| Input | Open Sans | 14px | 400 | 26px | 0px | Form fields, search inputs, accessible sizing |
| Caption | Poppins | 12px | 400 | 18px | 0px | Small text, metadata, footnotes |

### Principles
- **Geometric clarity:** Poppins' rounded, modern letterforms create a contemporary, tech-forward feel
- **High contrast:** Bold weight 700 for headings ensures visual hierarchy and scannability
- **Spacing-driven:** Generous line heights (25–52px) create breathing room and premium feel
- **Accessibility first:** Minimum 14px body text ensures readability on all screen sizes
- **Consistency:** Strict adherence to the 14px/20px/22px/24px/38px scale maintains visual rhythm

## 4. Component Stylings

### Buttons

#### Primary Button
- **Background:** `#E83283` (magenta primary)
- **Text Color:** `#FFFFFF` (white)
- **Padding:** `12px 24px`
- **Border Radius:** `8px`
- **Border:** None
- **Font Size:** `16px`
- **Font Weight:** `600`
- **Line Height:** `20px`
- **Box Shadow:** `rgba(139, 92, 246, 0.4) 0px 4px 15px 0px` (purple glow)
- **Hover State:** Background `#E92763`, shadow intensifies with `rgba(139, 92, 246, 0.6) 0px 6px 20px 0px`
- **Active State:** Background `#D71A5C`, shadow `rgba(139, 92, 246, 0.3) 0px 2px 10px 0px`

#### Secondary Button
- **Background:** `rgba(0, 0, 0, 0)` (transparent)
- **Text Color:** `#FFFFFF`
- **Padding:** `10px 20px`
- **Border Radius:** `8px`
- **Border:** `1px solid #E83283` (magenta outline)
- **Font Size:** `16px`
- **Font Weight:** `400`
- **Line Height:** `20px`
- **Box Shadow:** None
- **Hover State:** Background `rgba(232, 50, 131, 0.1)`, border `#E92763`
- **Active State:** Background `rgba(232, 50, 131, 0.2)`, border `#D71A5C`

#### Ghost Button
- **Background:** `rgba(0, 0, 0, 0)` (transparent)
- **Text Color:** `rgba(0, 0, 0, 0.65)` (dark gray)
- **Padding:** `4px 12px`
- **Border Radius:** `8px`
- **Border:** `1px solid rgba(0, 0, 0, 0.15)` (subtle gray)
- **Font Size:** `16px`
- **Font Weight:** `400`
- **Line Height:** `20px`
- **Box Shadow:** None
- **Hover State:** Background `rgba(0, 0, 0, 0.05)`, text color `#000000`, border `rgba(0, 0, 0, 0.25)`
- **Active State:** Background `rgba(0, 0, 0, 0.1)`, text color `#212529`

#### Carousel Navigation Buttons (Dot Indicators)
- **Inactive:** Background `rgba(128, 128, 128, 0.5)`, border `2px solid rgba(255, 255, 255, 0.3)`, width `12px`, height `12px`, border-radius `50%`
- **Active:** Background `rgba(255, 255, 255, 0.9)`, border `2px solid rgba(255, 255, 255, 0.8)`, width `12px`, height `12px`, border-radius `50%`, box-shadow `rgba(255, 255, 255, 0.6) 0px 0px 15px 0px`

### Cards & Containers

#### Standard Card
- **Background:** `#FFFFFF`
- **Border:** `1px solid #DEE2E6`
- **Border Radius:** `12px`
- **Padding:** `20px`
- **Box Shadow:** `rgba(0, 0, 0, 0.1) 0px 2px 8px 0px`
- **Hover State:** Box shadow `rgba(0, 0, 0, 0.15) 0px 4px 16px 0px`

#### Glass Card (Hero/Feature)
- **Background:** `rgba(255, 255, 255, 0.05)` (frosted glass)
- **Border:** `1px solid rgba(255, 255, 255, 0.1)` (subtle white outline)
- **Border Radius:** `12px`
- **Padding:** `24px 20px`
- **Box Shadow:** `rgba(0, 0, 0, 0.3) 0px 8px 32px 0px`
- **Backdrop:** Blur effect assumed at `10px`

#### Neon Glass Container
- **Background:** `rgba(255, 255, 255, 0.02)` (minimal opacity)
- **Border:** `2px solid #39CBFB` (cyan neon outline)
- **Border Radius:** `8px`
- **Padding:** `16px`
- **Box Shadow:** `rgba(57, 203, 251, 0.3) 0px 0px 20px 0px` (cyan glow)

> **React Native Implementation Note:** `backdrop-filter: blur()` is a CSS-only property — it is not supported in React Native. The frosted-glass blur effect is web-only. In React Native components, approximate the glass effect using `StyleSheet.create` with `rgba` backgrounds and explicit `borderColor`/`borderWidth`. Do **not** rely on the `.glass`, `.glass-border`, or `.card-glass` CSS utility classes inside native components — use inline `StyleSheet` values instead. On web, the CSS utilities apply correctly.

### Inputs & Forms

#### Text Input
- **Background:** `rgba(255, 255, 255, 0.05)` (glass surface)
- **Text Color:** `#FFFFFF`
- **Font Size:** `14px`
- **Font Family:** Open Sans
- **Font Weight:** `400`
- **Line Height:** `26px`
- **Padding:** `0px 16px` (horizontal only, vertical padding `8px`)
- **Height:** `43px`
- **Border Radius:** `8px`
- **Border:** `1px solid rgba(255, 255, 255, 0.1)`
- **Placeholder Color:** `rgba(255, 255, 255, 0.5)`
- **Focus State:** Border `1px solid #39CBFB`, box-shadow `rgba(57, 203, 251, 0.2) 0px 0px 12px 0px`, background `rgba(255, 255, 255, 0.08)`
- **Disabled State:** Background `rgba(255, 255, 255, 0.02)`, text color `rgba(255, 255, 255, 0.3)`, border `1px solid rgba(255, 255, 255, 0.05)`

#### Input Error State
- **Border:** `1px solid #E83283` (magenta error)
- **Box Shadow:** `rgba(232, 50, 131, 0.2) 0px 0px 12px 0px`

### Navigation

#### Header Navigation
- **Background:** `rgba(255, 255, 255, 0.05)` (frosted glass)
- **Height:** `101px`
- **Padding:** `20px 32px` (vertical 20px, horizontal 32px)
- **Border:** None
- **Border Radius:** `0px` (full-width header)
- **Box Shadow:** `rgba(0, 0, 0, 0.3) 0px 4px 30px 0px`
- **Position:** `sticky` or `fixed` for persistent navigation

#### Navigation Link
- **Text Color:** `#FFFFFF`
- **Font Size:** `14px`
- **Font Weight:** `400`
- **Padding:** `8px 16px`
- **Border Radius:** `4px`
- **Background:** `transparent`
- **Hover State:** Background `rgba(255, 255, 255, 0.1)`, text color `#39CBFB` (cyan highlight)
- **Active State:** Text color `#E83283` (magenta), border-bottom `2px solid #E83283`

#### CTA Navigation Button (e.g., "HOME")
- **Background:** `#E83283` (magenta primary)
- **Text Color:** `#FFFFFF`
- **Padding:** `10px 20px`
- **Border Radius:** `8px`
- **Font Size:** `14px`
- **Font Weight:** `600`
- **Box Shadow:** `rgba(139, 92, 246, 0.4) 0px 4px 15px 0px`
- **Hover State:** Background `#E92763`, shadow intensified

### Badges

#### Status Badge
- **Background:** `#41D7A7` (teal for success)
- **Text Color:** `#FFFFFF`
- **Padding:** `4px 12px`
- **Border Radius:** `4px`
- **Font Size:** `12px`
- **Font Weight:** `600`
- **Display:** `inline-block`

#### Warning Badge
- **Background:** `#FFC107` (warning yellow)
- **Text Color:** `#212529` (dark text)
- **Padding:** `4px 12px`
- **Border Radius:** `4px`
- **Font Size:** `12px`
- **Font Weight:** `600`

## 5. Layout Principles

### Spacing System
**Base Unit:** `8px` — all spacing values are multiples of the base unit for consistency and scalability.

**Spacing Scale:**
- Extra Small: `4px` (minimal spacing between inline elements)
- Small: `8px` (tight component spacing)
- Small-Medium: `12px` (standard padding within components)
- Medium: `16px` (comfortable spacing between sections)
- Medium-Large: `20px` (padding within larger components)
- Large: `32px` (spacing between major sections)
- Extra Large: `60px` (hero sections and major layout gaps)
- XXL: `72px` (full-screen section spacing)
- Mega: `152px` (hero to content transitions)

**Usage Context:**
- `12px` — button padding, small component margins
- `16px` — default section margins, card padding
- `20px` — medium container padding, spacing between medium components
- `32px` — large section spacing, container margins
- `60px` — hero section padding, feature area spacing
- `72px` — full-width section padding (vertical)
- `152px` — hero-to-content transition, maximum visual separation

### Grid & Container
- **Max Width:** `1440px` (desktop) — navigation bar matches this width
- **Column Strategy:** 12-column flexible grid system, with adaptive gutters (`16px` at desktop, `12px` at tablet, `8px` at mobile)
- **Container Padding:** `32px` horizontal on desktop, `20px` on tablet, `16px` on mobile
- **Section Patterns:** Hero section (full bleed with centered content), content cards in 3-column layouts on desktop, single-column on mobile

### Whitespace Philosophy
The design embraces generous whitespace to create a premium, uncluttered aesthetic. Large gaps between sections (60–152px) establish visual hierarchy and guide user attention. Internal component padding (16–24px) ensures content breathes and remains readable. Whitespace is used strategically to separate information clusters and create focal points. The approach balances density with clarity, preventing cognitive overload while maximizing impact.

### Border Radius Scale
- **Sharp:** `0px` (full-width headers, banners)
- **Subtle:** `4px` (badges, small UI elements)
- **Standard:** `8px` (buttons, inputs, small cards)
- **Rounded:** `12px` (cards, containers, larger UI elements)
- **Circular:** `50%` (avatar buttons, carousel indicators, icon-only buttons)

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow, `box-shadow: none` | Text, flat backgrounds, borders only |
| Surface (Level 1) | `rgba(0, 0, 0, 0.1) 0px 2px 8px 0px` | Cards, subtle containers, gentle depth |
| Raised (Level 2) | `rgba(0, 0, 0, 0.15) 0px 4px 16px 0px` | Hovered cards, floating components |
| Floating (Level 3) | `rgba(0, 0, 0, 0.2) 0px 8px 24px 0px` | Dropdowns, modals, overlays |
| High (Level 4) | `rgba(0, 0, 0, 0.3) 0px 4px 30px 0px` | Navigation bars, primary elevation, strong prominence |
| Glow (Accent) | `rgba(139, 92, 246, 0.4) 0px 4px 15px 0px` (purple); `rgba(57, 203, 251, 0.3) 0px 0px 20px 0px` (cyan); `rgba(255, 255, 255, 0.6) 0px 0px 15px 0px` (white) | Interactive buttons, neon accents, special focus states |

**Shadow Philosophy:**
Shadows establish spatial depth and guide user focus through layered elevation. Primary shadows use black with low opacity (`0.1–0.3`) for natural, realistic depth. Accent shadows employ brand colors (purple, cyan, white) to create neon-glow effects on interactive elements and premium components. Glow shadows are reserved for high-engagement CTAs, active states, and glass-morphism elements. This two-tier approach (naturalistic + accent) reinforces the tech-forward aesthetic while maintaining visual hierarchy.

## 7. Do's and Don'ts

### Do
- **Use magenta (`#E83283`) for all primary CTAs** — ensures consistent brand recognition and conversion focus
- **Pair cyan (`#39CBFB`) with magenta** — creates energetic, high-contrast compositions that feel tech-forward
- **Apply frosted-glass background (`rgba(255, 255, 255, 0.05)`)** to components on dark backgrounds — reinforces premium, modern aesthetic
- **Leverage generous whitespace (60–152px between sections)** — establishes premium feel and guides focus
- **Use Poppins for all UI text** — maintains geometric, contemporary personality; ensure 14px minimum for body text
- **Apply glow shadows to interactive elements** — differentiates clickable items and reinforces tech aesthetic
- **Maintain 1440px max-width on desktop** — consistent with navigation bar and layout integrity
- **Use rounded corners (`8px–12px`) for most components** — softens modern aesthetic, improves usability
- **Create visual hierarchy through weight (700 for headings, 400 for body)** — enables quick scanning and readability

### Don't
- **Avoid using gray text on light backgrounds** — violates accessibility contrast ratios; use `#212529` (near black) instead
- **Don't mix font families beyond Poppins and Open Sans** — risks visual inconsistency and dilutes brand identity
- **Avoid shadow overdose** — use only `Level 3–4` shadows for high-emphasis elements; keep most components flat or `Level 1`
- **Don't shrink typography below 14px** — compromises readability and accessibility
- **Avoid placing colored text on magenta backgrounds** — creates harsh contrast; use white text only
- **Don't use pure black (`#000000`) for regular text** — use `#212529` (near black) for softer, more refined appearance
- **Avoid excessive opacity changes in hover states** — create distinct visual feedback through color or shadow shifts instead
- **Don't ignore touch targets on mobile** — maintain minimum `44px × 44px` touch-friendly sizes for all interactive elements
- **Avoid glass-morphism on light backgrounds** — frosted-glass effect only reads on dark surfaces; use white or light neutrals instead
- **Don't neglect keyboard navigation and focus states** — ensure all interactive elements have visible `:focus` outlines (min `2px` border or shadow)

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | 320px–639px | Single-column layout, `16px` container padding, `8px` gutters, `14px` body text, stacked navigation (hamburger), `38px` hero display |
| Tablet | 640px–1023px | Two-column layout option, `20px` container padding, `12px` gutters, `16px` body text on headers, `32px` hero display, sidebar navigation collapses |
| Desktop | 1024px–1439px | 12-column grid, `32px` container padding, `16px` gutters, full navigation visible, `38px` hero display, max spacing values |
| Large Desktop | 1440px+ | Max-width container (`1440px` centered), full spacing and typography scales, dual-column feature layouts |

### Touch Targets
- **Minimum Size:** `44px × 44px` (iOS/Android standard)
- **Buttons:** `48px × 44px` minimum on mobile; `40px × 40px` acceptable on desktop with sufficient spacing
- **Links:** `32px × 32px` minimum target area with padding
- **Carousel Dots:** `12px × 12px` (indicator), with `16px` spacing between dots for easy tapping
- **Form Inputs:** `43px` height (extracted value) ensures comfortable mobile interaction
- **Navigation Items:** `44px` minimum click area, `12px` padding around text

### Collapsing Strategy
- **Desktop (1440px):** Full horizontal navigation in header; 3-column card layouts; hero section with full imagery
- **Tablet (640px–1023px):** Navigation collapses to hamburger menu; card layouts switch to 2-column; hero image scales with reduced height; padding reduces to `20px`
- **Mobile (320px–639px):** Single-column everything; full-width cards; hamburger navigation with overlay; hero section height reduced (`60vh` max); font sizes reduce slightly (`16px` body); touch targets prioritized at `44px`
- **Fluid Scaling:** Typography scales smoothly via viewport-width (vw) units between breakpoints; spacing follows 8px multiples to maintain rhythm
- **Image Scaling:** Hero backgrounds use `background-size: cover` with reduced dimensions on mobile (`320px` height) → tablet (`480px`) → desktop (`720px`); all images optimized via srcset

## 9. Agent Prompt Guide

### Quick Color Reference
- **Primary CTA:** Magenta (`#E83283`) — use for main call-to-action buttons, highlighted links, primary brand expressions
- **Secondary Accent:** Cyan Neon (`#39CBFB`) — use for secondary actions, focus states, neon borders, tech-forward highlights
- **Tertiary Accent:** Orange (`#FD7E14`) — use for complementary highlights, secondary CTAs, warmth contrast
- **Success State:** Teal (`#41D7A7`) — use for positive feedback, confirmation, success badges
- **Warning/Alert:** Yellow (`#FFC107`) — use for warning states, cautions, attention-grabbing notices
- **Text (Dark):** Near Black (`#212529`) — use for primary text on light backgrounds, strong contrast
- **Text (Light):** White (`#FFFFFF`) — use for primary text on dark backgrounds, high contrast
- **Background (Light):** White (`#FFFFFF`) — default light surface color
- **Background (Dark):** Charcoal (`#212529` or `#343A40`) — use for dark mode or dark sections
- **Glass Surface:** `rgba(255, 255, 255, 0.05)` — use for frosted-glass inputs, navigation, containers on dark backgrounds
- **Borders:** `#DEE2E6` (light gray) on light backgrounds; `rgba(255, 255, 255, 0.1)` on dark backgrounds
- **Disabled State:** Gray (`#808080` or `#ADB5BD`) — use for inactive, disabled, or muted UI

### Iteration Guide
1. **Start with Poppins font at 14px body, 16px buttons, 38px display** — maintain typographic consistency; never go below 14px for accessibility
2. **Apply magenta (`#E83283`) to primary CTAs and cyan (`#39CBFB`) to secondary interactions** — these two colors form the visual anchor; use them deliberately
3. **Use frosted-glass backgrounds (`rgba(255, 255, 255, 0.05)`) on all components over dark backgrounds** — creates depth without opacity issues
4. **Add glow shadows (`rgba(139, 92, 246, 0.4) 0px 4px 15px 0px`) to premium buttons and interactive elements** — establishes tech-forward aesthetic and draws focus
5. **Space major sections with 60–152px vertical margins** — generous whitespace is the system's premium hallmark
6. **Always include hover states** — change background color, shadow intensity, or apply cyan highlight for visual feedback
7. **Ensure 44px minimum touch targets on mobile** — test all interactive elements for comfortable mobile interaction
8. **Use rounded corners (`8px` for buttons/inputs, `12px` for cards)** — softens geometric typography and improves modern appeal
9. **Apply high contrast for accessibility** — ensure WCAG AA compliance on all text (4.5:1 minimum); test color pairs
10. **Keep navigation sticky with `rgba(0, 0, 0, 0.3) 0px 4px 30px 0px` shadow** — maintains prominence and persistent access across scrolling
11. **Test responsive breakpoints at 320px, 640px, 1024px, 1440px** — ensure layouts collapse gracefully and maintain visual rhythm
12. **Reserve animation for interactive feedback only** — avoid excessive motion; focus on state changes and micro-interactions (button press, hover, focus)
