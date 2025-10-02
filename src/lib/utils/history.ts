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
const HISTORY_COOKIE_NAME = HISTORY_STORAGE_KEY;
const COOKIE_EXPIRY_DAYS = 365; // 1 year
const MAX_COOKIE_SIZE = 4096;

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

function readHistoryFromCookie(): MeditationRecord[] {
	if (typeof globalThis.document === 'undefined') return [];

	try {
		const cookies = globalThis.document.cookie.split(';');
		const historyCookie = cookies
			.find((cookie) => cookie.trim().startsWith(`${HISTORY_COOKIE_NAME}=`))
			?.split('=')[1];

		if (!historyCookie) return [];

		const decodedData = decodeURIComponent(historyCookie);
		return normalizeRecords(JSON.parse(decodedData));
	} catch (error) {
		console.warn('Failed to read meditation history from cookie:', error);
		return [];
	}
}

function clearHistoryCookie() {
	if (typeof globalThis.document === 'undefined') return;

	globalThis.document.cookie = `${HISTORY_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict`;
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

function migrateCookieToLocalStorage(storage: Storage) {
	const existingStorage = storage.getItem(HISTORY_STORAGE_KEY);
	if (existingStorage) return; // Already migrated

	const cookieRecords = readHistoryFromCookie();
	if (cookieRecords.length === 0) return;

	try {
		storage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(cookieRecords));
		clearHistoryCookie();
	} catch (error) {
		console.warn('Failed to migrate meditation history to localStorage:', error);
	}
}

/**
 * Get meditation history from localStorage (with cookie migration fallback)
 */
export function getMeditationHistory(): MeditationRecord[] {
	if (typeof globalThis.document === 'undefined') return []; // SSR safety

	const storage = getStorage();
	if (storage) {
		migrateCookieToLocalStorage(storage);

		try {
			const storedData = storage.getItem(HISTORY_STORAGE_KEY);
			if (storedData) {
				const parsed = normalizeRecords(JSON.parse(storedData));
				if (parsed.length > 0) {
					return parsed;
				}
			}
		} catch (error) {
			console.warn('Failed to read meditation history from localStorage:', error);
		}
	}

	return readHistoryFromCookie();
}

function saveHistoryToCookie(records: MeditationRecord[]): void {
	if (typeof globalThis.document === 'undefined') return;

	try {
		const data = JSON.stringify(records);
		const encodedData = encodeURIComponent(data);

		if (encodedData.length > MAX_COOKIE_SIZE) {
			console.warn('Skipping meditation history cookie update because it exceeds the size limit.');
			return;
		}

		const expiryDate = new Date();
		expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS);

		globalThis.document.cookie = `${HISTORY_COOKIE_NAME}=${encodedData}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
	} catch (error) {
		console.warn('Failed to save meditation history cookie:', error);
	}
}

/**
 * Save meditation history to storage
 */
function saveMeditationHistory(records: MeditationRecord[]): void {
	if (typeof globalThis.document === 'undefined') return; // SSR safety

	const storage = getStorage();
	if (storage) {
		try {
			storage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(records));
			clearHistoryCookie();
			return;
		} catch (error) {
			console.warn('Failed to save meditation history to localStorage:', error);
		}
	}

	saveHistoryToCookie(records);
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
