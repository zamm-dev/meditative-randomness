<script lang="ts">
	import {
		getMeditationHistory,
		deleteMeditationRecord,
		formatEndTime,
		formatDuration,
		type MeditationRecord
	} from '$lib/utils/history';

	let history = $state<MeditationRecord[]>([]);
	let deleteConfirmId = $state<string | null>(null);

	// Load history on component mount
	$effect(() => {
		history = getMeditationHistory();
	});

	function handleDelete(id: string) {
		if (deleteConfirmId === id) {
			// Confirm deletion
			deleteMeditationRecord(id);
			history = getMeditationHistory(); // Refresh the list
			deleteConfirmId = null;
		} else {
			// Show confirmation
			deleteConfirmId = id;
		}
	}

	function cancelDelete() {
		deleteConfirmId = null;
	}
</script>

<div class="history-container">
	<h3 class="history-title">Meditation History</h3>

	{#if history.length === 0}
		<div class="empty-state">
			<p>No meditation sessions recorded yet.</p>
			<p class="empty-subtitle">Complete a meditation to see your history here.</p>
		</div>
	{:else}
		<div class="history-list">
			{#each history as record (record.id)}
				<div class="history-item">
					<div class="record-info">
						<div class="record-time">{formatEndTime(record.endTime)}</div>
						<div class="record-duration">{formatDuration(record.duration)}</div>
					</div>
					<div class="record-actions">
						{#if deleteConfirmId === record.id}
							<button onclick={() => handleDelete(record.id)} class="confirm-button">
								Confirm Delete
							</button>
							<button onclick={cancelDelete} class="cancel-button"> Cancel </button>
						{:else}
							<button onclick={() => handleDelete(record.id)} class="delete-button" title="Delete">
								×
							</button>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.history-container {
		margin-top: var(--space-6);
		padding-top: var(--space-6);
		border-top: 1px solid rgba(168, 198, 134, 0.2);
	}

	.history-title {
		font-size: var(--text-lg);
		font-weight: var(--font-weight-medium);
		color: var(--color-green-deep);
		margin-bottom: var(--space-4);
		text-align: center;
	}

	.empty-state {
		text-align: center;
		padding: var(--space-6);
		color: var(--color-neutral-dark);
		opacity: 0.7;
	}

	.empty-state p {
		margin: 0;
	}

	.empty-subtitle {
		font-size: var(--text-sm);
		margin-top: var(--space-2) !important;
	}

	.history-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		max-height: 300px;
		overflow-y: auto;
	}

	.history-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-3);
		background: rgba(255, 255, 255, 0.6);
		border: 1px solid rgba(168, 198, 134, 0.2);
		border-radius: var(--radius-md);
		transition: all var(--duration-normal) var(--ease-out);
	}

	.history-item:hover {
		background: rgba(255, 255, 255, 0.8);
		border-color: rgba(168, 198, 134, 0.3);
	}

	.record-info {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		flex-grow: 1;
		min-width: 0; /* Allow text to wrap properly */
	}

	.record-time {
		font-size: var(--text-sm);
		color: var(--color-neutral-dark);
		font-weight: var(--font-weight-medium);
		flex-shrink: 0;
	}

	.record-duration {
		font-size: var(--text-sm);
		color: var(--color-blue-deep);
		font-weight: var(--font-weight-medium);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	.record-actions {
		display: flex;
		gap: var(--space-2);
		align-items: center;
	}

	.delete-button,
	.confirm-button,
	.cancel-button {
		border: none;
		border-radius: var(--radius-sm);
		font-weight: var(--font-weight-medium);
		cursor: pointer;
		transition: all var(--duration-normal) var(--ease-out);
	}

	.delete-button {
		background: none;
		color: var(--color-neutral-dark);
		opacity: 0.4;
		font-size: 18px;
		line-height: 1;
		padding: var(--space-1);
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.delete-button:hover {
		opacity: 0.8;
		color: #dc3545;
	}

	.confirm-button,
	.cancel-button {
		padding: var(--space-2) var(--space-3);
		font-size: var(--text-xs);
		min-width: 60px;
	}

	.confirm-button {
		background: #dc3545;
		color: white;
		border: 1px solid #dc3545;
	}

	.confirm-button:hover {
		background: #c82333;
		border-color: #c82333;
	}

	.cancel-button {
		background: rgba(108, 117, 125, 0.1);
		color: #6c757d;
		border: 1px solid rgba(108, 117, 125, 0.2);
	}

	.cancel-button:hover {
		background: rgba(108, 117, 125, 0.2);
		border-color: rgba(108, 117, 125, 0.3);
	}

	@media (max-width: 768px) {
		.history-item {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-2);
		}

		.record-actions {
			align-self: stretch;
			justify-content: flex-end;
		}

		.record-info {
			width: 100%;
		}
	}

	/* Scrollbar styling for history list */
	.history-list::-webkit-scrollbar {
		width: 6px;
	}

	.history-list::-webkit-scrollbar-track {
		background: rgba(168, 198, 134, 0.1);
		border-radius: 3px;
	}

	.history-list::-webkit-scrollbar-thumb {
		background: rgba(168, 198, 134, 0.3);
		border-radius: 3px;
	}

	.history-list::-webkit-scrollbar-thumb:hover {
		background: rgba(168, 198, 134, 0.5);
	}
</style>
