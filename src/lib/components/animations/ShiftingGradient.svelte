<script lang="ts">
	import { onMount } from 'svelte';
	import { colorTemperature, breathingDuration } from '$lib/utils/randomness';

	let gradientElement: HTMLElement;
	let currentTemperature = $state('neutral');

	onMount(() => {
		// Set initial color temperature
		currentTemperature = colorTemperature();

		// Update color temperature periodically with breathing-like rhythm
		const updateTemperature = () => {
			currentTemperature = colorTemperature();
			setTimeout(updateTemperature, breathingDuration(15000));
		};

		setTimeout(updateTemperature, breathingDuration(5000));
	});

	$effect(() => {
		if (gradientElement) {
			gradientElement.style.setProperty('--temperature', currentTemperature);
		}
	});
</script>

<div
	bind:this={gradientElement}
	class="shifting-gradient"
	data-temperature={currentTemperature}
></div>

<style>
	.shifting-gradient {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -2;
		transition: background var(--duration-slower) var(--ease-in-out);
	}

	.shifting-gradient[data-temperature='warm'] {
		background: linear-gradient(
			135deg,
			var(--color-neutral-lightest) 0%,
			#f0e6d8 25%,
			var(--color-green-light) 60%,
			var(--color-blue-light) 100%
		);
	}

	.shifting-gradient[data-temperature='cool'] {
		background: linear-gradient(
			135deg,
			var(--color-blue-light) 0%,
			#e8f2f8 25%,
			var(--color-neutral-lightest) 60%,
			var(--color-green-light) 100%
		);
	}

	.shifting-gradient[data-temperature='neutral'] {
		background: var(--gradient-secondary);
	}

	@media (prefers-reduced-motion: reduce) {
		.shifting-gradient {
			transition: none;
			background: var(--gradient-secondary);
		}
	}
</style>
