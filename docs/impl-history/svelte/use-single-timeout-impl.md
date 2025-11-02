---
id: IKS231
type: ref-impl
specs:
  - id: JWS425
    path: /spec-history/use-single-timeout.md
impl:
  id: KIT939
  path: /impls/svelte.md
commits:
  - sha: 3eebce757830764ea22ba4c53c6ecf99f18bcf79
    message: Implement single timeout for accurate timer completion
---

# Single Timeout Timer Implementation

## Overview

Refactored the meditation timer to use a single `setTimeout` for accurate timer completion instead of checking completion in the `setInterval` loop.

## Implementation Steps

1. **Added timeout tracking**: Added `timeoutId` state variable alongside existing `intervalId` in MeditationTimer.svelte
2. **Separated concerns**:
   - `setTimeout` schedules exact completion at `targetDuration * 1000` milliseconds
   - `setInterval` only updates display by incrementing `elapsedSeconds`
3. **Ensured accurate recording**:
   - Set `elapsedSeconds = targetDuration` in `completeTimer()` before displaying
   - Save `targetDuration` instead of `elapsedSeconds` to history
4. **Updated cleanup**: All cleanup functions (`stopTimer`, `completeTimer`, `onDestroy`) now clear both `intervalId` and `timeoutId`
5. **Fixed ESLint**: Added `clearTimeout` to globals configuration in eslint.config.js

## Key Challenges & Solutions

### Timer Completion Timing

**Issue**: When `setTimeout` fires at the exact target duration, the `setInterval` may not have incremented `elapsedSeconds` to the final value yet, causing the completion display and saved history to show "00:00" or an incomplete duration.

**Solution**: Set `elapsedSeconds = targetDuration` in `completeTimer()` before state transition and save `targetDuration` (not `elapsedSeconds`) to history. This ensures accurate display and recording regardless of interval timing.

### ESLint Configuration

**Issue**: Pre-commit hooks failed with "clearTimeout is not defined" errors.

**Solution**: Added `clearTimeout` to the Svelte files globals section in eslint.config.js. Note that `setTimeout` and `setInterval` were already present but `clearTimeout` was missing.

## Testing Notes

All 48 existing Playwright tests pass without modification. The timer accuracy tests that verify completion durations (e.g., "quick redo generates new random duration") now pass reliably because the timer uses exact timeout scheduling rather than interval-based checking.

## Files Modified

- `src/lib/components/timer/MeditationTimer.svelte`: Core timer logic changes
- `eslint.config.js`: Added clearTimeout global
