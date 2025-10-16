---
id: KIT939
type: implementation
---

# Svelte Implementation of Meditative Randomness

This is the Svelte implementation of Meditative Randomness for the web.

## Development Setup

### Prerequisites

- Node.js (latest LTS)
- pnpm package manager

### Installation

```bash
pnpm install
```

### Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm test` - Run tests
- `pnpm format` - Format all code
- `pnpm lint` - Lint code

### Project Structure

```
src/
├── routes/                           # SvelteKit routes
│   ├── +layout.svelte               # Global layout with theming system
│   └── +page.svelte                 # Main page with meditative design
├── lib/                             # Shared components and utilities
│   ├── styles/
│   │   └── globals.css              # Complete theming system with CSS custom properties
│   ├── components/
│   │   ├── animations/              # Meditative animation components
│   │   │   ├── ShiftingGradient.svelte      # Continuously moving background gradient
│   │   │   ├── DriftingParticles.svelte     # Organic particle system
│   │   │   └── BreathingContainer.svelte    # Subtle breathing animation wrapper
│   │   ├── timer/                   # Meditation timer components
│   │   │   ├── MeditationTimer.svelte       # Random meditation timer with MM:SS inputs
│   │   │   └── MeditationHistory.svelte     # Meditation session history display
│   │   └── ui/
│   │       └── MeditativeCard.svelte        # Glass-morphism card component
│   ├── utils/
│   │   ├── randomness.ts            # Controlled randomness utilities
│   │   ├── timer.ts                 # Time parsing, formatting, and validation utilities
│   │   ├── wake-lock.ts             # Sleep prevention utilities
│   │   └── history.ts               # Meditation session history storage via localStorage
│   ├── types/
│   │   └── browser.ts               # Type re-export helpers for DOM globals
│   └── assets/                      # Static assets
├── app.html                         # HTML template with font imports
└── app.d.ts                         # TypeScript declarations

tests/                               # Playwright tests
├── test-utils.ts                    # Shared test utilities (Audio mocking, etc.)
├── timer.spec.ts                    # Meditation timer tests
├── import-export.spec.ts            # Import/export functionality tests
└── home.spec.ts                     # Basic page load tests
```

### Git Hooks

The project uses lefthook for git hooks that automatically maintain code quality.

**Pre-commit hooks automatically run:**

- `pnpm format` - Prettier formatting with automatic staging
- `pnpm lint --fix` - ESLint with automatic fixes and staging
- `pnpm build` - Production build verification

**Pre-push hooks run:**

- `pnpm test` - All Playwright tests

**Important**: The hooks are configured with `stage_fixed: true` to automatically stage formatting and linting changes, ensuring commits include all automated fixes. This prevents the issue where formatting changes are made but not committed.

To install hooks: `pnpm lefthook install`

### Testing

Uses Playwright for end-to-end testing with Chromium, Firefox, and WebKit browsers.

## Theming Architecture

### Design System

The implementation features a comprehensive meditative theming system built with CSS custom properties and Svelte 5 components.

**Color Palette**:

