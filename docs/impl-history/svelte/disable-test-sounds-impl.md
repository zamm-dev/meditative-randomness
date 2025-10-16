---
id: YBQ642
type: ref-impl
specs:
  - id: QHV154
    path: /spec-history/disable-test-sounds.md
impl:
  id: KIT939
  path: /impls/svelte.md
commits:
  - sha: e65f551ff6e05a6ee37a9a35cff85f4a7ab02dcd
    message: Disable sound playback during meditation timer tests
---

# Disable Sound Playback in Tests

## Implementation Approach

Mock the Web Audio API's `AudioContext` in Playwright tests to prevent actual sound playback during test execution.

## Key Implementation Details

**Location**: `tests/timer.spec.ts` - Added AudioContext mock to the `beforeEach` hook

**Approach**: Used `Object.defineProperty` to override `globalThis.AudioContext` with a mock class in the Playwright page initialization script.

**Mock Structure**:

- Created a `MockAudioContext` class with stub methods matching the Web Audio API interface
- Implemented `createOscillator()` and `createGain()` methods that return objects with no-op functions
- Included `close()` method returning a resolved promise

## Challenges and Solutions

**Type Safety Issues**:

- **Challenge**: Initial approach using direct assignment `(globalThis as SomeType).AudioContext = MockClass` caused TypeScript errors about incompatible types
- **Solution**: Used `Object.defineProperty(globalThis, 'AudioContext', {...})` pattern instead, matching the existing wake lock mock approach in the same file
- **Key Lesson**: When mocking browser globals in test init scripts, prefer `Object.defineProperty` over direct assignment to avoid type compatibility issues

**Code Quality Standards**:

- **Challenge**: First attempts used `any` type or `eslint-disable` comments to work around type errors
- **User Feedback**: Never use `any` types or disable linting rules - defeats the purpose of having them
- **Solution**: Removed all type workarounds and used the `Object.defineProperty` approach which requires no special typing

## Testing

All timer tests pass with the mock in place (10/10 on Chromium). The mock successfully prevents sound playback while allowing timer completion flow to execute normally.
