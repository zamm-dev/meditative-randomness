import { test, expect } from '@playwright/test';

test.describe('Meditation Timer', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('displays timer inputs and calculates average', async ({ page }) => {
		// Check that timer inputs are visible
		await expect(page.locator('input[id="min-time"]')).toBeVisible();
		await expect(page.locator('input[id="max-time"]')).toBeVisible();

		// Check default values
		await expect(page.locator('input[id="min-time"]')).toHaveValue('5:00');
		await expect(page.locator('input[id="max-time"]')).toHaveValue('10:00');

		// Check that expected average is displayed
		await expect(page.locator('text=Expected average: 7:30')).toBeVisible();
	});

	test('updates average when inputs change', async ({ page }) => {
		// Change minimum time
		await page.locator('input[id="min-time"]').fill('2:00');
		await page.locator('input[id="min-time"]').blur();

		// Check that average updates
		await expect(page.locator('text=Expected average: 6:00')).toBeVisible();

		// Change maximum time
		await page.locator('input[id="max-time"]').fill('15:00');
		await page.locator('input[id="max-time"]').blur();

		// Check that average updates again
		await expect(page.locator('text=Expected average: 8:30')).toBeVisible();
	});

	test('formats time input correctly', async ({ page }) => {
		// Test various input formats
		await page.locator('input[id="min-time"]').fill('130');
		await page.locator('input[id="min-time"]').blur();
		await expect(page.locator('input[id="min-time"]')).toHaveValue('1:30');

		await page.locator('input[id="max-time"]').fill('2345');
		await page.locator('input[id="max-time"]').blur();
		await expect(page.locator('input[id="max-time"]')).toHaveValue('23:45');
	});

	test('shows error for invalid time range', async ({ page }) => {
		// Set max time less than min time
		await page.locator('input[id="min-time"]').fill('10:00');
		await page.locator('input[id="max-time"]').fill('5:00');
		await page.locator('input[id="max-time"]').blur();

		// Check error message is displayed
		await expect(page.locator('text=Maximum time must be greater than minimum time')).toBeVisible();

		// Check that start button is disabled
		await expect(page.locator('button:has-text("Begin Practice")')).toBeDisabled();
	});

	test('can start and stop timer', async ({ page }) => {
		// Start the timer
		await page.locator('button:has-text("Begin Practice")').click();

		// Check that timer interface changes
		await expect(page.locator('.elapsed-time')).toBeVisible();
		await expect(page.locator('text=Expected average:')).toBeVisible();
		await expect(page.locator('button:has-text("End Practice")')).toBeVisible();

		// Check that inputs are hidden
		await expect(page.locator('input[id="min-time"]')).not.toBeVisible();
		await expect(page.locator('input[id="max-time"]')).not.toBeVisible();

		// Wait a moment and check that elapsed time has updated
		await page.waitForTimeout(1100);
		await expect(page.locator('.elapsed-time')).toContainText('00:01');

		// Stop the timer
		await page.locator('button:has-text("End Practice")').click();

		// Check that we're back to setup interface
		await expect(page.locator('input[id="min-time"]')).toBeVisible();
		await expect(page.locator('input[id="max-time"]')).toBeVisible();
		await expect(page.locator('button:has-text("Begin Practice")')).toBeVisible();
	});

	test('timer completion flow', async ({ page }) => {
		// Set very short timer for testing (1 second)
		await page.locator('input[id="min-time"]').fill('0:01');
		await page.locator('input[id="max-time"]').fill('0:01');
		await page.locator('input[id="max-time"]').blur();

		// Start the timer
		await page.locator('button:has-text("Begin Practice")').click();

		// Wait for completion (plus buffer)
		await page.waitForTimeout(1500);

		// Check completion interface
		await expect(page.locator('text=Practice Complete')).toBeVisible();
		await expect(page.locator('text=Total time:')).toBeVisible();
		await expect(page.locator('button:has-text("New Practice")')).toBeVisible();

		// Start new practice
		await page.locator('button:has-text("New Practice")').click();

		// Check that we're back to setup
		await expect(page.locator('input[id="min-time"]')).toBeVisible();
		await expect(page.locator('button:has-text("Begin Practice")')).toBeVisible();
	});

	test('maintains timer state during meditation', async ({ page }) => {
		// Start timer with 30 second range
		await page.locator('input[id="min-time"]').fill('0:30');
		await page.locator('input[id="max-time"]').fill('0:30');
		await page.locator('input[id="max-time"]').blur();

		await page.locator('button:has-text("Begin Practice")').click();

		// Check that expected average is still shown
		await expect(page.locator('text=Expected average: 0:30')).toBeVisible();

		// Check that elapsed time is updating
		await page.waitForTimeout(2100);
		await expect(page.locator('.elapsed-time')).toContainText('00:02');

		// Verify we can still end practice
		await expect(page.locator('button:has-text("End Practice")')).toBeVisible();
	});
});
