# JPrime Conference App

> **Mobile conference application** built with Expo, React Query, and Expo Router.

[![CI](https://github.com/reicheltp/jprime-app/actions/workflows/ci.yml/badge.svg)](https://github.com/reicheltp/jprime-app/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## Overview

JPrime Conference is a **web-first mobile application** that provides attendees with a comprehensive conference experience, including:

- **Schedule browsing** with filtering by track, date, and speaker
- **Session management** - save sessions to personal schedule
- **Speaker profiles** with bios and session listings
- **Venue information** - maps, directions, amenities
- **Social features** - attendee networking, messaging
- **Real-time updates** - schedule changes, announcements

The app supports **web, Android, and iOS** platforms with a single codebase using Expo.

---

## Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | [Expo SDK 50+](https://docs.expo.dev/) | Cross-platform mobile development |
| **Navigation** | [Expo Router v3](https://docs.expo.dev/router) | File-based routing |
| **State Management** | [@tanstack/react-query v5](https://tanstack.com/query/latest) | Server state caching |
| **Language** | [TypeScript 5.3+](https://www.typescriptlang.org/) | Type safety |
| **Package Manager** | [Bun 1.1+](https://bun.sh/) | Fast runtime & workspaces |
| **Testing** | [Bun Test](https://bun.sh/docs/runtime/test) | Integrated testing |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + [NativeWind v5](https://www.nativewind.dev/) | Utility-first CSS |
| **CI/CD** | [GitHub Actions](https://github.com/features/actions) | Automation |

---

## Project Structure

This is a **monorepo** organized by domain using Bun workspaces:

```
jprime-app/
├── apps/
│   └── conference/              # Main Expo application
│       ├── app/                # Expo Router app directory
│       │   ├── _layout.tsx     # Root layout with providers
│       │   ├── index.tsx      # Home screen
│       │   ├── (auth)/        # Authentication domain
│       │   ├── (schedule)/    # Schedule domain
│       │   ├── (speakers)/    # Speakers domain
│       │   └── (venue)/       # Venue domain
│       ├── assets/            # Static assets (images, fonts, icons)
│       ├── components/        # App-specific components
│       ├── hooks/             # App-specific hooks
│       ├── lib/               # App-specific utilities
│       ├── providers/         # App providers (QueryClient, etc.)
│       └── styles/            # Global styles
│
├── packages/
│   ├── @jprime/ui/            # Shared UI components
│   │   ├── src/components/   # Buttons, inputs, cards, modals
│   │   ├── src/hooks/       # Reusable React hooks
│   │   └── src/index.ts     # Package exports
│   │
│   ├── @jprime/api/          # API clients & React Query
│   │   ├── src/clients/     # HTTP clients (Axios/fetch)
│   │   ├── src/queries/     # React Query hooks
│   │   └── src/types/       # API type definitions
│   │
│   ├── @jprime/types/       # Shared TypeScript types
│   │   └── src/index.ts     # Domain models, utility types
│   │
│   └── @jprime/utils/       # Shared utilities
│       ├── src/constants/   # App constants
│       ├── src/helpers/     # Helper functions
│       └── src/index.ts     # Package exports
│
├── docs/
│   ├── architecture.md       # Architecture decisions & overview
│   ├── features.md           # Feature status matrix
│   ├── specs/                # Spec-driven development (flat)
│   │   ├── SPEC-NNN-slug.md          # Phase 1: Requirements (EARS format)
│   │   ├── SPEC-NNN-slug.design.md   # Phase 2: Design document
│   │   └── SPEC-NNN-slug.tasks.md    # Phase 3: Implementation checklist
│   └── decisions/           # ADRs (Architecture Decision Records)
│
├── tooling/
│   └── scripts/             # Build/deployment scripts
│
├── .github/workflows/        # GitHub Actions workflows
├── AGENTS.md                 # Instructions for AI agents/LLMs
├── package.json              # Root package.json (Bun workspaces)
├── bunfig.toml              # Bun configuration
├── tsconfig.base.json        # Shared TypeScript config
└── README.md                 # This file
```

---

## Getting Started

### Prerequisites

- [Bun 1.1+](https://bun.sh/docs/installation) - Package manager & runtime
- [Node.js 20+](https://nodejs.org/) - For Expo CLI compatibility
- [Git](https://git-scm.com/) - Version control
- [Watchman](https://facebook.github.io/watchman/) (macOS) - File watching
- [Xcode](https://developer.apple.com/xcode/) (iOS development)
- [Android Studio](https://developer.android.com/studio) (Android development)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/reicheltp/jprime-app.git
   cd jprime-app
   ```

2. **Install dependencies:**
   ```bash
   # Install all workspace dependencies
   bun install
   ```

3. **Set up environment variables:**
   ```bash
   # Copy example env file
   cp apps/conference/.env.example apps/conference/.env
   
   # Edit with your configuration
   nano apps/conference/.env
   ```

4. **Start the development server:**
   ```bash
   # Start Expo dev server (web-first)
   bun run expo:dev
   ```

5. **Seed the database:**
   ```bash
   bun run seed
   ```
   This creates 20 demo attendees and prints their names and connect codes — useful for testing the attendee connections and connect code features:
   ```
   Name               Connect Code
   ─────────────────  ────────────
   Georgi Ivanov      X7K2P
   Maria Petrova      4NR9T
   ...
   ```

6. **Open in browser:**
   - Press `w` in terminal to open web version
   - Or navigate to `http://localhost:8081`

---

## Demo Guide

A quick walkthrough for demoing all features locally.

### 1. Start everything

```bash
bun run dev
```

This starts the API server and the Expo dev server in parallel. Open [http://localhost:8081](http://localhost:8081) in your browser (or scan the QR code with Expo Go).

### 2. Seed demo attendees

In a separate terminal:

```bash
bun run seed
```

The output lists every demo attendee with their connect code — keep this handy:

```
  Name               Connect Code
  ─────────────────  ────────────
  Georgi Ivanov      X7K2P
  Maria Petrova      4NR9T
  ...
```

### 3. Sign in

Enter any email address on the login screen. Because no SMTP is configured in development, the one-time code is printed directly to the **API server terminal**:

```
[email] OTP for you@example.com: 847291
```

Enter that code in the app to sign in.

### 4. Explore the app

| What to try | Where |
|-------------|-------|
| Browse sessions by day or track | **Schedule** tab |
| Bookmark a session | Tap the bookmark icon on any session card |
| View your bookmarks | **Schedule** → **Bookmarked** filter |
| Read a speaker bio | **Speakers** tab |
| Check venue & maps | **Venue** tab |

### 5. Connect with demo attendees

1. Go to the **Connect** tab
2. Tap **Scan QR** or switch to **Enter Code**
3. Type one of the connect codes from the seed output (e.g. `X7K2P`)
4. Tap **Connect** — the attendee appears in your connections list

---

## Development

### Scripts

#### Root Level

```bash
# Install all dependencies
bun install

# Run across all workspaces
bun run dev      # Start all dev servers
bun run build    # Build all packages
bun run test     # Run all tests
bun run lint     # Lint all packages
bun run typecheck # Type-check all packages

# Expo specific
bun run expo:dev      # Start Expo dev server
bun run expo:web      # Start web dev server
bun run expo:android  # Build Android app
bun run expo:ios      # Build iOS app
```

#### Workspace Level

```bash
# From apps/conference/
cd apps/conference

bun run dev      # Start Expo
bun run build    # Build for production
bun run test     # Run tests
bun run lint     # Lint
bun run start    # Start Expo (alias for dev)
```

### Adding Dependencies

**Root level (dev tools):**
```bash
# Add dev dependency to root
bun add -d -w eslint prettier typescript
```

**Workspace level:**
```bash
# Navigate to workspace
cd apps/conference

# Add dependency
bun add @tanstack/react-query react-native-gesture-handler

# Or from root
bun add --cwd apps/conference @tanstack/react-query
```

### Running on Device

1. **Install Expo Go on your device:**
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Start Expo dev server:**
   ```bash
   bun run expo:dev
   ```

3. **Scan QR code:**
   - Open Expo Go on your device
   - Scan the QR code from terminal

4. **Alternative: Run natively:**
   ```bash
   # Android
   bun run expo:android
   
   # iOS
   bun run expo:ios
   ```

---

## Spec-Driven Development

This project follows a **three-phase spec-driven development** workflow to ensure quality and maintainability:

### 1. Requirements Phase

- **Location:** `docs/specs/SPEC-NNN-slug.md`
- **Format:** EARS (Easy Approach to Requirements Syntax)
- **Process:** Define user stories and acceptance criteria before implementation

**Example:**
```markdown
## Feature: Session Management

**User Story:** As a conference attendee, I want to browse and save sessions to my schedule so I can plan my day.

**Acceptance Criteria:**
1. WHEN user views the schedule THEN system SHALL display all conference sessions
2. WHEN user taps a session THEN system SHALL navigate to session detail view
3. WHEN user taps "Add to Schedule" THEN system SHALL save session to user's schedule
```

### 2. Design Phase

- **Location:** `docs/specs/SPEC-NNN-slug.design.md`
- **Process:** Create technical design documents with architecture decisions

**Sections:**
- Architecture overview
- Component interactions
- Data models
- Error handling strategy
- Testing approach

### 3. Tasks Phase

- **Location:** `docs/specs/SPEC-NNN-slug.tasks.md`
- **Process:** Break design into actionable implementation tasks

**Format:**
```markdown
- [ ] 1. Create Session type in @jprime/types
- [ ] 2. Create API client for sessions
- [ ] 3. Create React Query hooks
- [ ] 4. Create SessionList component
- [ ] 5. Create SessionDetail screen
```

### Workflow

```
Requirements → Design → Tasks → Implementation → Verification
         ↑__________________________________________│
```

---

## Architecture

### Domain-Driven Organization

Code is organized **by domain/feature** rather than technical layer. Each domain contains:
- Components specific to that domain
- Hooks for domain-specific logic
- Types for domain models
- Utilities for domain-specific helpers

**Current Domains:**
- `(auth)` - Authentication & user management
- `(schedule)` - Conference schedule & session management
- `(speakers)` - Speaker profiles & session listings
- `(venue)` - Venue information & maps
- `(social)` - Attendee networking & messaging

### Platform Agnostic Core

- **Business logic** in `packages/` works across web, iOS, Android
- **Platform-specific code** in `apps/conference/` with clear boundaries
- **Feature flags** for platform-specific behavior

### State Management

- **Server state:** React Query (caching, background updates)
- **Client state:** React state (useState, useReducer)
- **Local persistence:** AsyncStorage for offline support

### Navigation

- **Expo Router** for file-based routing
- **Stack/Tab/Modal** navigators for different patterns
- **Deep linking** support for direct access

---

## Testing

### Test Types

| Type | Location | Runner | Purpose |
|------|----------|--------|---------|
| Unit | `*.test.ts` | Bun Test | Component/utility tests |
| Integration | `*.test.ts` | Bun Test | Multi-component tests |
| E2E | `e2e/*.test.ts` | Bun Test | User flow tests |

### Running Tests

```bash
# All tests
bun run test

# Specific workspace
bun run --cwd packages/ui test

# With coverage
bun run test --coverage
```

### Testing Setup

Tests use:
- [`bun:test`](https://bun.sh/docs/runtime/test) - Test runner
- [`@testing-library/react-native`](https://testing-library.com/docs/react-native-testing-library/intro/) - Component testing
- [`vi`](https://vitest.dev/) (via Bun) - Mocking utilities

---

## Deployment

### Web

```bash
# Build for production
bun run --cwd apps/conference expo export --public-url https://jprime-conference.com

# Deploy to Vercel/Netlify/etc.
# Build output in apps/conference/dist/
```

### Android

```bash
# Build APK
bun run expo:android

# Build App Bundle
bun run --cwd apps/conference eas build --platform android --profile production

# Submit to Play Store
bun run --cwd apps/conference eas submit --platform android --profile production
```

### iOS

```bash
# Build IPA
bun run expo:ios

# Build for App Store
bun run --cwd apps/conference eas build --platform ios --profile production

# Submit to App Store
bun run --cwd apps/conference eas submit --platform ios --profile production
```

---

## Configuration

### Environment Variables

Create `.env` file in `apps/conference/`:

```bash
# API Configuration
API_BASE_URL=https://api.jprime-conference.com

# Expo Configuration
EXPO_PUBLIC_API_URL=https://api.jprime-conference.com

# Feature Flags
EXPO_PUBLIC_ENABLE_ANALYTICS=true
EXPO_PUBLIC_ENABLE_SOCIAL_FEATURES=false
```

### Expo Configuration

See `apps/conference/app.json` or `apps/conference/expo.config.ts` for:
- App metadata (name, version, icon)
- Platform-specific settings
- Plugins
- EAS configuration

### EAS Configuration

See `apps/conference/eas.json` for:
- Build profiles (development, preview, production)
- Submit configurations
- Credentials

---

## Style Guide

### Code Style

- **TypeScript:** Strict mode enabled
- **React:** Functional components with hooks
- **Naming:** camelCase for variables/functions, PascalCase for components/types
- **Imports:** Grouped by source (external, internal, local)
- **Formatting:** Prettier (2-space indentation, single quotes)

### Component Structure

```tsx
// Good: Consistent structure
interface Props {
  title: string;
  onPress: () => void;
}

function Button({ title, onPress }: Props) {
  return <Pressable onPress={onPress}><Text>{title}</Text></Pressable>;
}

export default Button;
```

### File Organization

```
components/
├── Button/
│   ├── Button.tsx
│   ├── Button.test.ts
│   ├── Button.stories.tsx
│   └── index.ts
├── Card/
│   ├── Card.tsx
│   ├── Card.test.ts
│   └── index.ts
└── index.ts
```

---

## Troubleshooting

### Common Issues

**"Unable to resolve module" errors:**
```bash
# Clear cache and reinstall
bun run clean
bun install
```

**Expo dev server not starting:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
bun install
```

**Android build failures:**
```bash
# Clean gradle cache
cd apps/conference/android
./gradlew clean
```

**iOS build failures:**
```bash
# Clean Xcode derived data
rm -rf ~/Library/Developer/Xcode/DerivedData/
# Clean pod installations
cd apps/conference/ios
pod deintegrate
pod install
```

### Getting Help

1. **Check the [Expo Docs](https://docs.expo.dev/)**
2. **Search existing issues** in this repository
3. **Create a new issue** with reproduction steps
4. **Ask in the team Slack/Discord**

---

## Contributing

### Setting Up for Development

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the spec-driven development workflow
4. Write tests for your changes
5. Ensure all tests pass (`bun run test`)
6. Ensure type checking passes (`bun run typecheck`)
7. Commit your changes with a clear message
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

### Pull Request Guidelines

- **Title:** Clear and descriptive
- **Description:** Explain what and why (not just how)
- **Linked Issues:** Reference related issues
- **Tests:** Include new tests or update existing ones
- **Documentation:** Update docs if needed
- **Breaking Changes:** Call out breaking changes

### Commit Message Format

```
type(scope): subject

body

footer
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Example:**
```
feat(schedule): add session filtering by track

- Add filter bar to schedule screen
- Support filtering by track, date, speaker
- Update API to support filtering parameters

Closes #123
```

---

## Code of Conduct

This project adheres to the [Contributor Covenant](https://www.contributor-covenant.org/). By participating, you agree to abide by its terms.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Expo Team](https://github.com/expo/expo) - Awesome framework
- [TanStack Team](https://github.com/TanStack) - React Query & Router
- [Bun Team](https://github.com/oven-sh/bun) - Fast runtime
- [reicheltp/jprime-app contributors](https://github.com/reicheltp/jprime-app/graphs/contributors) - This project

---

**Made with Expo, React Query, and Bun**  
**Maintained by:** [reicheltp](https://github.com/reicheltp)  
**Repository:** [reicheltp/jprime-app](https://github.com/reicheltp/jprime-app)  
**Last Updated:** 2026-06-03
