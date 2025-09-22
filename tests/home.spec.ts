import { expect, test } from '@playwright/test';

test('home page loads and displays correct title', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle(/Meditative Randomness/);
	await expect(page.getByRole('heading', { level: 1 })).toContainText('Meditative Randomness');
});
