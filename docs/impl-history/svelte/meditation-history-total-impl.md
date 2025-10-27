---
id: AXU158
type: ref-impl
specs:
  - id: TVA328
    path: /spec-history/meditation-history-total.md
impl:
  id: KIT939
  path: /impls/svelte.md
commits:
  - sha: e3d87b1ec9300267da505112bc2734a7ba169bd0
    message: Add total meditation time display across all sessions
---

# Meditation History: Total Time Display

## Implementation Approach

### Core Changes

1. **Added `calculateTotalDuration` utility function** (src/lib/utils/history.ts:215)
   - Simple reduce operation to sum all record durations
   - Returns total seconds across all meditation records

2. **Enhanced `formatDuration` function** (src/lib/utils/history.ts:124-151)
   - Extended to handle hours for totals >= 1 hour
   - Format: "2h 15m 30s" when >= 1 hour, "45m 20s" otherwise
   - Maintains backward compatibility with existing usage

3. **Updated MeditationHistory component** (src/lib/components/timer/MeditationHistory.svelte)
   - Added total duration display at top of history (line 150-152)
   - Plain text styling with `--color-neutral-dark` for high contrast
   - Only shown when history.length > 0

### Performance Considerations

**Critical: Firefox Performance Issue**

Initial implementation used `$derived` for totalDuration calculation:

```typescript
let totalDuration = $derived(calculateTotalDuration(history));
```

This caused Firefox-specific test timeouts (2 tests failing at 20+ seconds). The reactive recalculation on every history update was slow enough in Firefox to accumulate delays during tests that add multiple records.

**Solution**: Calculate inline in the template instead:

```svelte
{formatDuration(calculateTotalDuration(history))}
```

This optimization reduced test times significantly:

- Test 1: 20s+ timeout → 12s pass
- Test 2: 22s timeout → 15s pass

All 72 tests now pass across Chromium, Firefox, and WebKit.

### Styling Approach

Per user requirements:

- Plain text (no border, no background)
- High contrast using `--color-neutral-dark`
- Simple layout with just bottom margin spacing

## Testing Notes

- All existing tests pass without modification
- No new tests required (display is purely additive)
- Verified across all three browser engines
- Performance optimization was necessary for Firefox compatibility
