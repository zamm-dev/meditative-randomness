---
id: UGX879
type: spec
---

# Meditation history

Records should be kept of meditation end times (with timezone data) and duration.

A new record should be created upon the succesful completion of a meditation session. The meditation completion screen should show a list of these records, and also allow for the deletion of any one of these records.

> [!NOTE]
> Records should be stored in local storage instead of browser cookies because cookies are limited to 4 KB.

## Date Grouping

History entries should be grouped by date. Each grouped entry displays:

- The date of the meditation sessions
- The total time spent meditating on that day
- A decorative `>` icon on hover indicating there are more entries to view

Clicking on a grouped entry expands it to show the usual list of individual entries for that date with a smooth slide animation. Grouped entries themselves should not have delete controls - only the individual entries within them.

## Individual Entries

Individual meditation records are shown when a grouped entry is expanded. Each individual entry displays the meditation end time and duration, with delete controls available.

### Delete Controls

- Delete controls should be visible only on hover for cleaner interface
- Delete controls should have confirmation in the form of checkmark or X buttons that represent confirm or cancel
- Delete controls should have fixed width in order to prevent resizing. Put a placeholder button in so that the trash delete icon is aligned with the X cancel icon once the user wants to delete something.
- Use proper icons instead of text buttons for better UX
- Keep all meditation record elements on a single line
