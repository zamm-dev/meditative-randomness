import type { Storage } from '$lib/types/browser';

/**
 * Meditation history utilities for tracking completed sessions
 */

export interface MeditationRecord {
	id: string;
	endTime: string; // ISO 8601 string with timezone
	duration: number; // Duration in seconds
}

const HISTORY_STORAGE_KEY = 'meditation_history';

/**
 * Generate a unique ID for meditation records
 */
function generateId(): string {
	return globalThis.crypto.randomUUID();
}

function isValidRecord(record: unknown): record is MeditationRecord {
	return (
		record !== null &&
		typeof record === 'object' &&
		typeof (record as MeditationRecord).id === 'string' &&
		typeof (record as MeditationRecord).endTime === 'string' &&
		typeof (record as MeditationRecord).duration === 'number' &&
		(record as MeditationRecord).duration > 0
	);
}

function normalizeRecords(data: unknown): MeditationRecord[] {
	if (!Array.isArray(data)) return [];
	return data.filter(isValidRecord);
}

function getStorage(): Storage | null {
	if (typeof globalThis.localStorage === 'undefined') return null;

	try {
		return globalThis.localStorage;
	} catch (error) {
		console.warn('Unable to access localStorage for meditation history:', error);
		return null;
	}
}

/**
 * Get meditation history from localStorage
 */
export function getMeditationHistory(): MeditationRecord[] {
	if (typeof globalThis.document === 'undefined') return []; // SSR safety

	const storage = getStorage();
	if (!storage) return [];

	try {
		const storedData = storage.getItem(HISTORY_STORAGE_KEY);
		if (!storedData) return [];

		return normalizeRecords(JSON.parse(storedData));
	} catch (error) {
		console.warn('Failed to read meditation history from localStorage:', error);
		return [];
	}
}

/**
 * Save meditation history to storage
 */
function saveMeditationHistory(records: MeditationRecord[]): void {
	if (typeof globalThis.document === 'undefined') return; // SSR safety

	const storage = getStorage();
	if (!storage) return;

	try {
		storage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(records));
	} catch (error) {
		console.warn('Failed to save meditation history to localStorage:', error);
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
