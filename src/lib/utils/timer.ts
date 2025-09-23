/**
 * Timer utilities for meditation sessions
 */

export interface TimeInput {
	minutes: number;
	seconds: number;
}

/**
 * Parse time string in MM:SS format
 */
export function parseTimeString(timeStr: string): TimeInput | null {
	if (!timeStr) return null;

	const parts = timeStr.split(':');
	if (parts.length !== 2) return null;

	const minutes = parseInt(parts[0], 10);
	const seconds = parseInt(parts[1], 10);

	if (isNaN(minutes) || isNaN(seconds) || minutes < 0 || seconds < 0 || seconds >= 60) {
		return null;
	}

	return { minutes, seconds };
}

/**
 * Convert TimeInput to total seconds
 */
export function timeToSeconds(time: TimeInput): number {
	return time.minutes * 60 + time.seconds;
}

/**
 * Convert seconds to MM:SS format
 */
export function secondsToTimeString(totalSeconds: number): string {
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Calculate average time between min and max
 */
export function calculateAverage(minTime: TimeInput, maxTime: TimeInput): TimeInput {
	const minSeconds = timeToSeconds(minTime);
	const maxSeconds = timeToSeconds(maxTime);
	const avgSeconds = Math.floor((minSeconds + maxSeconds) / 2);

	return {
		minutes: Math.floor(avgSeconds / 60),
		seconds: avgSeconds % 60
	};
}

/**
 * Generate random duration between min and max (inclusive)
 */
export function generateRandomDuration(minTime: TimeInput, maxTime: TimeInput): number {
	const minSeconds = timeToSeconds(minTime);
	const maxSeconds = timeToSeconds(maxTime);

	return Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds;
}

/**
 * Validate that max time is greater than min time
 */
export function validateTimeRange(minTime: TimeInput, maxTime: TimeInput): boolean {
	return timeToSeconds(maxTime) >= timeToSeconds(minTime);
}

/**
 * Format time input string with colon separator
 */
export function formatTimeInput(value: string): string {
	// Remove non-digits
	const digits = value.replace(/\D/g, '');

	if (digits.length === 0) return '';
	if (digits.length === 1) return digits;
	if (digits.length === 2) return digits;
	if (digits.length === 3) return `${digits[0]}:${digits.slice(1)}`;
	if (digits.length === 4) return `${digits.slice(0, 2)}:${digits.slice(2)}`;

	// Limit to 4 digits max (99:59)
	return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
}
