<script lang="ts">
	import { onMount } from 'svelte';
	import { staggeredDelay, subtleOpacity, breathingDuration } from '$lib/utils/randomness';

	let particles = $state<
		Array<{
			id: number;
			x: number;
			y: number;
			opacity: number;
			delay: number;
			duration: number;
			size: number;
		}>
	>([]);

	let { count = 12 } = $props();

	onMount(() => {
		// Generate particles with organic properties
		particles = Array.from({ length: count }, (_, i) => {
			return {
				id: i,
				x: Math.random() * 100,
				y: Math.random() * 100,
				opacity: subtleOpacity(0.4, 0.3),
				delay: staggeredDelay(3000),
				duration: breathingDuration(8000),
				size: 2 + Math.random() * 4
			};
		});
	});
</script>

<div class="particle-container">
	{#each particles as particle (particle.id)}
		<div
			class="particle"
			style="
        left: {particle.x}%;
        top: {particle.y}%;
        opacity: {particle.opacity};
        animation-delay: {particle.delay}ms;
        animation-duration: {particle.duration}ms;
        width: {particle.size}px;
        height: {particle.size}px;
      "
		></div>
	{/each}
</div>

<style>
	.particle-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: -1;
	}

	.particle {
		position: absolute;
		background: radial-gradient(circle, var(--color-blue-light), transparent);
		border-radius: 50%;
		animation: drift infinite ease-in-out alternate;
	}

	@keyframes drift {
		0% {
			transform: translate(0, 0) scale(1);
			opacity: var(--particle-opacity, 0.4);
		}
		25% {
			transform: translate(10px, -15px) scale(1.1);
		}
		50% {
			transform: translate(-5px, -25px) scale(0.9);
			opacity: calc(var(--particle-opacity, 0.4) * 0.7);
		}
		75% {
			transform: translate(15px, -10px) scale(1.05);
		}
		100% {
			transform: translate(-8px, 5px) scale(0.95);
			opacity: var(--particle-opacity, 0.4);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.particle {
			animation: none;
		}
	}
</style>
