import { type Page } from '@playwright/test';

/**
 * Mock Audio constructor to prevent sound playback during tests
 */
export async function mockAudio(page: Page): Promise<void> {
	await page.addInitScript(() => {
		class MockAudio {
			src = '';

			constructor(src?: string) {
				if (src) {
					this.src = src;
				}
			}

			play() {
				return Promise.resolve();
			}

			pause() {}

			load() {}
		}

		Object.defineProperty(globalThis, 'Audio', {
			value: MockAudio,
			writable: true,
			configurable: true
		});
	});
}
