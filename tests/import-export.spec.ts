import { test, expect, type Page } from '@playwright/test';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

interface ExportData {
	version: string;
	exportDate: string;
	records: Array<{
		id: string;
		endTime: string;
		duration: number;
	}>;
}

test.describe('Import and Export Functionality', () => {
	test.beforeEach(async ({ page }) => {
		// Set prefers-reduced-motion to disable animations
		await page.emulateMedia({ reducedMotion: 'reduce' });
		// Clear localStorage before each test
		await page.goto('/');
		await page.evaluate(() => {
			globalThis.localStorage.clear();
		});
	});

	async function addMeditationRecords(page: Page, count: number) {
		// Add meditation records by completing short timers
		for (let i = 0; i < count; i++) {
			await page.goto('/');
			await page.locator('input[id="min-time"]').fill('0:01');
			await page.locator('input[id="max-time"]').fill('0:01');
			await page.locator('input[id="max-time"]').blur();
			await page.locator('button:has-text("Begin Practice")').click();
			await expect(page.locator('text=Practice Complete')).toBeVisible({ timeout: 10000 });
		}
	}

	async function getHistoryRecords(page: Page): Promise<ExportData['records']> {
		return await page.evaluate(() => {
			const stored = globalThis.localStorage.getItem('meditation_history');
			if (!stored) return [];
			return JSON.parse(stored);
		});
	}

	test('export and import buttons are visible', async ({ page }) => {
		await page.goto('/');

		// Add at least one record to show history section
		await addMeditationRecords(page, 1);
		// Don't reload - stay on completion screen

		// Wait for completion screen
		await expect(page.locator('text=Practice Complete')).toBeVisible();

		// Check that both buttons are visible
		await expect(page.locator('button:has-text("Export")')).toBeVisible();
		await expect(page.locator('button:has-text("Import")')).toBeVisible();
	});

	test('export button is accessible even with empty history', async ({ page }) => {
		await page.goto('/');

		// Check that buttons are visible even without records
		await expect(page.locator('button:has-text("Export")')).toBeVisible();
		await expect(page.locator('button:has-text("Import")')).toBeVisible();
	});

	test('exports empty history correctly', async ({ page }) => {
		await page.goto('/');

		// Setup download listener
		const downloadPromise = page.waitForEvent('download');

		// Click export button
		await page.locator('button:has-text("Export")').click();

		// Wait for download
		const download = await downloadPromise;

		// Verify filename format
		const filename = download.suggestedFilename();
		expect(filename).toMatch(/^meditation-history-\d{4}-\d{2}-\d{2}\.json$/);

		// Save and read the downloaded file
		const path = join(tmpdir(), filename);
		await download.saveAs(path);
		const content = readFileSync(path, 'utf-8');
		const data = JSON.parse(content) as ExportData;

		// Verify structure
		expect(data.version).toBe('1.0');
		expect(data.exportDate).toBeTruthy();
		expect(Array.isArray(data.records)).toBe(true);
		expect(data.records.length).toBe(0);
	});

	test('exports and imports meditation history correctly', async ({ page }) => {
		await page.goto('/');

		// Add some meditation records
		await addMeditationRecords(page, 3);
		// Don't reload - stay on completion screen

		// Wait for completion screen
		await expect(page.locator('text=Practice Complete')).toBeVisible();

		// Setup download listener
		const downloadPromise = page.waitForEvent('download');

		// Export
		await page.locator('button:has-text("Export")').click();
		const download = await downloadPromise;

		// Save the downloaded file
		const path = join(tmpdir(), 'test-export.json');
		await download.saveAs(path);
		const exportedContent = readFileSync(path, 'utf-8');
		const exportedData = JSON.parse(exportedContent) as ExportData;

		// Verify exported data
		expect(exportedData.records.length).toBe(3);
		expect(exportedData.version).toBe('1.0');

		// Clear localStorage
		await page.evaluate(() => {
			globalThis.localStorage.clear();
		});
		await page.reload();

		// Verify history is empty
		await expect(page.locator('text=No meditation sessions recorded yet.')).toBeVisible();

		// Setup file chooser
		const fileChooserPromise = page.waitForEvent('filechooser');
		await page.locator('button:has-text("Import")').click();
		const fileChooser = await fileChooserPromise;

		// Import the file
		await fileChooser.setFiles(path);

		// Verify success message
		await expect(page.locator('text=Successfully imported 3 meditation records')).toBeVisible();

		// Verify records are restored
		await page.reload();
		const records = await getHistoryRecords(page);
		expect(records.length).toBe(3);

		// Verify all records match
		for (let i = 0; i < 3; i++) {
			expect(records[i].id).toBe(exportedData.records[i].id);
			expect(records[i].endTime).toBe(exportedData.records[i].endTime);
			expect(records[i].duration).toBe(exportedData.records[i].duration);
		}
	});

	test('importing same file twice does not create duplicates', async ({ page }) => {
		await page.goto('/');

		// Add meditation records and export
		await addMeditationRecords(page, 2);
		// Don't reload - stay on completion screen
		await expect(page.locator('text=Practice Complete')).toBeVisible();

		const downloadPromise = page.waitForEvent('download');
		await page.locator('button:has-text("Export")').click();
		const download = await downloadPromise;

		const path = join(tmpdir(), 'test-duplicate.json');
		await download.saveAs(path);

		// Import the file
		const fileChooserPromise1 = page.waitForEvent('filechooser');
		await page.locator('button:has-text("Import")').click();
		const fileChooser1 = await fileChooserPromise1;
		await fileChooser1.setFiles(path);

		// Wait for success message
		await expect(page.locator('text=No new records to import')).toBeVisible();

		// Import the same file again
		await page.waitForTimeout(1000); // Wait for status message to clear
		const fileChooserPromise2 = page.waitForEvent('filechooser');
		await page.locator('button:has-text("Import")').click();
		const fileChooser2 = await fileChooserPromise2;
		await fileChooser2.setFiles(path);

		// Verify no new records imported
		await expect(page.locator('text=No new records to import')).toBeVisible();

		// Verify record count is still 2
		const records = await getHistoryRecords(page);
		expect(records.length).toBe(2);
	});

	test('handles invalid JSON file gracefully', async ({ page }) => {
		await page.goto('/');

		// Create invalid JSON file
		const invalidPath = join(tmpdir(), 'invalid.json');
		writeFileSync(invalidPath, 'this is not valid JSON', 'utf-8');

		// Setup file chooser
		const fileChooserPromise = page.waitForEvent('filechooser');
		await page.locator('button:has-text("Import")').click();
		const fileChooser = await fileChooserPromise;

		// Import invalid file
		await fileChooser.setFiles(invalidPath);

		// Verify error message
		await expect(page.locator('text=The selected file is not a valid JSON file')).toBeVisible();

		// Verify no records were added
		const records = await getHistoryRecords(page);
		expect(records.length).toBe(0);
	});

	test('handles invalid record structure', async ({ page }) => {
		await page.goto('/');

		// Create file with invalid structure (missing records array)
		const invalidStructurePath = join(tmpdir(), 'invalid-structure.json');
		writeFileSync(
			invalidStructurePath,
			JSON.stringify({
				version: '1.0',
				exportDate: new Date().toISOString()
				// Missing records array
			}),
			'utf-8'
		);

		// Setup file chooser
		const fileChooserPromise = page.waitForEvent('filechooser');
		await page.locator('button:has-text("Import")').click();
		const fileChooser = await fileChooserPromise;

		// Import invalid file
		await fileChooser.setFiles(invalidStructurePath);

		// Verify error message
		await expect(
			page.locator('text=The file does not contain valid meditation history data')
		).toBeVisible();
	});

	test('validates record fields during import', async ({ page }) => {
		await page.goto('/');

		// Create file with some valid and some invalid records
		const mixedPath = join(tmpdir(), 'mixed-records.json');
		const mixedData: ExportData = {
			version: '1.0',
			exportDate: new Date().toISOString(),
			records: [
				{
					id: 'valid-1',
					endTime: new Date().toISOString(),
					duration: 300
				},
				{
					id: '', // Invalid: empty id
					endTime: new Date().toISOString(),
					duration: 300
				},
				{
					id: 'valid-2',
					endTime: 'invalid-date', // Invalid: bad date
					duration: 300
				},
				{
					id: 'valid-3',
					endTime: new Date().toISOString(),
					duration: -50 // Invalid: negative duration
				},
				{
					id: 'valid-4',
					endTime: new Date().toISOString(),
					duration: 600
				}
			]
		};
		writeFileSync(mixedPath, JSON.stringify(mixedData), 'utf-8');

		// Import the file
		const fileChooserPromise = page.waitForEvent('filechooser');
		await page.locator('button:has-text("Import")').click();
		const fileChooser = await fileChooserPromise;
		await fileChooser.setFiles(mixedPath);

		// Should only import the 2 valid records
		await expect(page.locator('text=Successfully imported 2 meditation records')).toBeVisible();

		// Verify only valid records were imported
		const records = await getHistoryRecords(page);
		expect(records.length).toBe(2);
		expect(records.find((r) => r.id === 'valid-1')).toBeTruthy();
		expect(records.find((r) => r.id === 'valid-4')).toBeTruthy();
	});

	test('merges imported records with existing records', async ({ page }) => {
		await page.goto('/');

		// Add one meditation record
		await addMeditationRecords(page, 1);
		// Don't reload - stay on completion screen
		await expect(page.locator('text=Practice Complete')).toBeVisible();

		// Create a file with different records
		const importPath = join(tmpdir(), 'merge-test.json');
		const importData: ExportData = {
			version: '1.0',
			exportDate: new Date().toISOString(),
			records: [
				{
					id: 'import-1',
					endTime: '2025-01-01T10:00:00.000Z',
					duration: 300
				},
				{
					id: 'import-2',
					endTime: '2025-01-01T11:00:00.000Z',
					duration: 600
				}
			]
		};
		writeFileSync(importPath, JSON.stringify(importData), 'utf-8');

		// Import the file
		const fileChooserPromise = page.waitForEvent('filechooser');
		await page.locator('button:has-text("Import")').click();
		const fileChooser = await fileChooserPromise;
		await fileChooser.setFiles(importPath);

		// Verify success message
		await expect(page.locator('text=Successfully imported 2 meditation records')).toBeVisible();

		// Verify total count is 3 (1 existing + 2 imported)
		const records = await getHistoryRecords(page);
		expect(records.length).toBe(3);
	});

	test('sorts records by end time after import', async ({ page }) => {
		await page.goto('/');

		// Create a file with records in non-chronological order
		const importPath = join(tmpdir(), 'sort-test.json');
		const importData: ExportData = {
			version: '1.0',
			exportDate: new Date().toISOString(),
			records: [
				{
					id: 'old-record',
					endTime: '2024-01-01T10:00:00.000Z',
					duration: 300
				},
				{
					id: 'new-record',
					endTime: '2025-12-01T10:00:00.000Z',
					duration: 600
				},
				{
					id: 'mid-record',
					endTime: '2025-06-01T10:00:00.000Z',
					duration: 450
				}
			]
		};
		writeFileSync(importPath, JSON.stringify(importData), 'utf-8');

		// Import the file
		const fileChooserPromise = page.waitForEvent('filechooser');
		await page.locator('button:has-text("Import")').click();
		const fileChooser = await fileChooserPromise;
		await fileChooser.setFiles(importPath);

		// Verify success
		await expect(page.locator('text=Successfully imported 3 meditation records')).toBeVisible();

		// Verify records are sorted by end time (newest first)
		const records = await getHistoryRecords(page);
		expect(records[0].id).toBe('new-record');
		expect(records[1].id).toBe('mid-record');
		expect(records[2].id).toBe('old-record');
	});
});
