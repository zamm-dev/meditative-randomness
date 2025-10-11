<script lang="ts">
	import { onDestroy } from 'svelte';
	import MeditativeCard from '$lib/components/ui/MeditativeCard.svelte';
	import MeditationHistory from '$lib/components/timer/MeditationHistory.svelte';
	import {
		parseTimeString,
		formatTimeInput,
		calculateAverage,
		generateRandomDuration,
		validateTimeRange,
		secondsToTimeString
	} from '$lib/utils/timer';
	import { requestWakeLock, releaseWakeLock } from '$lib/utils/wake-lock';
	import { saveMeditationRecord } from '$lib/utils/history';

	let minTimeInput = $state('5:00');
	let maxTimeInput = $state('10:00');
	let timerState = $state<'idle' | 'running' | 'completed'>('idle');
	let elapsedSeconds = $state(0);
	let targetDuration = $state(0);

	let intervalId: number | null = null;
	let audioContext: AudioContext | null = null;

	// Reactive calculations
	let minTime = $derived(parseTimeString(minTimeInput));
	let maxTime = $derived(parseTimeString(maxTimeInput));
	let isValidRange = $derived(minTime && maxTime && validateTimeRange(minTime, maxTime));
	let averageTime = $derived(
		minTime && maxTime && isValidRange ? calculateAverage(minTime, maxTime) : null
	);

	function formatInput(value: string): string {
		return formatTimeInput(value);
	}

	function handleMinTimeInput(event: Event) {
		const target = event.target as HTMLInputElement;
		minTimeInput = formatInput(target.value);
	}

	function handleMaxTimeInput(event: Event) {
		const target = event.target as HTMLInputElement;
		maxTimeInput = formatInput(target.value);
	}

	function startTimer() {
		if (!minTime || !maxTime || !isValidRange) return;

		targetDuration = generateRandomDuration(minTime, maxTime);
		elapsedSeconds = 0;
		timerState = 'running';

		// Request wake lock to prevent device sleep during meditation
		// Don't await to avoid blocking the UI
		requestWakeLock();

		intervalId = setInterval(() => {
			elapsedSeconds++;

			if (elapsedSeconds >= targetDuration) {
				completeTimer();
			}
		}, 1000);
	}

	function stopTimer() {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}

		// Release wake lock when timer is stopped
		// Don't await to avoid blocking the UI
		releaseWakeLock();

		timerState = 'idle';
		elapsedSeconds = 0;
	}

	async function completeTimer() {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}

		// Release wake lock when timer completes
		// Don't await to avoid blocking the state change
		releaseWakeLock();

		// Save meditation record to history
		saveMeditationRecord(elapsedSeconds);

		timerState = 'completed';

		// Play completion sound
		await playCompletionSound();
	}

	async function playCompletionSound() {
		try {
			if (!audioContext) {
				audioContext = new AudioContext();
			}

			// Create a gentle meditation bell sound using Web Audio API
			const oscillator = audioContext.createOscillator();
			const gainNode = audioContext.createGain();

			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);

			oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
			oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 2);

			gainNode.gain.setValueAtTime(0, audioContext.currentTime);
			gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
			gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);

			oscillator.start(audioContext.currentTime);
			oscillator.stop(audioContext.currentTime + 2);
		} catch (error) {
			console.warn('Could not play completion sound:', error);
		}
	}

	function resetTimer() {
		timerState = 'idle';
		elapsedSeconds = 0;
	}

	onDestroy(() => {
		if (intervalId) {
			clearInterval(intervalId);
		}
		if (audioContext) {
			audioContext.close();
		}
		// Ensure wake lock is released on component cleanup
		releaseWakeLock();
	});
</script>

