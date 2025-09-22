---
id: SRX615
type: ref-impl
specs:
  - id: FQP740
    path: /docs/specs/random-timer.md
impl:
  id: KIT939
  path: /docs/impls/svelte.md
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
