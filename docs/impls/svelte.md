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
│   │   │   └── MeditationTimer.svelte       # Random meditation timer with MM:SS inputs
│   │   └── ui/
│   │       └── MeditativeCard.svelte        # Glass-morphism card component
│   ├── utils/
│   │   ├── randomness.ts            # Controlled randomness utilities
│   │   └── timer.ts                 # Time parsing, formatting, and validation utilities
│   └── assets/                      # Static assets
├── app.html                         # HTML template with font imports
└── app.d.ts                         # TypeScript declarations

tests/                               # Playwright tests
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
- Gentle completion bell sound using Web Audio API
- Single-card interface with smooth state transitions

**Timer Utilities**: The `timer.ts` module provides comprehensive time handling:

- `parseTimeString()` - Parse MM:SS format with validation
- `formatTimeInput()` - Real-time input formatting with colon insertion
- `generateRandomDuration()` - Uniform random time generation
- `calculateAverage()` - Live average calculation
- `validateTimeRange()` - Input validation and error handling

**Testing**: Complete Playwright test suite covering all timer functionality including input validation, state transitions, and completion flow.

### Performance Considerations

- All animations use CSS transforms for 60fps performance
- Hardware acceleration with `transform3d` and `will-change`
- Minimal JavaScript for animation logic
- Timer uses efficient `setInterval` with proper cleanup
- Comprehensive accessibility support with motion preferences
- Bundle-optimized with strategic CSS custom properties
