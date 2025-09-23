// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// Wake Lock API types
	interface WakeLockSentinel extends EventTarget {
		readonly released: boolean;
		readonly type: string;
		release(): Promise<void>;
	}

	interface WakeLock {
		request(type: 'screen'): Promise<WakeLockSentinel>;
	}

	interface Navigator {
		readonly wakeLock: WakeLock;
	}
}

export {};
