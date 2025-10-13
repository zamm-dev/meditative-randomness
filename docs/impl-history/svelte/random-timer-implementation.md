---
id: SRX615
type: ref-impl
specs:
  - id: FQP740
    path: /specs/random-timer.md
impl:
  id: KIT939
  path: /impls/svelte.md
commits:
  - sha: 0ad92e0aa108288ebde9afd1250a680621fbaa2f
    message: Complete random meditation timer implementation
---

# Random Meditation Timer Implementation Plan

This plan implements the Random Meditation Timer specification (FQP740) for the Svelte web application.

## Requirements Analysis

The spec requires:

1. **Time Input**: Minimum and maximum time inputs with colon-separated format (MM:SS)
2. **Real-time Preview**: Display average expected meditation time that updates with every keystroke
3. **Random Duration**: Pick uniform random time between min/max when started
4. **Timer Display**: Show elapsed time while running (not remaining time)
5. **Hidden Duration**: Don't reveal the actual target duration to maintain meditation focus

## Implementation Plan

### Phase 1: Core Timer Component

**Goals:**

- Create a new `MeditationTimer` component
- Implement time input parsing and validation
- Add real-time average calculation
- Create basic timer state management

**Technical Details:**

- Component location: `src/lib/components/timer/MeditationTimer.svelte`
- Utility functions in `src/lib/utils/timer.ts` for:
  - Time string parsing (MM:SS format)
  - Time validation
  - Average calculation
  - Random duration generation
- State management with Svelte 5 runes for reactive timer state
- Integration with existing meditative design system

**UI Components:**

- Two `MeditativeCard` components for min/max time inputs
- Time input fields with colon formatting support
- Real-time average display
- Start/stop button with meditative styling
- Elapsed time display during timer session

**Phase 1 Commit:** "Add core meditation timer component with time inputs and average calculation"

### Phase 2: Timer Functionality & Integration

**Goals:**

- Implement timer countdown logic
- Add timer completion handling
- Integrate with existing page layout
- Add accessibility features

**Technical Details:**

- Timer state management with proper cleanup
- Integration with existing animation system
- Responsive design for mobile devices
- Accessibility support (ARIA labels, keyboard navigation)
- Gentle completion sound with Web Audio API
- Sound asset sourcing (meditation bell or singing bowl)

**UI Enhancements:**

- Breathing animations during timer session
- Subtle visual feedback for timer state
- Integration with existing gradient backgrounds
- Smooth transitions between states

**Testing:**

- Playwright tests for timer functionality
- Edge case testing (invalid inputs, browser tab switching)
- Mobile responsiveness testing

**Phase 2 Commit:** "Complete meditation timer with countdown logic and accessibility features"

## File Structure

```
src/lib/
├── components/
│   └── timer/
│       └── MeditationTimer.svelte     # Main timer component
├── utils/
│   └── timer.ts                       # Timer utility functions
├── types/
│   └── timer.ts                       # TypeScript types
└── assets/
    └── sounds/
        └── meditation-bell.mp3        # Gentle completion sound
```

## Design Integration

- **Colors**: Use existing meditative color palette (warm earth tones, blue accents)
- **Typography**: Follow Inter font system with light weights
- **Animations**: Integrate with existing breathing and drift animations
- **Cards**: Use `MeditativeCard` component for consistent glass-morphism styling
- **Spacing**: Follow existing CSS custom property spacing system

## Technical Considerations

- **Performance**: Use requestAnimationFrame for smooth timer updates
- **Accessibility**: Full keyboard navigation and screen reader support
- **Mobile**: Touch-friendly inputs with proper viewport handling
- **Browser Compatibility**: Works across all major browsers
- **State Persistence**: Optional localStorage for timer preferences
- **Audio**: Web Audio API with fallback for older browsers, user gesture requirement
- **Sound Assets**: Source high-quality meditation bell/singing bowl (Creative Commons or royalty-free)

## Success Criteria

- [x] Time inputs accept MM:SS format and validate properly
- [x] Average time updates in real-time with every keystroke
- [x] Random duration is generated uniformly between min/max
- [x] Timer shows elapsed time without revealing target duration
- [x] Gentle sound plays when meditation time is complete
- [x] UI integrates seamlessly with existing meditative design
- [x] Component is accessible and mobile-friendly
- [x] All existing tests continue to pass
- [x] New Playwright tests validate timer functionality

## Implementation Results

### ✅ Successfully Completed

The random meditation timer has been successfully implemented and meets all specification requirements. Key achievements:

**Core Functionality:**

- ✅ MM:SS time input fields with real-time format validation and correction
- ✅ Live average time calculation updating with every keystroke
- ✅ Random duration generation from uniform distribution between min/max values
- ✅ Timer displays elapsed time only, keeping target duration hidden for mindful practice
- ✅ Gentle completion bell sound using Web Audio API

**Technical Implementation:**

- ✅ Clean utility functions for time parsing, formatting, and validation in `src/lib/utils/timer.ts`
- ✅ Responsive MeditationTimer component using Svelte 5 runes for reactive state management
- ✅ Integration with existing meditative design system using MeditativeCard components
- ✅ Comprehensive Playwright test suite covering all timer functionality scenarios
- ✅ Mobile-responsive design with proper touch-friendly inputs and responsive grid layout

**Quality Assurance:**

- ✅ ESLint configuration updated for browser APIs (AudioContext, setInterval, etc.)
- ✅ All existing tests continue to pass
- ✅ Pre-commit hooks ensure code formatting and linting standards
- ✅ Accessibility support with proper focus management and reduced motion preferences

### 🔧 Technical Decisions Made

**UI Design Approach:**

- Chose single-card interface that transitions between setup, active, and completed states
- Avoided complex height animations in favor of simple, reliable state transitions
- Used fadeIn animations for gentle visual feedback without layout complications

**Audio Implementation:**

- Implemented Web Audio API for completion sound generation rather than external sound files
- Created gentle meditation bell tone using oscillator with frequency ramping for organic sound

**State Management:**

- Used Svelte 5 runes ($state, $derived) for clean reactive patterns
- Implemented proper cleanup in onDestroy for timers and audio contexts

**Input Handling:**

- Built real-time MM:SS formatting with automatic colon insertion
- Added comprehensive validation for time ranges and user input edge cases
- Fixed input overflow issues with proper CSS grid constraints (width: 100%, min-width: 0)

### 📋 Final File Structure

```
src/lib/
├── components/
│   └── timer/
│       └── MeditationTimer.svelte    # Complete timer component
├── utils/
│   └── timer.ts                      # Timer utility functions
tests/
└── timer.spec.ts                     # Comprehensive test suite
```

### 🎯 All Spec Requirements Fulfilled

✅ **Time Input**: Accepts MM:SS format with colon separator and validates properly
✅ **Real-time Average**: Displays and updates average time with every keystroke
✅ **Random Duration**: Picks uniform random time between min/max when started
✅ **Elapsed Display**: Shows elapsed time during meditation (not remaining time)
✅ **Hidden Target**: Keeps actual target duration hidden to maintain meditation focus
✅ **Completion Sound**: Plays gentle bell sound when meditation time completes

The implementation is production-ready and fully integrated into the meditative randomness application.
