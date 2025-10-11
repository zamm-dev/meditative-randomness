---
id: ARN348
type: ref-impl
specs:
  - id: QKJ093
    path: /specs/import-export.md
impl:
  id: KIT939
  path: /impls/svelte.md
commits:
  - sha: 1f01e4caf55a67f7d6865d58bd40ab1415134940
    message: Improve meditation history layout
  - sha: f65ef4c7ac8cec4016aea20b113f6d98c933689f
    message: Add import and export functionality for meditation history
---

# Import/Export Implementation for Svelte

This document details the implementation of meditation history import and export functionality for the Svelte web application.

## Implementation Steps

1. **Added export/import utilities to `src/lib/utils/history.ts`**:
   - `exportMeditationHistory()` - exports all records with version and exportDate metadata
   - `generateExportFilename()` - creates filename with format `meditation-history-YYYY-MM-DD.json`
   - `importMeditationHistory()` - validates and imports records, merging with existing data
   - `isValidMeditationRecord()` - validates record structure (id, endTime, duration fields)
   - Proper validation of ISO 8601 dates and positive integer durations

2. **Updated `MeditationHistory.svelte` component**:
   - Added Export and Import buttons with Download/Upload icons from lucide-svelte
   - Implemented file download using Blob API and URL.createObjectURL
   - Implemented file picker using hidden input element with `.json` accept attribute
   - Added status message display with 5-second auto-dismiss
   - Used `globalThis.Blob`, `globalThis.URL`, and `globalThis.document` to avoid ESLint no-undef errors

3. **Added MeditationHistory to idle state in `MeditationTimer.svelte`**:
   - Previously only shown on completion screen
   - Now visible in both idle (setup) and completed states per spec requirement

4. **Created comprehensive Playwright test suite** (`tests/import-export.spec.ts`):
   - 11 new tests covering all import/export scenarios
   - Tests for empty history, full workflow, duplicate prevention, validation
   - Uses Node.js fs module to create test files and verify exports
   - Helper function `addMeditationRecords()` to complete short timers for test data

5. **Fixed test issues**:
   - Tests were expecting to see completion screen after page reload, but timer state resets
   - Removed unnecessary `page.goto('/')` calls to stay on completion screen after adding records

6. **Layout improvements** (post-implementation):
   - Restructured history item layout: datetime on left, duration on right next to delete icon
   - Removed excessive left margin, added balanced margin to align with hidden delete controls
   - Created `record-right` container to group duration and action buttons

## Implementation Notes

**ESLint browser globals**: When using browser APIs like `Blob`, `URL`, and `document` in Svelte components, use `globalThis.` prefix to avoid ESLint `no-undef` errors. Following the project's development lessons, we use proper TypeScript/ESLint patterns rather than disabling rules.

**Test pattern for file operations**: Playwright tests can use Node.js `fs` module (`readFileSync`, `writeFileSync`) in combination with browser file chooser events to test file import/export functionality. The `page.waitForEvent('download')` and `page.waitForEvent('filechooser')` patterns work well for this.

**Component state persistence**: After page reload, Svelte component state resets to initial values. Tests should not expect to remain on completion screen after `page.goto('/')`. Either stay on the current screen or adjust test expectations accordingly.

**LocalStorage testing**: The `page.evaluate()` method can access `globalThis.localStorage` to directly verify stored data in tests, which is useful for validating import/export without relying solely on UI state.

**Layout considerations**: Initially implemented with duration next to datetime on the left, but user feedback led to restructuring with duration on the right next to delete controls for better visual balance and information hierarchy.
