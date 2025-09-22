<script lang="ts">
	import MeditativeCard from '$lib/components/ui/MeditativeCard.svelte';
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
			Where stillness meets gentle surprise
		</p>
	</header>

	<section class="content-section">
		<div class="cards-grid">
			<MeditativeCard variant="primary" elevation="medium">
				<div bind:this={cardElements[0]} class="card-content animate-in">
					<h2>Mindful Moments</h2>
					<p>
						Discover the beauty in unexpected moments. Let randomness guide you to new perspectives
						while maintaining the peace of mindful awareness.
					</p>
				</div>
			</MeditativeCard>

			<MeditativeCard variant="gentle" elevation="soft">
				<div bind:this={cardElements[1]} class="card-content animate-in">
					<h2>Flowing Uncertainty</h2>
					<p>
						Embrace the gentle dance between intention and surrender. Find serenity in not knowing
						what comes next, while staying grounded in the present.
					</p>
				</div>
			</MeditativeCard>

			<MeditativeCard variant="default" elevation="deep">
				<div bind:this={cardElements[2]} class="card-content animate-in">
					<h2>Synchronistic Grace</h2>
					<p>
						When we release the need to control, we open ourselves to the wisdom of spontaneity.
						Every random moment becomes a teacher, every surprise a gift.
					</p>
				</div>
			</MeditativeCard>
		</div>
	</section>

	<footer class="page-footer">
		<p class="footer-text">A quiet companion for your journey between certainty and wonder</p>
	</footer>
</div>

<style>
	.page-container {
		padding: var(--space-8) var(--space-4);
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: var(--space-16);
		min-height: 100vh;
	}

	.hero-section {
		text-align: center;
		padding: var(--space-20) 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-6);
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

	.content-section {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.cards-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--space-8);
		width: 100%;
		max-width: 1000px;
	}

	.card-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.card-content h2 {
		font-size: var(--text-2xl);
		font-weight: var(--font-weight-light);
		color: var(--color-green-deep);
		margin: 0;
	}

	.card-content p {
		font-size: var(--text-base);
		line-height: var(--leading-relaxed);
		color: var(--color-neutral-dark);
		margin: 0;
	}

	.page-footer {
		text-align: center;
		padding: var(--space-12) 0;
		border-top: 1px solid rgba(255, 255, 255, 0.2);
		margin-top: var(--space-8);
	}

	.footer-text {
		font-size: var(--text-sm);
		color: var(--color-neutral-dark);
		opacity: 0.7;
		font-style: italic;
		margin: 0;
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

		.cards-grid {
			grid-template-columns: 1fr;
			gap: var(--space-6);
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
