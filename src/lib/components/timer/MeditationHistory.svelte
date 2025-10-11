<script lang="ts">
	import { Trash2, Check, X, Download, Upload } from 'lucide-svelte';
	import {
		getMeditationHistory,
		deleteMeditationRecord,
		formatEndTime,
		formatDuration,
		exportMeditationHistory,
		generateExportFilename,
		importMeditationHistory,
		type MeditationRecord
	} from '$lib/utils/history';

	let history = $state<MeditationRecord[]>([]);
	let deleteConfirmId = $state<string | null>(null);
	let statusMessage = $state<{ text: string; type: 'success' | 'error' } | null>(null);
	let fileInputRef: HTMLInputElement | undefined = $state();

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

	function handleExport() {
		try {
			const data = exportMeditationHistory();
			const json = JSON.stringify(data, null, 2);
			const blob = new globalThis.Blob([json], { type: 'application/json' });
			const url = globalThis.URL.createObjectURL(blob);
			const a = globalThis.document.createElement('a');
			a.href = url;
			a.download = generateExportFilename();
			a.click();
			globalThis.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Export failed:', error);
			showStatus('Failed to export meditation history', 'error');
		}
	}

	function handleImportClick() {
		fileInputRef?.click();
	}

	async function handleFileSelected(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (!file) return;

		try {
			const text = await file.text();
			const result = importMeditationHistory(text);

			if (result.success) {
				history = getMeditationHistory(); // Refresh the list
				if (result.importedCount === 0) {
					showStatus('No new records to import', 'success');
				} else {
					showStatus(
						`Successfully imported ${result.importedCount} meditation record${result.importedCount === 1 ? '' : 's'}`,
						'success'
					);
				}
			} else {
				showStatus(result.errorMessage || 'Import failed', 'error');
			}
		} catch (error) {
			console.error('Import failed:', error);
			showStatus('Failed to read the selected file', 'error');
		} finally {
			// Reset file input to allow importing the same file again
			input.value = '';
		}
	}

	function showStatus(text: string, type: 'success' | 'error') {
		statusMessage = { text, type };
		setTimeout(() => {
			statusMessage = null;
		}, 5000);
	}
</script>

<div class="history-container">
	<div class="history-header">
		<h3 class="history-title">Meditation History</h3>
		<div class="history-actions">
			<button onclick={handleExport} class="action-button export-button" title="Export History">
				<Download size={16} />
				<span>Export</span>
			</button>
			<button
				onclick={handleImportClick}
				class="action-button import-button"
				title="Import History"
			>
				<Upload size={16} />
				<span>Import</span>
			</button>
			<input
				bind:this={fileInputRef}
				type="file"
				accept=".json"
				onchange={handleFileSelected}
				class="file-input"
			/>
		</div>
	</div>

	{#if statusMessage}
		<div class="status-message status-{statusMessage.type}">
			{statusMessage.text}
		</div>
	{/if}

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
							<button
								onclick={() => handleDelete(record.id)}
								class="confirm-button"
								title="Confirm Delete"
							>
								<Check size={16} />
							</button>
							<button onclick={cancelDelete} class="cancel-button" title="Cancel">
								<X size={16} />
							</button>
						{:else}
							<div style="flex: 1;"></div>
							<button onclick={() => handleDelete(record.id)} class="delete-button" title="Delete">
								<Trash2 size={16} />
							</button>
							<div class="placeholder-button"></div>
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

	.history-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-4);
		gap: var(--space-4);
		flex-wrap: wrap;
	}

	.history-title {
		font-size: var(--text-lg);
		font-weight: var(--font-weight-medium);
		color: var(--color-green-deep);
		margin: 0;
	}

	.history-actions {
		display: flex;
		gap: var(--space-2);
		align-items: center;
	}

	.action-button {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		background: rgba(255, 255, 255, 0.8);
		border: 1px solid rgba(168, 198, 134, 0.3);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-neutral-dark);
		cursor: pointer;
		transition: all var(--duration-normal) var(--ease-out);
	}

	.action-button:hover {
		background: rgba(255, 255, 255, 1);
		border-color: rgba(168, 198, 134, 0.5);
		transform: translateY(-1px);
	}

	.action-button:active {
		transform: translateY(0);
	}

	.export-button {
		color: var(--color-blue-deep);
	}

	.import-button {
		color: var(--color-green-deep);
	}

	.file-input {
		display: none;
	}

	.status-message {
		padding: var(--space-3);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-3);
		font-size: var(--text-sm);
		text-align: center;
		animation: slideIn 0.3s var(--ease-out);
	}

	.status-success {
		background: rgba(168, 198, 134, 0.2);
		border: 1px solid rgba(168, 198, 134, 0.4);
		color: var(--color-green-deep);
	}

	.status-error {
		background: rgba(220, 53, 69, 0.1);
		border: 1px solid rgba(220, 53, 69, 0.3);
		color: #dc3545;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
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
		margin-left: 40px;
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
		opacity: 0;
		margin-left: 5px;
		display: flex;
		gap: 2px;
		align-items: center;
		min-width: 35px; /* Ensure consistent width for both states */
		transition: opacity var(--duration-normal) var(--ease-out);
	}

	.history-item:hover .record-actions {
		opacity: 1;
	}

	.delete-button,
	.confirm-button,
	.cancel-button,
	.placeholder-button {
		border: none;
		border-radius: var(--radius-sm);
		font-weight: var(--font-weight-medium);
		cursor: pointer;
		transition: all var(--duration-normal) var(--ease-out);
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
	}

	.delete-button {
		color: var(--color-neutral-dark);
		opacity: 0.4;
	}

	.delete-button:hover {
		opacity: 0.8;
		color: #dc3545;
	}

	.confirm-button {
		color: #dc3545;
		opacity: 0.8;
	}

	.confirm-button:hover {
		opacity: 1;
	}

	.cancel-button {
		color: var(--color-neutral-dark);
		opacity: 0.4;
	}

	.cancel-button:hover {
		opacity: 0.8;
	}

	.placeholder-button {
		/* Invisible placeholder to maintain layout */
		visibility: hidden;
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
