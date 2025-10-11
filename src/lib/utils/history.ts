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

		const parsed = JSON.parse(storedData);
		if (!Array.isArray(parsed)) {
			console.warn('Unexpected meditation history payload shape.');
			return [];
		}

		return parsed as MeditationRecord[];
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

/**
 * Export format for meditation history
 */
export interface ExportData {
	version: string;
	exportDate: string;
	records: MeditationRecord[];
}

/**
 * Validation result for import operations
 */
export interface ImportResult {
	success: boolean;
	importedCount: number;
	errorMessage?: string;
}

/**
 * Export meditation history to JSON
 */
export function exportMeditationHistory(): ExportData {
	const records = getMeditationHistory();
	return {
		version: '1.0',
		exportDate: new Date().toISOString(),
		records
	};
}

/**
 * Generate filename for export with current date
 */
export function generateExportFilename(): string {
	const date = new Date();
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `meditation-history-${year}-${month}-${day}.json`;
}

/**
 * Validate a meditation record
 */
function isValidMeditationRecord(record: unknown): record is MeditationRecord {
	if (typeof record !== 'object' || record === null) return false;

	const r = record as Record<string, unknown>;

	// Check id
	if (typeof r.id !== 'string' || r.id.trim() === '') return false;

	// Check endTime - must be valid ISO 8601
	if (typeof r.endTime !== 'string') return false;
	const date = new Date(r.endTime);
	if (isNaN(date.getTime())) return false;

	// Check duration - must be positive number
	if (typeof r.duration !== 'number' || r.duration <= 0 || !Number.isInteger(r.duration))
		return false;

	return true;
}

/**
 * Import meditation history from JSON data
 * Returns result with success status and count of imported records
 */
export function importMeditationHistory(jsonData: string): ImportResult {
	try {
		// Parse JSON
		const parsed = JSON.parse(jsonData);

		// Validate structure
		if (typeof parsed !== 'object' || parsed === null) {
			return {
				success: false,
				importedCount: 0,
				errorMessage: 'The file does not contain valid meditation history data'
			};
		}

		if (!Array.isArray(parsed.records)) {
			return {
				success: false,
				importedCount: 0,
				errorMessage: 'The file does not contain valid meditation history data'
			};
		}

		// Get existing records
		const existingRecords = getMeditationHistory();
		const existingIds = new Set(existingRecords.map((r) => r.id));

		// Validate and filter new records
		const newRecords: MeditationRecord[] = [];
		for (const record of parsed.records) {
			if (!isValidMeditationRecord(record)) {
				console.warn('Skipping invalid record during import:', record);
				continue;
			}

			// Skip duplicates
			if (existingIds.has(record.id)) {
				continue;
			}

			newRecords.push(record);
		}

		// Merge and save
		if (newRecords.length > 0) {
			const allRecords = [...existingRecords, ...newRecords];
			// Sort by end time, newest first
			allRecords.sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime());
			saveMeditationHistory(allRecords);
		}

		return {
			success: true,
			importedCount: newRecords.length
		};
	} catch (error) {
		if (error instanceof SyntaxError) {
			return {
				success: false,
				importedCount: 0,
				errorMessage: 'The selected file is not a valid JSON file'
			};
		}

		return {
			success: false,
			importedCount: 0,
			errorMessage: 'Failed to read the selected file'
		};
	}
}
