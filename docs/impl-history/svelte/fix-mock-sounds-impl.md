---
id: XSB370
type: ref-impl
specs:
  - id: BJN939
    path: /spec-history/fix-mock-sounds.md
impl:
  id: KIT939
  path: /impls/svelte.md
commits:
  - sha: 17f8738e022c9c767dc8d83ea5390148f6b0994a
    message: Fix AudioContext mocking to prevent sound playback in tests
---

# Fix Mock Sounds Implementation

## Problem Diagnosis

The issue was that sounds were playing during tests because `import-export.spec.ts` had no AudioContext mock at all. The `timer.spec.ts` file already had an AudioContext mock in place, but the import-export tests (which also trigger timer completion and sound playback) were missing it entirely.

## Solution

Created a shared test utility module to avoid code duplication:

1. **Created `tests/test-utils.ts`** - Extracted the AudioContext mock into a reusable `mockAudioContext()` function
2. **Updated `tests/timer.spec.ts`** - Replaced inline mock with import and call to shared function
3. **Updated `tests/import-export.spec.ts`** - Added the missing AudioContext mock using the shared function

## Key Implementation Details

- The mock only needs to mock `AudioContext`, not `webkitAudioContext` (testing confirmed this)
- The mock must be set up via `page.addInitScript()` before `page.goto()`
- All mock methods can be no-ops since we just want to prevent actual audio playback
- The mock needs to implement: `createOscillator()`, `createGain()`, `close()`, `currentTime`, and `destination`

## Learnings

**Initial Wrong Assumption**: Thought we needed to mock both `AudioContext` and `webkitAudioContext` for browser compatibility. Testing proved only `AudioContext` was needed.

**Actual Root Cause**: The import-export tests simply didn't have any AudioContext mock, so sounds played when timers completed during those tests.
