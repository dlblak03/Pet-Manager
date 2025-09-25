<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import * as Card from '$lib/components/ui/card/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { Separator } from '$lib/components/ui/separator';

	import Camera from '@lucide/svelte/icons/camera';

	let potdUrl: any = $state('');
	let potdLoading: boolean = $state(true);

	type potdResponse = {
		success: boolean;
		potd: number[] | null;
		mimeType: string | null;
		potdError: string | null;
	};

	onMount(() => {
		const controller = new AbortController();

		async function fetchPOTD() {
			try {
				const response = await fetch(`/api/dashboard/photo-of-the-day`, {
					signal: controller.signal
				});

				if (!response.ok) {
					throw new Error(`HTTP error. Status: ${response.status}`);
				}

				const data: potdResponse = await response.json();

				if (data.success && data.potd && data.mimeType) {
					const uint8Array = new Uint8Array(data.potd);
					const blob = new Blob([uint8Array], { type: data.mimeType });

					potdUrl = URL.createObjectURL(blob);
				}
			} catch (error) {
				if (error instanceof Error) {
					if (error.name !== 'AbortError') {
						console.error('Failed to fetch picture of the day: ', error);
					}
				} else {
					console.error('An unexpected error occurred: ', error);
				}
			} finally {
				potdLoading = false;
			}
		}

		fetchPOTD();

		return () => controller.abort();
	});

	onDestroy(() => {
		URL.revokeObjectURL(potdUrl);
	});
</script>

<Card.Root>
	<Card.Header class="cursor-grab active:cursor-grabbing">
		<Card.Title class="flex items-center gap-2"><Camera size={12} />Photo of the Day</Card.Title>
	</Card.Header>
	<Separator />
	<Card.Content
		class="relative flex cursor-default flex-col gap-2 overflow-hidden {potdLoading || potdUrl == ''
			? ''
			: '-mt-6'}"
	>
		{#if potdLoading}
			<div class="flex flex-col gap-2">
				<Skeleton class="h-[20px] w-full rounded-lg" />
				<Skeleton class="h-[20px] w-75 rounded-lg" />
			</div>
		{:else if potdUrl == ''}
			<div class="flex h-40 flex-col items-center justify-center gap-2 text-muted-foreground">
				<Camera size={14} />
				<p>Add photos to see a photo of the day</p>
			</div>
		{:else}
			<div class="flex h-[250px] w-full items-center justify-center">
				<img
					fetchpriority="high"
					src={potdUrl}
					alt=""
					class="absolute inset-0 h-full w-full object-cover blur-md"
				/>
				<img
					fetchpriority="high"
					src={potdUrl}
					alt=""
					class="z-5 max-h-[250px] max-w-full object-contain shadow-lg"
				/>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
