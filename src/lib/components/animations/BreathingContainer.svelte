<script lang="ts">
	import { onMount } from 'svelte';
	import { breathingDuration, organicTiming } from '$lib/utils/randomness';

	let { children } = $props();
	let containerElement: HTMLElement;

	onMount(() => {
		if (containerElement) {
			// Set up breathing animation with organic timing
			const updateBreathing = () => {
				const duration = breathingDuration(6000);
				const timing = organicTiming();

				containerElement.style.setProperty('--breathing-duration', `${duration}ms`);
				containerElement.style.setProperty('--breathing-timing', timing);

				setTimeout(updateBreathing, duration);
			};

			updateBreathing();
		}
	});
</script>

<div bind:this={containerElement} class="breathing-container">
	{@render children()}
</div>

<style>
	.breathing-container {
		animation: breathing var(--breathing-duration, 6000ms) var(--breathing-timing, linear) infinite
			alternate;
	}

	@keyframes breathing {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(1.03);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.breathing-container {
			animation: none;
		}
	}
</style>
