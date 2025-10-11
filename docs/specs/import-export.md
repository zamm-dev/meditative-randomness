---
id: QKJ093
type: spec
---

# Import and Export Functionality

Users should be able to export their meditation history to a file and import meditation history from a file. This allows users to:

- Back up their meditation records
- Transfer their history between devices or browsers
- Restore their history if they clear their browser data
- Share their meditation data with other applications

## Export Functionality

The export functionality should allow users to download their complete meditation history as a JSON file.

### Export Requirements

- Export button should be visible in the meditation history view
- Clicking the export button should trigger a file download
- The exported file should be named `meditation-history-YYYY-MM-DD.json` where the date is the current date
- The exported JSON should contain an array of all meditation records with the following structure:
  ```json
  {
  	"version": "1.0",
  	"exportDate": "2025-10-11T12:34:56.789Z",
  	"records": [
  		{
  			"id": "uuid-string",
  			"endTime": "2025-10-11T10:30:00.000Z",
  			"duration": 600
  		}
  	]
  }
  ```
- The export should include all fields from the `MeditationRecord` interface
- If there are no records to export, the button should still be available but the exported file should contain an empty records array

## Import Functionality

The import functionality should allow users to upload a previously exported JSON file to restore or merge meditation history.

### Import Requirements

- Import button should be visible in the meditation history view
- Clicking the import button should open a file picker dialog
- Only JSON files should be accepted (`.json` file extension)
- The imported file should be validated:
  - Must be valid JSON
  - Must contain a `records` array
  - Each record must have required fields: `id`, `endTime`, and `duration`
  - Invalid files should show an error message to the user
- Import behavior:
  - Records with duplicate IDs should not be imported (existing records take precedence)
  - New records should be merged with existing records
  - After import, the history list should be updated to show all records sorted by end time (newest first)
- If the import is successful, show a success message indicating how many records were imported
- If the import fails, show a clear error message explaining what went wrong

### Import Validation

- `id`: Must be a non-empty string
- `endTime`: Must be a valid ISO 8601 date string
- `duration`: Must be a positive number (integer)
- Records missing required fields should be skipped with a warning

## UI Placement

- Both import and export buttons should be placed in the meditation history section
- Buttons should be clearly labeled "Export History" and "Import History"
- Consider placing them together in a toolbar or action area above or below the history list
- Buttons must be accessible in all application states where history is visible, including both empty history and active meditation states

## Error Handling

- File read errors: "Failed to read the selected file"
- Invalid JSON: "The selected file is not a valid JSON file"
- Invalid format: "The file does not contain valid meditation history data"
- Network/storage errors: "Failed to save imported records to storage"
- Successful import: "Successfully imported X meditation record(s)"

## Testing

In order to verify the correct implementation of this spec:

1. Export an empty history and verify the file contains an empty records array
2. Add some meditation records and export them
3. Clear the history and import the exported file
4. Verify all records are restored correctly
5. Export again and verify the new export matches the original
6. Try importing the same file again and verify no duplicate records are created
7. Test importing an invalid JSON file and verify error handling
8. Test importing a JSON file with invalid record structure and verify validation
