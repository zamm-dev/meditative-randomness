<script lang="ts">
	import MeditationTimer from '$lib/components/timer/MeditationTimer.svelte';
	import { onMount } from 'svelte';
	import { staggeredDelay } from '$lib/utils/randomness';

	let titleElement: HTMLElement;
	let subtitleElement: HTMLElement;
	let cardElements: HTMLElement[] = [];

	onMount(() => {
		// Add gentle staggered entrance animations
		if (titleElement) {
			titleElement.style.animationDelay = `${staggeredDelay(500)}ms`;
		}
		if (subtitleElement) {
			subtitleElement.style.animationDelay = `${staggeredDelay(800)}ms`;
		}

		cardElements.forEach((el, index) => {
			if (el) {
				el.style.animationDelay = `${staggeredDelay(1200) + index * 200}ms`;
			}
		});
	});
</script>

<svelte:head>
	<title>Meditative Randomness</title>
	<meta
		name="description"
		content="A peaceful exploration of randomness and meditation - where stillness meets gentle surprise"
	/>
</svelte:head>

<div class="page-container">
	<header class="hero-section">
		<h1 bind:this={titleElement} class="main-title animate-in">Meditative Randomness</h1>
		<p bind:this={subtitleElement} class="subtitle animate-in">
			Open your practice up to the random influences of the universe<br />
			Let Reality also have a say in how long you meditate for
		</p>
	</header>

	<section class="timer-section">
		<MeditationTimer />
	</section>
</div>

<style>
	.page-container {
		padding: var(--space-8) var(--space-4);
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.hero-section {
		text-align: center;
		padding: var(--space-20) 0 var(--space-8);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-6);
	}

	.timer-section {
		width: 100%;
		display: flex;
		justify-content: center;
		margin: 0;
	}

	.main-title {
		font-size: var(--text-4xl);
		font-weight: var(--font-weight-light);
		color: var(--color-blue-deep);
		letter-spacing: -0.02em;
		margin: 0;
		text-shadow: 0 2px 8px rgba(127, 179, 211, 0.2);
	}

	.subtitle {
		font-size: var(--text-xl);
		color: var(--color-neutral-dark);
		font-weight: var(--font-weight-normal);
		max-width: 600px;
		margin: 0;
		opacity: 0.9;
	}

	/* Entrance animations */
	.animate-in {
		opacity: 0;
		transform: translateY(20px);
		animation: fadeInUp var(--duration-slow) var(--ease-out) forwards;
	}

	@keyframes fadeInUp {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.page-container {
			padding: var(--space-6) var(--space-3);
			gap: var(--space-12);
		}

		.hero-section {
			padding: var(--space-12) 0;
		}

		.main-title {
			font-size: var(--text-3xl);
		}

		.subtitle {
			font-size: var(--text-lg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.animate-in {
			opacity: 1;
			transform: none;
			animation: none;
		}
	}
</style>
