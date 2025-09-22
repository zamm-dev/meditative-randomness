<script lang="ts">
	import { onMount } from 'svelte';
	import { breathingDuration } from '$lib/utils/randomness';

	let { children } = $props();
	let containerElement: HTMLElement;

	onMount(() => {
		if (containerElement) {
			// Set a gentle breathing duration once, avoid constant changes that cause stutters
			const duration = breathingDuration(7000);
			containerElement.style.setProperty('--breathing-duration', `${duration}ms`);
		}
	});
</script>

<div bind:this={containerElement} class="breathing-container">
	{@render children()}
</div>

<style>
	.breathing-container {
		animation: breathing var(--breathing-duration, 6000ms) ease-in-out infinite alternate;
		will-change: transform;
	}

	@keyframes breathing {
		0% {
			transform: scale3d(1, 1, 1);
		}
		100% {
			transform: scale3d(1.02, 1.02, 1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.breathing-container {
			animation: none;
		}
	}
</style>
