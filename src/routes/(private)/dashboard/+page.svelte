<script lang="ts">
	import type { PageProps } from './$types';
	import { onMount } from 'svelte';
	import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action';

	import { Skeleton } from '$lib/components/ui/skeleton/index.js';

	import Vaccinations from '$lib/blocks/dashboard/cards/vaccinations.svelte';
	import PhotoOfTheDay from '$lib/blocks/dashboard/cards/photo-of-the-day.svelte';
	import Appointments from '$lib/blocks/dashboard/cards/appointments.svelte';
	import ActivityFeed from '$lib/blocks/dashboard/cards/activity-feed.svelte';
	import MedicalRecords from '$lib/blocks/dashboard/cards/medical-records.svelte';
	import Photos from '$lib/blocks/dashboard/cards/photos.svelte';

	const componentMap = {
		vaccinations: Vaccinations,
		appointments: Appointments,
		'photo-of-day': PhotoOfTheDay,
		'medical-records': MedicalRecords,
		'activity-feed': ActivityFeed,
		photos: Photos
	} as const;

	type CardId = keyof typeof componentMap;

	interface Card {
		id: CardId;
		isDndShadowItem?: boolean;
	}

	let isLayoutLoaded = $state(false);
	let columns: { left: Card[]; center: Card[]; right: Card[] } = $state({
		left: [{ id: 'vaccinations' }, { id: 'appointments' }],
		center: [{ id: 'medical-records' }, { id: 'photo-of-day' }],
		right: [{ id: 'activity-feed' }, { id: 'photos' }]
	});

	let dragDisabled = false;
	const flipDurationMs = 200;

	function handleLeftConsider(e: CustomEvent) {
		columns.left = e.detail.items;
	}

	function handleLeftFinalize(e: CustomEvent) {
		columns.left = e.detail.items;
		saveLayout();
	}

	function handleCenterConsider(e: CustomEvent) {
		columns.center = e.detail.items;
	}

	function handleCenterFinalize(e: CustomEvent) {
		columns.center = e.detail.items;
		saveLayout();
	}

	function handleRightConsider(e: CustomEvent) {
		columns.right = e.detail.items;
	}

	function handleRightFinalize(e: CustomEvent) {
		columns.right = e.detail.items;
		saveLayout();
	}

	function saveLayout() {
		localStorage.setItem('dashboard-layout', JSON.stringify(columns));
	}

	function loadLayout() {
		const saved = localStorage.getItem('dashboard-layout');
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				columns = parsed;
			} catch (e) {
				console.error('Failed to load saved layout:', e);
			}
		}
		isLayoutLoaded = true;
	}

	onMount(() => {
		loadLayout();
	});
</script>

<svelte:head>
	<title>Pet Manager | Dashboard</title>
</svelte:head>

<div class="flex grow flex-col gap-5 p-5">
	<div class="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-3">
		<div
			class="space-y-4"
			use:dndzone={{
				items: columns.left,
				flipDurationMs,
				dragDisabled,
				dropTargetStyle: {}
			}}
			onconsider={handleLeftConsider}
			onfinalize={handleLeftFinalize}
		>
			{#if isLayoutLoaded}
				{#each columns.left as card (card.id)}
					{#if !card[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
						{@const Component = componentMap[card.id]}
						<Component />
					{:else}
						<div class="rounded-lg border-2 border-dashed border-border bg-muted p-4 opacity-50">
							<div class="h-20"></div>
						</div>
					{/if}
				{/each}
			{:else}
				<div class="flex flex-col gap-2">
					<Skeleton class="h-[20px] w-full rounded-lg" />
					<Skeleton class="h-[20px] w-75 rounded-lg" />
				</div>
			{/if}
		</div>

		<div
			class="space-y-4"
			use:dndzone={{
				items: columns.center,
				flipDurationMs,
				dragDisabled,
				dropTargetStyle: {}
			}}
			onconsider={handleCenterConsider}
			onfinalize={handleCenterFinalize}
		>
			{#if isLayoutLoaded}
				{#each columns.center as card (card.id)}
					{#if !card[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
						{@const Component = componentMap[card.id]}
						<Component />
					{:else}
						<div class="rounded-lg border-2 border-dashed border-border bg-muted p-4 opacity-50">
							<div class="h-20"></div>
						</div>
					{/if}
				{/each}
			{:else}
				<div class="flex flex-col gap-2">
					<Skeleton class="h-[20px] w-full rounded-lg" />
					<Skeleton class="h-[20px] w-75 rounded-lg" />
				</div>
			{/if}
		</div>

		<div
			class="space-y-4"
			use:dndzone={{
				items: columns.right,
				flipDurationMs,
				dragDisabled,
				dropTargetStyle: {}
			}}
			onconsider={handleRightConsider}
			onfinalize={handleRightFinalize}
		>
			{#if isLayoutLoaded}
				{#each columns.right as card (card.id)}
					{#if !card[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
						{@const Component = componentMap[card.id]}
						<Component />
					{:else}
						<div class="rounded-lg border-2 border-dashed border-border bg-muted p-4 opacity-50">
							<div class="h-20"></div>
						</div>
					{/if}
				{/each}
			{:else}
				<div class="flex flex-col gap-2">
					<Skeleton class="h-[20px] w-full rounded-lg" />
					<Skeleton class="h-[20px] w-75 rounded-lg" />
				</div>
			{/if}
		</div>
	</div>
</div>
