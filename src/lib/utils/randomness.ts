/**
 * Utilities for controlled, meditative randomness
 */

/**
 * Generate a subtle random variation within a controlled range
 */
export function gentleVariation(base: number, variance: number = 0.1): number {
	const variation = (Math.random() - 0.5) * 2 * variance;
	return base + base * variation;
}

/**
 * Create a breathing-like rhythm with gentle irregularity
 */
export function breathingDuration(baseDuration: number = 4000): number {
	return gentleVariation(baseDuration, 0.15);
}

/**
 * Generate subtle position variations for organic movement
 */
export function organicPosition(range: number = 10): { x: number; y: number } {
	return {
		x: (Math.random() - 0.5) * range,
		y: (Math.random() - 0.5) * range
	};
}

/**
 * Random delay for staggered animations
 */
export function staggeredDelay(maxDelay: number = 1000): number {
	return Math.random() * maxDelay;
}

/**
 * Generate a gentle opacity variation
 */
export function subtleOpacity(baseOpacity: number = 0.7, variation: number = 0.2): number {
	const opacity = gentleVariation(baseOpacity, variation);
	return Math.max(0.1, Math.min(1, opacity));
}

/**
 * Color temperature shift based on time and randomness
 */
export function colorTemperature(): 'warm' | 'cool' | 'neutral' {
	const hour = new Date().getHours();
	const random = Math.random();

	// Warmer in morning/evening, cooler midday, with gentle randomness
	if (hour < 10 || hour > 18) {
		return random > 0.3 ? 'warm' : 'neutral';
	} else if (hour >= 10 && hour <= 14) {
		return random > 0.3 ? 'cool' : 'neutral';
	} else {
		return random > 0.6 ? (random > 0.8 ? 'warm' : 'cool') : 'neutral';
	}
}

/**
 * Generate organic timing for animations
 */
export function organicTiming(): string {
	const timings = [
		'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Gentle bounce
		'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Ease out
		'cubic-bezier(0.4, 0, 0.2, 1)', // Ease in-out
		'cubic-bezier(0.175, 0.885, 0.32, 1.275)' // Soft spring
	];

	return timings[Math.floor(Math.random() * timings.length)];
}