- Warm earth tones for backgrounds (#F5F1EB to #D8B898)
- Blue accents for interactive elements (#B8D8E8, #7FB3D3)
- Muted green for secondary text (#8CAF5F)

**Typography**:

- Inter font family with light weights (300, 400, 500)
- Responsive scale from 0.75rem to 2.25rem
- Relaxed line heights for readability

### Animation Components

**ShiftingGradient**: Creates a continuously moving warm background gradient with a 35-second cycle

- Hardware accelerated with `transform3d`
- Respects `prefers-reduced-motion`

**DriftingParticles**: Organic particle system with configurable count and natural movement

- GPU-optimized drift animations
- Randomized timing and positioning

**BreathingContainer**: Subtle scaling animation that wraps content

- Fixed duration to prevent stuttering
- Uses `will-change` optimization

**MeditativeCard**: Glass-morphism cards with organic hover responses

- Backdrop blur effects
- Subtle organic positioning on interaction

### Randomness System

The `randomness.ts` utility provides controlled organic variations:

- `gentleVariation()` - Subtle numeric variations
- `breathingDuration()` - Natural timing variations
- `organicPosition()` - Subtle movement positioning
- `staggeredDelay()` - Entrance animation timing

### Timer System

**MeditationTimer**: A complete random meditation timer component that implements the Random Meditation Timer specification (FQP740).

**Features**:

- MM:SS time input fields with automatic formatting and validation
- Real-time average calculation that updates with every keystroke
- Random duration generation from uniform distribution between min/max times
- Elapsed time display during meditation (target duration remains hidden)
- Meditation chime sounds: start chime plays when timer begins, end chime plays when timer completes
- Sleep prevention during active meditation sessions
- Single-card interface with smooth state transitions

**Timer Utilities**: The `timer.ts` module provides comprehensive time handling:

- `parseTimeString()` - Parse MM:SS format with validation
- `formatTimeInput()` - Real-time input formatting with colon insertion
- `generateRandomDuration()` - Uniform random time generation
- `calculateAverage()` - Live average calculation
- `validateTimeRange()` - Input validation and error handling

**Sleep Prevention**: The `wake-lock.ts` module provides device sleep prevention:

- `requestWakeLock()` - Request screen wake lock with error handling
- `releaseWakeLock()` - Release active wake lock with cleanup
- `isWakeLockSupported()` - Progressive enhancement with feature detection

**Sound Playback**: The timer uses the browser's `Audio` API for playing meditation chimes:

- Sound files located in `static/sounds/` directory (served from `/sounds/` path)
- `playSound(soundPath: string)` helper function creates `new Audio(path)` and calls `play()`
- Error handling with `try/catch` and console warnings for playback failures
- No cleanup needed - Audio instances are garbage collected after playback

**Testing**: Complete Playwright test suite covering all timer functionality including input validation, state transitions, sleep prevention, and completion flow.

### Meditation History System

**MeditationHistory**: A comprehensive history tracking system that records completed meditation sessions and displays them on the completion screen.

**Features**:

- LocalStorage-based session storage guarded against malformed data
- Display of session end times with timezone information
- Session duration tracking and formatting
- Delete functionality with two-stage confirmation (trash icon → confirm/cancel)
- Layout-stable interface that prevents resizing during interactions
- Empty state handling for new users
- Responsive design with proper icon usage from lucide-svelte

**History Utilities**: The `history.ts` module provides complete history management:

- `MeditationRecord` interface for type-safe session data
- `saveMeditationRecord()` - Store completed sessions with UUID generation
- `getMeditationHistory()` - Retrieve session history from `localStorage`
- `deleteMeditationRecord()` - Remove specific sessions by ID
- `formatEndTime()` - Display-friendly time formatting with timezone
- `formatDuration()` - Human-readable duration formatting (e.g., "5m 30s")
- `getDateString()` - Extract YYYY-MM-DD from ISO timestamp
- `formatDate()` - Format date for display using browser locale
- `groupRecordsByDate()` - Group records by date with totals, sorted newest first
- `DateGroup` interface with `date`, `totalDuration`, and `records` fields
- Returns the stored array as-is after a shallow shape check, logging only when the payload is not an array

### Import/Export System

**Import/Export Functionality**: The `history.ts` module provides complete import/export capabilities for meditation session data.

**Export Utilities**: The module provides functions for generating exports and filenames:

- `exportMeditationHistory()` - Creates export data structure with version info
- `generateExportFilename()` - Generates filename with current date: `meditation-history-YYYY-MM-DD.json`
- `importMeditationHistory()` - Validates and merges imported records with existing data
- `isValidMeditationRecord()` - Type guard for record validation

**UI Integration**: Export and Import buttons are available in the MeditationHistory component, visible in both idle and completed timer states. Uses lucide-svelte icons (Download, Upload) and displays status messages with 5-second auto-dismiss.

**Browser API Usage**: File operations use `globalThis.Blob`, `globalThis.URL`, and `globalThis.document` prefixes to satisfy ESLint globals requirements without disabling rules.

**Testing**: Playwright tests use Node.js `fs` module combined with browser file chooser/download events to verify import/export functionality end-to-end.

### Development Lessons Learned

**Critical guidance from implementation experience that must be followed:**

**Code Quality Standards:**

- NEVER use `any` types - always create proper TypeScript interfaces and types
- NEVER disable ESLint rules with `eslint-disable-next-line` - fix the underlying issue instead
- Use proper ESLint globals configuration for browser APIs rather than disabling rules
- Don't duplicate code - create helper functions and shared interfaces
- Add proper type declarations to global files (app.d.ts) for browser APIs

**Testing Best Practices:**

- Use `page.emulateMedia({ reducedMotion: 'reduce' })` to disable animations in tests
- NEVER use `reducedMotion: 'reduce'` in Playwright config - it's not a valid option
- Remove all `force: true` from clicks - fix the underlying stability issues instead
- Use `page.addInitScript()` before page navigation for mocking browser APIs
- Mock `Audio` constructor using the shared `mockAudio()` helper from `tests/test-utils.ts` to prevent sound playback - apply this to any test that triggers timer start or completion
- Create shared test utilities in `tests/test-utils.ts` to avoid duplicating mock code across test files
- Don't use `force: true` to bypass Playwright's stability checks - they exist for good reason
- Prefer global test timeouts to timeouts on specific assertions
- Don't use `page.waitForTimeout()` - use proper assertions that wait for conditions

**Git and Commit Practices:**

- Don't commit failing code or tests - fix everything first
- Don't include .claude/ files in implementation commits
- Only commit when explicitly asked - don't be overly proactive with commits
- Run lint and typecheck before committing to ensure code quality

**Problem Solving Approach:**

- When tests fail with "element not stable", investigate the root cause (animations, validation errors)
- When buttons are unclickable, check if they're disabled due to validation rather than using force clicks
- Test one thing at a time when debugging - don't run all tests and get overwhelmed
- Read error messages carefully and address the actual issue, not symptoms

**Svelte 5 Reactivity:**

- Use `$derived` for computed state instead of `$effect` that writes to state - prevents infinite loops
- Use object/array types (`Record<string, boolean>`) instead of `Set` for reactive collections
- Replace objects/arrays immutably (spread syntax) to trigger reactivity
- Don't manually sync derived state - let `$derived` handle it automatically

**Svelte Transitions and Accessibility:**

- Svelte's built-in transitions (like `slide`) do NOT automatically respect `prefers-reduced-motion`
- Manually check the media query and set duration to 0 when reduced motion is preferred: `const prefersReducedMotion = typeof globalThis.window !== 'undefined' && globalThis.window.matchMedia('(prefers-reduced-motion: reduce)').matches`
- Pass the computed duration to transitions: `transition:slide={{ duration: prefersReducedMotion ? 0 : 300 }}`
- This prevents flaky tests that set `reducedMotion: 'reduce'` via `page.emulateMedia()`

**Playwright Specific:**

- The `reducedMotion` option doesn't exist in Playwright config
- Use proper browser API mocking with type safety
- Test in headed mode (`--headed`) for visual debugging when needed
- Disable HTML report generation in CI/automated contexts to avoid hanging processes

### Performance Considerations

- All animations use CSS transforms for 60fps performance
- Hardware acceleration with `transform3d` and `will-change`
- Minimal JavaScript for animation logic
- Timer uses efficient `setInterval` with proper cleanup
- Comprehensive accessibility support with motion preferences
- Bundle-optimized with strategic CSS custom properties
