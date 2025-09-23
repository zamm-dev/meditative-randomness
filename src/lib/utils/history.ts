/**
 * Meditation history utilities for tracking completed sessions
 */

export interface MeditationRecord {
	id: string;
	endTime: string; // ISO 8601 string with timezone
	duration: number; // Duration in seconds
}

const HISTORY_COOKIE_NAME = 'meditation_history';
const COOKIE_EXPIRY_DAYS = 365; // 1 year

/**
 * Generate a unique ID for meditation records
 */
function generateId(): string {
	return globalThis.crypto.randomUUID();
}

/**
 * Get meditation history from browser cookies
 */
export function getMeditationHistory(): MeditationRecord[] {
	if (typeof globalThis.document === 'undefined') return []; // SSR safety

	try {
		const cookies = globalThis.document.cookie.split(';');
		const historyCookie = cookies
			.find((cookie) => cookie.trim().startsWith(`${HISTORY_COOKIE_NAME}=`))
			?.split('=')[1];

		if (!historyCookie) return [];

		const decodedData = decodeURIComponent(historyCookie);
		const records = JSON.parse(decodedData);

		// Validate records structure
		if (!Array.isArray(records)) return [];

		return records.filter(
			(record): record is MeditationRecord =>
				record &&
				typeof record.id === 'string' &&
				typeof record.endTime === 'string' &&
				typeof record.duration === 'number' &&
				record.duration > 0
		);
	} catch (error) {
		console.warn('Failed to parse meditation history:', error);
		return [];
	}
}

/**
 * Save meditation history to browser cookies
 */
function saveMeditationHistory(records: MeditationRecord[]): void {
	if (typeof globalThis.document === 'undefined') return; // SSR safety

	try {
		const data = JSON.stringify(records);
		const encodedData = encodeURIComponent(data);

		// Set cookie with expiration
		const expiryDate = new Date();
		expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS);

		globalThis.document.cookie = `${HISTORY_COOKIE_NAME}=${encodedData}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
	} catch (error) {
		console.warn('Failed to save meditation history:', error);
	}
}

/**
 * Save a new meditation record
 */
export function saveMeditationRecord(duration: number): void {
	const record: MeditationRecord = {
		id: generateId(),
		endTime: new Date().toISOString(),
		duration
	};

	const existingRecords = getMeditationHistory();
	const updatedRecords = [record, ...existingRecords]; // Add new record at the beginning

	saveMeditationHistory(updatedRecords);
}

/**
 * Delete a meditation record by ID
 */
export function deleteMeditationRecord(id: string): void {
	const existingRecords = getMeditationHistory();
	const filteredRecords = existingRecords.filter((record) => record.id !== id);

	saveMeditationHistory(filteredRecords);
}

/**
 * Format end time for display
 */
export function formatEndTime(endTime: string): string {
	try {
		const date = new Date(endTime);
		return date.toLocaleString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			timeZoneName: 'short'
		});
	} catch (error) {
		console.warn('Failed to format end time:', error);
		return 'Invalid date';
	}
}

/**
 * Format duration for display
 */
export function formatDuration(seconds: number): string {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;

	if (minutes === 0) {
		return `${remainingSeconds}s`;
	}

	if (remainingSeconds === 0) {
		return `${minutes}m`;
	}

	return `${minutes}m ${remainingSeconds}s`;
}
