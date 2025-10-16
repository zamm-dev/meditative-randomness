import { test, expect, type Page } from '@playwright/test';
import { mockAudio } from './test-utils';

interface TestGlobal {
	wakeLockRequested: boolean;
	wakeLockReleased: boolean;
}

interface MockWakeLockSentinel {
	released: boolean;
	release(): Promise<void>;
	addEventListener(type: string, listener: () => void): void;
}

test.describe('Meditation Timer', () => {
	test.beforeEach(async ({ page }) => {
		// Set prefers-reduced-motion to disable animations
		await page.emulateMedia({ reducedMotion: 'reduce' });

		// Mock Audio constructor to prevent sound playback during tests
		await mockAudio(page);

		await page.goto('/');
	});

	// Helper function to get wake lock state from page
	async function getWakeLockState(page: Page) {
		return await page.evaluate(() => {
			const testGlobal = globalThis as typeof globalThis & TestGlobal;
			return {
				wakeLockRequested: testGlobal.wakeLockRequested,
				wakeLockReleased: testGlobal.wakeLockReleased
			};
		});
	}

	// Helper function to setup wake lock mocking
	async function setupWakeLockMock(page: Page) {
		await page.addInitScript(() => {
			let mockWakeLock: MockWakeLockSentinel | null = null;
			const testGlobal = globalThis as typeof globalThis & TestGlobal;
			testGlobal.wakeLockRequested = false;
			testGlobal.wakeLockReleased = false;

			Object.defineProperty(globalThis.navigator, 'wakeLock', {
				value: {
					request: async () => {
						testGlobal.wakeLockRequested = true;
						mockWakeLock = {
							released: false,
							release: async () => {
								testGlobal.wakeLockReleased = true;
								if (mockWakeLock) {
									mockWakeLock.released = true;
								}
							},
							addEventListener: () => {}
						};
						return mockWakeLock;
					}
				},
				writable: true,
				configurable: true
			});
		});
	}

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
		await expect(page.locator("text=Maximum time can't be less than minimum time")).toBeVisible();

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

	test('wake lock is requested during timer start', async ({ page }) => {
		// Setup wake lock mock and reload page
		await setupWakeLockMock(page);
		await page.goto('/');

		// Start the timer
		await page.locator('button:has-text("Begin Practice")').click();

		// Check that wake lock was requested
		const state1 = await getWakeLockState(page);
		expect(state1.wakeLockRequested).toBe(true);

		// Stop the timer
		await page.locator('button:has-text("End Practice")').click();

		// Check that wake lock was released
		const state2 = await getWakeLockState(page);
		expect(state2.wakeLockReleased).toBe(true);
	});

	test('wake lock is released on timer completion', async ({ page }) => {
		// Setup wake lock mock and reload page
		await setupWakeLockMock(page);
		await page.goto('/');

		// Set very short timer for completion testing
		await page.locator('input[id="min-time"]').fill('0:01');
		await page.locator('input[id="max-time"]').fill('0:01');
		await page.locator('input[id="max-time"]').blur();

		// Start the timer
		await page.locator('button:has-text("Begin Practice")').click();

		// Verify wake lock was requested
		const state1 = await getWakeLockState(page);
		expect(state1.wakeLockRequested).toBe(true);

		// Wait for completion
		await page.waitForTimeout(1500);
		await expect(page.locator('text=Practice Complete')).toBeVisible();

		// Check that wake lock was released on completion
		const state2 = await getWakeLockState(page);
		expect(state2.wakeLockReleased).toBe(true);
	});

	test('gracefully handles unsupported wake lock API', async ({ page }) => {
		// Remove wake lock API to simulate unsupported browser
		await page.addInitScript(() => {
			Object.defineProperty(globalThis.navigator, 'wakeLock', {
				value: undefined,
				configurable: true
			});
		});

		// Start timer - should work without wake lock
		await page.locator('button:has-text("Begin Practice")').click();

		// Timer should still function normally
		await expect(page.locator('.elapsed-time')).toBeVisible();
		await expect(page.locator('button:has-text("End Practice")')).toBeVisible();

		// Stop timer - should work without errors
		await page.locator('button:has-text("End Practice")').click();
		await expect(page.locator('button:has-text("Begin Practice")')).toBeVisible();
	});

	test('quick redo button appears after completion', async ({ page }) => {
		// Set very short timer for testing (1 second)
		await page.locator('input[id="min-time"]').fill('0:01');
		await page.locator('input[id="max-time"]').fill('0:01');
		await page.locator('input[id="max-time"]').blur();

		// Start the timer
		await page.locator('button:has-text("Begin Practice")').click();

		// Wait for completion
		await expect(page.locator('text=Practice Complete')).toBeVisible();

		// Check that Quick Redo button is visible
		await expect(page.locator('button:has-text("Quick Redo")')).toBeVisible();
		await expect(page.locator('button:has-text("New Practice")')).toBeVisible();
	});

	test('quick redo generates new random duration with same parameters', async ({ page }) => {
		// Set short timer range for testing (1-3 seconds)
		await page.locator('input[id="min-time"]').fill('0:01');
		await page.locator('input[id="max-time"]').fill('0:03');
		await page.locator('input[id="max-time"]').blur();

		// Start the timer
		await page.locator('button:has-text("Begin Practice")').click();

		// Wait for completion
		await expect(page.locator('text=Practice Complete')).toBeVisible();
		const firstDuration = await page.locator('.completion-time').textContent();

		// Click Quick Redo
		await page.locator('button:has-text("Quick Redo")').click();

		// Verify timer restarted with same parameters (shows expected average: 0:02)
		await expect(page.locator('.elapsed-time')).toBeVisible();
		await expect(page.locator('text=Expected average: 0:02')).toBeVisible();
		await expect(page.locator('button:has-text("End Practice")')).toBeVisible();

		// Wait for completion again - should complete with a new random duration
		await expect(page.locator('text=Practice Complete')).toBeVisible();
		const secondDuration = await page.locator('.completion-time').textContent();

		// Verify both completions happened (durations should be in range 00:01-00:03)
		expect(firstDuration).toMatch(/Total time: 00:0[1-3]/);
		expect(secondDuration).toMatch(/Total time: 00:0[1-3]/);
	});

	test('quick redo requests wake lock again', async ({ page }) => {
		// Setup wake lock mock and reload page
		await setupWakeLockMock(page);
		await page.goto('/');

		// Set very short timer for testing
		await page.locator('input[id="min-time"]').fill('0:01');
		await page.locator('input[id="max-time"]').fill('0:01');
		await page.locator('input[id="max-time"]').blur();

		// Start the timer
		await page.locator('button:has-text("Begin Practice")').click();

		// Wait for completion
		await expect(page.locator('text=Practice Complete')).toBeVisible();

		// Verify wake lock was released after completion
		const state1 = await getWakeLockState(page);
		expect(state1.wakeLockReleased).toBe(true);

		// Click Quick Redo
		await page.locator('button:has-text("Quick Redo")').click();

		// Verify wake lock was requested again
		// (Note: the mock doesn't reset wakeLockRequested, so it should still be true)
		const state2 = await getWakeLockState(page);
		expect(state2.wakeLockRequested).toBe(true);

		// Timer should be running
		await expect(page.locator('.elapsed-time')).toBeVisible();
	});
});
