<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import * as Card from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator';
	import { Skeleton } from '$lib/components/ui/skeleton';

	import Images from '@lucide/svelte/icons/images';
	import Camera from '@lucide/svelte/icons/camera';

	let photoUrls: string[] = $state([]);
	let photosLoading: boolean = $state(true);

	type photosResponse = {
		success: boolean;
		photos: { photo: number[]; mimeType: string }[] | null;
		potdError: string | null;
	};

	onMount(() => {
		const controller = new AbortController();

		async function fetchPhotos() {
			try {
				const response = await fetch('/api/dashboard/photos', {
					signal: controller.signal
				});

				if (!response.ok) {
					throw new Error(`HTTP error. Status: ${response.status}`);
				}

				const data: photosResponse = await response.json();

				if (data.success && data.photos) {
					photoUrls = data.photos.map((photo) => {
						const uint8Array = new Uint8Array(photo.photo);
						const blob = new Blob([uint8Array], { type: photo.mimeType });

						return URL.createObjectURL(blob);
					});
				}
			} catch (error) {
				if (error instanceof Error) {
					if (error.name !== 'AbortError') {
						console.error('Failed to fetch photos: ', error);
					}
				} else {
					console.error('An unexpected error occurred: ', error);
				}
			} finally {
				photosLoading = false;
			}
		}

		fetchPhotos();

		return () => controller.abort();
	});

	onDestroy(() => {
		photoUrls.forEach((url) => URL.revokeObjectURL(url));
	});
</script>

<Card.Root>
	<Card.Header class="cursor-grab active:cursor-grabbing">
		<Card.Title class="flex items-center gap-2"><Images size={12} /> Recent Photos</Card.Title>
	</Card.Header>
	<Separator />
	<Card.Content
		class="relative flex cursor-default flex-col overflow-hidden {photosLoading ||
		photoUrls.length == 0
			? ''
			: '-mt-6'}"
	>
		{#if photosLoading}
			<div class="flex flex-col gap-2">
				<Skeleton class="h-[20px] w-full rounded-lg" />
				<Skeleton class="h-[20px] w-75 rounded-lg" />
			</div>
		{:else if photoUrls.length == 0}
			<div class="flex h-40 flex-col items-center justify-center gap-2 text-muted-foreground">
				<Camera size={14} />
				<p>No recent photos</p>
			</div>
		{:else}
			<div class="-mx-6 flex flex-row">
				{#each photoUrls.slice(0, 4) as url (url)}
					<div class="relative flex grow items-center justify-center">
						<img src={url} alt="" class="z-5 max-w-full object-contain shadow-lg" />
					</div>
				{/each}
			</div>
			<div class="-mx-6 flex flex-row">
				{#each photoUrls.slice(4, photoUrls.length) as url (url)}
					<div class="relative flex grow items-center justify-center">
						<img src={url} alt="" class="z-5 max-w-full object-contain shadow-lg" />
					</div>
				{/each}
			</div>
		{/if}
	</Card.Content>
</Card.Root>
