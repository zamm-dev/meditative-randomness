import { type Page } from '@playwright/test';

/**
 * Mock AudioContext to prevent sound playback during tests
 */
export async function mockAudioContext(page: Page): Promise<void> {
	await page.addInitScript(() => {
		class MockAudioContext {
			currentTime = 0;
			destination = {};

			createOscillator() {
				return {
					connect: () => {},
					frequency: {
						setValueAtTime: () => {},
						exponentialRampToValueAtTime: () => {}
					},
					start: () => {},
					stop: () => {}
				};
			}

			createGain() {
				return {
					connect: () => {},
					gain: {
						setValueAtTime: () => {},
						linearRampToValueAtTime: () => {},
						exponentialRampToValueAtTime: () => {}
					}
				};
			}

			close() {
				return Promise.resolve();
			}
		}

		Object.defineProperty(globalThis, 'AudioContext', {
			value: MockAudioContext,
			writable: true,
			configurable: true
		});
	});
}
