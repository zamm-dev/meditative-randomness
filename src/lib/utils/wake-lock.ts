/**
 * Wake Lock API utilities for preventing device sleep during meditation sessions
 */

let wakeLock: WakeLockSentinel | null = null;

/**
 * Check if the Screen Wake Lock API is supported in the current browser
 */
export function isWakeLockSupported(): boolean {
	return (
		typeof navigator !== 'undefined' && 'wakeLock' in navigator && 'request' in navigator.wakeLock
	);
}

/**
 * Request a screen wake lock to prevent the device from sleeping
 * Returns true if successful, false if failed or not supported
 */
export async function requestWakeLock(): Promise<boolean> {
	if (!isWakeLockSupported()) {
		console.info('Wake Lock API not supported in this browser');
		return false;
	}

	try {
		wakeLock = await navigator.wakeLock.request('screen');
		console.debug('Screen wake lock acquired');

		// Listen for wake lock release (e.g., when tab becomes hidden)
		wakeLock.addEventListener('release', () => {
			console.debug('Screen wake lock released');
		});

		return true;
	} catch (error) {
		console.warn('Failed to acquire wake lock:', error);
		return false;
	}
}

/**
 * Release the current wake lock if one exists
 */
export async function releaseWakeLock(): Promise<void> {
	if (wakeLock) {
		try {
			await wakeLock.release();
			wakeLock = null;
			console.debug('Screen wake lock manually released');
		} catch (error) {
			console.warn('Failed to release wake lock:', error);
		}
	}
}

/**
 * Check if a wake lock is currently active
 */
export function isWakeLockActive(): boolean {
	return wakeLock !== null && !wakeLock.released;
}
