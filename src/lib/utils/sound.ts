/**
 * Sound preloading and playback utilities
 */

const SOUND_PATHS = {
	start: '/sounds/chime-start.mp3',
	end: '/sounds/chime-end.mp3'
} as const;

// Store preloaded Audio instances
let preloadedSounds: Map<string, HTMLAudioElement> | null = null;

/**
 * Preloads all sound files used in the application.
 * Should be called once when the page loads.
 */
export function preloadSounds(): void {
	if (preloadedSounds) {
		return; // Already preloaded
	}

	preloadedSounds = new Map();

	for (const path of Object.values(SOUND_PATHS)) {
		try {
			const audio = new Audio(path);
			// Preload the audio data
			audio.preload = 'auto';
			preloadedSounds.set(path, audio);
		} catch (error) {
			console.warn(`Failed to preload sound ${path}:`, error);
		}
	}
}

/**
 * Plays a preloaded sound file.
 * If the sound hasn't been preloaded, this will fall back to creating a new Audio instance.
 */
export async function playSound(soundPath: string): Promise<void> {
	try {
		let audio: HTMLAudioElement;

		if (preloadedSounds && preloadedSounds.has(soundPath)) {
			// Use preloaded audio
			audio = preloadedSounds.get(soundPath)!;
			// Reset to start in case it was played before
			audio.currentTime = 0;
		} else {
			// Fallback: create new Audio instance if not preloaded
			console.warn(`Sound ${soundPath} was not preloaded, creating new Audio instance`);
			audio = new Audio(soundPath);
		}

		await audio.play();
	} catch (error) {
		console.warn(`Could not play sound ${soundPath}:`, error);
	}
}
