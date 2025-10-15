---
id: FQP740
type: spec
---

# Random Meditation Timer

There should be a meditation timer that allows the user to set a minimum and maximum time. The text boxes should allow for seconds to be specified via colons. The average expected meditation time should be displayed and updated with every keystroke.

Once the user hits start, a random destination time should be picked from a uniform distribution between the minimum and maximum time. The actual time should not be shown, but the time elapsed should be shown so that the user knows it's running.

When the meditation time is up, a gentle sound should be played.

## User Interface States

1. **Setup State**: Input fields, average display, disabled start button (until valid times entered). Input field values should be persisted across different states.
2. **Running State**: Elapsed timer, stop button, hidden target duration
3. **Completed State**: Completion message, restart option

## Time Input Interface

- **Format**: Two input fields accepting MM:SS format with colon separator
- **Labels**: "Minimum Time" and "Maximum Time"
- **Real-time Formatting**: Automatic colon insertion and MM:SS validation as user types
- **Validation**:
  - Accept only valid time formats (00:00 to 99:59)
  - Seconds must be 00-59
  - Minimum time must be less than or equal to maximum time
  - Both fields required before timer can start

## Timer Display Behavior

- **During Setup**: Show input fields, average calculation, and start button
- **During Running Session**:
  - Hide all input controls and start button
  - Display elapsed time in MM:SS format (not remaining time)
  - Show "Elapsed: MM:SS" label
  - Provide stop/end practice button
- **After Completion**: Show completion message and option to restart

## Layout Consistency

The main meditation div (central content area) must maintain a consistent fixed width across all states (Setup, Running, and Completed). This ensures a stable, non-jarring visual experience as users transition between states.

The fixed width should be responsive and relative to the browser window size. It should have a maximum width, but if the browser window gets smaller (e.g. on mobile), its width should similarly be constrained by the browser window width so as to not require horizontal scrolling.

-
