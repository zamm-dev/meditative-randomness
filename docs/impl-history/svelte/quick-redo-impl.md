---
id: DQW917
type: ref-impl
specs:
  - id: RUQ378
    path: /spec-history/quick-redo.md
impl:
  id: KIT939
  path: /impls/svelte.md
commits:
  - sha: ef4d649d99711aaf6dd9f818b6c7375fd8c842f5
    message: Add quick redo button for meditation timer
---

# Quick Redo Button Implementation

## Implementation Approach

Added a "Quick Redo" button to the completed state that immediately restarts a meditation session using the same min/max parameters to generate a new random duration.

### Key Changes

1. **UI Addition**: Added Quick Redo button in the completed state template block alongside the existing "New Practice" button
2. **Shared Logic**: Extracted common timer initialization logic into `beginTimerWithDuration()` helper to avoid code duplication between `startTimer()` and `redoTimer()`
3. **Button Styling**: Created `.redo-button` CSS with green gradient to match the "Begin Practice" button style, and added `.button-group` flexbox container for side-by-side layout

### Implementation Notes

**Important Clarification**: The spec requirement "starts the same meditation session again" was clarified during implementation. The correct behavior is:

- ✅ Reuse the same min/max time parameters
- ✅ Generate a NEW random duration within that range
- ❌ NOT reuse the exact same duration

The `redoTimer()` function simply calls `startTimer()` which handles parameter validation and random duration generation.

### Testing Approach

Added three E2E tests:

1. **UI Visibility**: Verify Quick Redo button appears after completion
2. **Random Duration**: Confirm new random duration is generated (not the same duration)
3. **Wake Lock**: Ensure wake lock is requested again when redoing

The random duration test uses a 1-3 second range and validates both completions fall within that range using regex pattern `/Total time: 00:0[1-3]/`.
