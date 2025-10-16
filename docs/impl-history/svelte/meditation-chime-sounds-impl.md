---
id: FAW600
type: ref-impl
specs:
  - id: WFR548
    path: /spec-history/meditation-chime-sounds.md
impl:
  id: KIT939
  path: /impls/svelte.md
commits:
  - sha: 95df225b9f388938f3a15b0b7bd999ac36e5c9d8
    message: Add meditation chime sounds to timer
---

# Meditation Chime Sounds Implementation

## Overview

Replaced the synthesized Web Audio API bell sound with actual MP3 audio files for meditation start and end chimes.

## Implementation Steps

1. **Updated MeditationTimer Component**:
   - Removed `audioContext` state variable (no longer needed)
   - Created `playSound(soundPath: string)` function using browser's `Audio` API
   - Modified `startTimer()` to play `/sounds/chime-start.mp3` when meditation begins
   - Modified `completeTimer()` to play `/sounds/chime-end.mp3` when meditation completes
   - Removed `playCompletionSound()` function that synthesized bell sound
   - Cleaned up `onDestroy()` to remove AudioContext cleanup

2. **Updated Test Utilities**:
   - Added `mockAudio()` function to mock the `Audio` constructor
   - Removed `mockAudioContext()` function (no longer used)
   - Updated test imports to use `mockAudio` instead of `mockAudioContext`

3. **Fixed ESLint Configuration**:
   - Added `Audio: 'readonly'` to globals for Svelte files in `eslint.config.js`
   - This prevented ESLint error: "'Audio' is not defined"

## Challenges & Solutions

### ESLint Error on Pre-commit Hook

**Issue**: Pre-commit hook failed with `'Audio' is not defined` error.

**Solution**: Added `Audio` to the ESLint globals configuration for Svelte files, following the project's pattern of using proper globals configuration rather than disabling ESLint rules.

### Test Sound Playback

**Issue**: Tests were playing actual sounds during execution, violating the spec requirement.

**Solution**: Created `mockAudio()` utility function to mock the `Audio` constructor with a no-op `play()` method. Applied this mock in `beforeEach()` blocks for all test files that trigger meditation timer functionality.

## Key Learnings

1. **Browser Audio API**: The `Audio` constructor is simpler than Web Audio API for playing audio files - just `new Audio(path)` followed by `audio.play()`.

2. **Test Mocking Strategy**: When replacing one browser API with another (AudioContext → Audio), remember to update both the implementation AND the test mocks. The old mock function should be removed entirely to avoid confusion.

3. **ESLint Globals**: Always add browser APIs to ESLint globals configuration rather than disabling rules. The project already had a pattern for this with `AudioContext`, so following the same pattern for `Audio` was straightforward.
