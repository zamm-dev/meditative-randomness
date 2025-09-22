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
│   │   └── ui/
│   │       └── MeditativeCard.svelte        # Glass-morphism card component
│   ├── utils/
│   │   └── randomness.ts            # Controlled randomness utilities
│   └── assets/                      # Static assets
├── app.html                         # HTML template with font imports
└── app.d.ts                         # TypeScript declarations

tests/                               # Playwright tests
```

### Git Hooks

Pre-commit hooks automatically run:

- Code formatting
- Linting
- Production build

Pre-push hooks run:

- All tests

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

### Performance Considerations

- All animations use CSS transforms for 60fps performance
- Hardware acceleration with `transform3d` and `will-change`
- Minimal JavaScript for animation logic
- Comprehensive accessibility support with motion preferences
- Bundle-optimized with strategic CSS custom properties
