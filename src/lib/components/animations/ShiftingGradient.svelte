<div class="shifting-gradient"></div>

<style>
	.shifting-gradient {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -2;
		background: linear-gradient(
			45deg,
			#f5f1eb,
			#f0e8dc,
			#e8d8c8,
			#e0c8a8,
			#d8b898,
			#e0c8a8,
			#e8d8c8,
			#f0e8dc,
			#f5f1eb
		);
		background-size: 400% 400%;
		animation: gradientShift 35s ease-in-out infinite;
	}

	@keyframes gradientShift {
		0% {
			background-position: 0% 50%;
		}
		25% {
			background-position: 100% 50%;
		}
		50% {
			background-position: 100% 100%;
		}
		75% {
			background-position: 0% 100%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.shifting-gradient {
			animation: none;
			background: linear-gradient(45deg, #f5f1eb 0%, #e8d8c8 50%, #c8d8b8 100%);
			background-size: 100% 100%;
		}
	}
</style>
