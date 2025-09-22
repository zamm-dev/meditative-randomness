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
				duration: breathingDuration(20_000),
				size: 20 + Math.random() * 20
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
		--drift-distance: 40px;
		position: absolute;
		background: #b8d8e8;
		border-radius: 50%;
		animation: drift infinite ease-in-out alternate;
	}

	@keyframes drift {
		0% {
			transform: translate3d(0, 0) scale(1);
			opacity: var(--particle-opacity, 0.4);
		}
		25% {
			transform: translate3d(10px, calc(var(--drift-distance) * -0.75), 0) scale(1.2);
		}
		50% {
			transform: translate3d(-5px, calc(var(--drift-distance) * -1.25), 0) scale(0.7);
			opacity: calc(var(--particle-opacity, 0.4) * 0.8);
		}
		75% {
			transform: translate3d(15px, calc(var(--drift-distance) * -0.5), 0) scale(1.1);
		}
		100% {
			transform: translate3d(-8px, calc(var(--drift-distance) * 0.5), 0) scale(0.9);
			opacity: var(--particle-opacity, 0.4);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.particle {
			animation: none;
		}
	}
</style>
