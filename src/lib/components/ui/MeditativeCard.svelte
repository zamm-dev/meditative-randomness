<script lang="ts">
	import { onMount } from 'svelte';
	import { organicPosition } from '$lib/utils/randomness';

	let {
		children,
		variant = 'default',
		elevation = 'medium'
	}: {
		children: any;
		variant?: 'default' | 'primary' | 'gentle';
		elevation?: 'soft' | 'medium' | 'deep';
	} = $props();

	let cardElement: HTMLElement;

	onMount(() => {
		if (cardElement) {
			// Add subtle organic positioning on hover
			const handleMouseEnter = () => {
				const position = organicPosition(2);
				cardElement.style.transform = `translate(${position.x}px, ${position.y}px) scale(1.02)`;
			};

			const handleMouseLeave = () => {
				cardElement.style.transform = 'translate(0, 0) scale(1)';
			};

			cardElement.addEventListener('mouseenter', handleMouseEnter);
			cardElement.addEventListener('mouseleave', handleMouseLeave);

			return () => {
				cardElement?.removeEventListener('mouseenter', handleMouseEnter);
				cardElement?.removeEventListener('mouseleave', handleMouseLeave);
			};
		}
	});
</script>

<div
	bind:this={cardElement}
	class="meditative-card"
	class:variant-primary={variant === 'primary'}
	class:variant-gentle={variant === 'gentle'}
	class:elevation-soft={elevation === 'soft'}
	class:elevation-medium={elevation === 'medium'}
	class:elevation-deep={elevation === 'deep'}
>
	{@render children()}
</div>

<style>
	.meditative-card {
		width: 100%;
		background: rgba(255, 255, 255, 0.7);
		backdrop-filter: blur(8px);
		border-radius: var(--radius-lg);
		padding: var(--space-8);
		transition: all var(--duration-normal) var(--ease-organic);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.elevation-soft {
		box-shadow: var(--shadow-soft);
	}

	.elevation-medium {
		box-shadow: var(--shadow-medium);
	}

	.elevation-deep {
		box-shadow: var(--shadow-deep);
	}

	.variant-primary {
		background: linear-gradient(135deg, rgba(184, 216, 232, 0.8) 0%, rgba(200, 216, 184, 0.8) 100%);
	}

	.variant-gentle {
		background: rgba(245, 241, 235, 0.8);
	}

	.meditative-card:hover {
		box-shadow: var(--shadow-deep);
		background: rgba(255, 255, 255, 0.8);
	}

	.variant-primary:hover {
		background: linear-gradient(135deg, rgba(184, 216, 232, 0.9) 0%, rgba(200, 216, 184, 0.9) 100%);
	}

	.variant-gentle:hover {
		background: rgba(245, 241, 235, 0.9);
	}

	@media (prefers-reduced-motion: reduce) {
		.meditative-card {
			transition: none;
		}
		.meditative-card:hover {
			transform: none !important;
		}
	}

	/* Focus styles for accessibility */
	.meditative-card:focus-within {
		outline: 2px solid var(--color-blue-primary);
		outline-offset: 2px;
	}
</style>