<div class="timer-container">
	<MeditativeCard variant="primary" elevation="deep">
		{#if timerState === 'idle'}
			<div class="timer-setup">
				<div class="timer-inputs">
					<div class="input-group">
						<label for="min-time">Minimum Time</label>
						<input
							id="min-time"
							type="text"
							value={minTimeInput}
							onblur={handleMinTimeInput}
							oninput={handleMinTimeInput}
							placeholder="5:00"
							class="time-input"
						/>
					</div>

					<div class="input-group">
						<label for="max-time">Maximum Time</label>
						<input
							id="max-time"
							type="text"
							value={maxTimeInput}
							onblur={handleMaxTimeInput}
							oninput={handleMaxTimeInput}
							placeholder="10:00"
							class="time-input"
						/>
					</div>
				</div>

				{#if averageTime}
					<div class="average-display">
						<span class="average-label">Expected average:</span>
						<span class="average-time"
							>{averageTime.minutes}:{averageTime.seconds.toString().padStart(2, '0')}</span
						>
					</div>
				{/if}

				<button onclick={startTimer} disabled={!isValidRange} class="timer-button start-button">
					Begin Practice
				</button>

				{#if !isValidRange && minTime && maxTime}
					<div class="error-message">Maximum time can't be less than minimum time</div>
				{/if}

				<MeditationHistory />
			</div>
		{:else if timerState === 'running'}
			<div class="timer-active">
				<div class="elapsed-time">{secondsToTimeString(elapsedSeconds)}</div>
				{#if averageTime}
					<div class="expected-average">
						Expected average: {averageTime.minutes}:{averageTime.seconds
							.toString()
							.padStart(2, '0')}
					</div>
				{/if}
				<button onclick={stopTimer} class="timer-button stop-button"> End Practice </button>
			</div>
		{:else if timerState === 'completed'}
			<div class="timer-completed">
				<div class="completion-title">Practice Complete</div>
				<div class="completion-time">Total time: {secondsToTimeString(elapsedSeconds)}</div>
				<button onclick={resetTimer} class="timer-button reset-button"> New Practice </button>

				<MeditationHistory />
			</div>
		{/if}
	</MeditativeCard>
</div>

<style>
	.timer-container {
		max-width: 600px;
		margin: 0 auto;
		padding: var(--space-4);
	}

	.timer-setup {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
		text-align: center;
		width: 100%;
		animation: fadeIn var(--duration-slow) var(--ease-out);
	}

	.timer-inputs {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-4);
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.input-group label {
		font-size: var(--text-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-green-deep);
	}

	.time-input {
		padding: var(--space-3);
		border: 1px solid rgba(168, 198, 134, 0.3);
		border-radius: var(--radius-md);
		background: rgba(255, 255, 255, 0.8);
		font-size: var(--text-lg);
		font-family: var(--font-family-primary);
		text-align: center;
		transition: all var(--duration-normal) var(--ease-out);
		width: 100%;
		min-width: 0; /* Allows input to shrink below its default size */
	}

	.time-input:focus {
		outline: none;
		border-color: var(--color-green-primary);
		background: rgba(255, 255, 255, 0.95);
		box-shadow: 0 0 0 3px rgba(168, 198, 134, 0.2);
	}

	.average-display {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-1);
	}

	.average-label {
		font-size: var(--text-sm);
		color: var(--color-neutral-dark);
		opacity: 0.8;
	}

	.average-time {
		font-size: var(--text-xl);
		font-weight: var(--font-weight-medium);
		color: var(--color-blue-deep);
		font-variant-numeric: tabular-nums;
	}

	.timer-active {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-6);
		text-align: center;
		width: 100%;
		animation: fadeIn var(--duration-slow) var(--ease-out);
	}

	.elapsed-time {
		font-size: 10rem;
		font-weight: var(--font-weight-light);
		color: var(--color-blue-deep);
		font-variant-numeric: tabular-nums;
	}

	.expected-average {
		font-size: var(--text-base);
		color: var(--color-neutral-dark);
		opacity: 0.8;
		font-variant-numeric: tabular-nums;
	}

	.timer-completed {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
		text-align: center;
		width: 100%;
		animation: fadeIn var(--duration-slow) var(--ease-out);
	}

	.completion-title {
		font-size: var(--text-2xl);
		font-weight: var(--font-weight-light);
		color: var(--color-green-deep);
	}

	.completion-time {
		font-size: var(--text-lg);
		color: var(--color-neutral-dark);
		font-variant-numeric: tabular-nums;
	}

	.timer-button {
		padding: var(--space-4) var(--space-8);
		border: none;
		border-radius: var(--radius-lg);
		font-size: var(--text-lg);
		font-weight: var(--font-weight-medium);
		cursor: pointer;
		transition: all var(--duration-normal) var(--ease-out);
		min-width: 160px;
	}

	.start-button {
		background: linear-gradient(
			135deg,
			var(--color-green-primary) 0%,
			var(--color-green-deep) 100%
		);
		color: white;
		box-shadow: var(--shadow-medium);
	}

	.start-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: var(--shadow-deep);
	}

	.start-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}

	.stop-button {
		background: linear-gradient(
			135deg,
			var(--color-neutral-medium) 0%,
			var(--color-neutral-dark) 100%
		);
		color: white;
		box-shadow: var(--shadow-medium);
	}

	.stop-button:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-deep);
	}

	.reset-button {
		background: linear-gradient(135deg, var(--color-blue-primary) 0%, var(--color-blue-deep) 100%);
		color: white;
		box-shadow: var(--shadow-medium);
	}

	.reset-button:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-deep);
	}

	.error-message {
		background: rgba(220, 53, 69, 0.1);
		color: #dc3545;
		padding: var(--space-3);
		border-radius: var(--radius-md);
		text-align: center;
		font-size: var(--text-sm);
		border: 1px solid rgba(220, 53, 69, 0.2);
		margin-top: var(--space-2);
	}

	@media (max-width: 768px) {
		.timer-inputs {
			grid-template-columns: 1fr;
		}

		.timer-container {
			padding: var(--space-3);
		}

		.elapsed-time {
			font-size: var(--text-3xl);
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.timer-setup,
		.timer-active,
		.timer-completed {
			animation: none;
		}
		.timer-button {
			transition: none;
		}
		.timer-button:hover {
			transform: none;
		}
	}
</style>
