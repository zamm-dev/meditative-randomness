---
id: YEA188
type: ref-impl
specs:
  - id: GFP929
    path: /docs/specs/sleep.md
impl:
  id: KIT939
  path: /docs/impls/svelte.md
---

# Sleep Prevention Implementation Plan

## Overview

Implement sleep prevention functionality to prevent the computer from going to sleep during meditation countdown. This ensures users are properly alerted when their meditation session completes.

## Technical Approach

The implementation will use the Screen Wake Lock API, which is a modern web standard specifically designed for preventing device sleep during activities like video playback, presentations, and meditation timers.

**Browser Support**: The Screen Wake Lock API is supported in all modern browsers (Chrome 84+, Edge 84+, Safari 16.4+, Firefox via polyfill). For unsupported browsers, the implementation will gracefully degrade without breaking functionality.

## Implementation Plan

Since this is a focused addition to the existing timer system without multiple logical phases, this will be implemented as a single commit.

### Phase 1a: Implement Sleep Prevention Utility

Create a new utility module `src/lib/utils/wake-lock.ts` that provides:

- `requestWakeLock()` - Request screen wake lock with error handling
- `releaseWakeLock()` - Release active wake lock
- `isWakeLockSupported()` - Feature detection for progressive enhancement

The utility will:

- Use proper TypeScript types for the Screen Wake Lock API
- Handle permission failures gracefully
- Provide console logging for debugging
- Support cleanup and release functionality

### Phase 1b: Integrate Sleep Prevention into MeditationTimer

Modify `src/lib/components/timer/MeditationTimer.svelte` to:

- Import wake lock utilities
- Request wake lock when timer starts (in `startTimer()`)
- Release wake lock when timer stops/completes (in `stopTimer()`, `completeTimer()`)
- Handle wake lock in cleanup (`onDestroy`)
- Maintain existing timer functionality without disruption

Integration points:

- `startTimer()`: Request wake lock after setting up interval
- `stopTimer()`: Release wake lock before clearing interval
- `completeTimer()`: Release wake lock after timer completion
- `onDestroy()`: Ensure wake lock is released on component cleanup

### Phase 1c: Add Comprehensive Tests

Extend the existing Playwright test suite in `tests/` to cover:

- Wake lock request during timer start
- Wake lock release during timer stop/completion
- Graceful handling when wake lock is not supported
- No regression in existing timer functionality

### Phase 1d: Commit Implementation

Commit all changes with descriptive message covering the sleep prevention feature addition.

## Technical Details

### Screen Wake Lock API Usage

```typescript
// Request wake lock
const wakeLock = await navigator.wakeLock.request('screen');

// Release wake lock
await wakeLock.release();
```

### Error Handling

- Handle `NotAllowedError` (user denied permission)
- Handle `AbortError` (page visibility changes)
- Graceful degradation for unsupported browsers
- Proper cleanup in all scenarios

### Integration Strategy

- Non-breaking changes to existing timer logic
- Progressive enhancement approach
- Minimal performance impact
- Consistent with existing codebase patterns

This implementation ensures meditation sessions are not interrupted by device sleep while maintaining backward compatibility and following established patterns in the codebase.
