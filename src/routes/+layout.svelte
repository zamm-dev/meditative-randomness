<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import ShiftingGradient from '$lib/components/animations/ShiftingGradient.svelte';
	import DriftingParticles from '$lib/components/animations/DriftingParticles.svelte';
	import BreathingContainer from '$lib/components/animations/BreathingContainer.svelte';
	import '$lib/styles/globals.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ShiftingGradient />
<DriftingParticles count={15} />

<BreathingContainer>
	<main class="app-container">
		{@render children?.()}
	</main>
</BreathingContainer>

<style>
	.app-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		position: relative;
		z-index: 1;
	}
</style>
