<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import * as Card from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator';
	import { Skeleton } from '$lib/components/ui/skeleton';

	import Images from '@lucide/svelte/icons/images';
	import Camera from '@lucide/svelte/icons/camera';

	let imageUrls: { url: string }[] = $state([]);
	let mediaLoading: boolean = $state(true);

	onMount(async () => {
		try {
			const response = await fetch('/api/dashboard/photos');

			if (!response.ok) {
				throw new Error('Failed to fetch recent pictures');
			}

			const imagesData = await response.json();

			imageUrls = imagesData.map((imageInfo: any) => {
				const uint8Array = new Uint8Array(imageInfo.data);
				const blob = new Blob([uint8Array], { type: imageInfo.mimeType });

				return {
					url: URL.createObjectURL(blob)
				};
			});
		} finally {
			mediaLoading = false;
		}
	});

	onDestroy(() => {
		imageUrls.forEach((image) => URL.revokeObjectURL(image.url));
	});
</script>

<Card.Root>
	<Card.Header class="cursor-grab active:cursor-grabbing">
		<Card.Title class="flex items-center gap-2"><Images size={12} /> Recent Photos</Card.Title>
	</Card.Header>
	<Separator />
	<Card.Content
		class="relative flex cursor-default flex-col overflow-hidden {mediaLoading ||
		imageUrls.length == 0
			? ''
			: '-mt-6'}"
	>
		{#if mediaLoading}
			<div class="flex flex-col gap-2">
				<Skeleton class="h-[20px] w-full rounded-lg" />
				<Skeleton class="h-[20px] w-75 rounded-lg" />
			</div>
		{:else if imageUrls.length == 0}
			<div class="flex h-20 flex-col items-center justify-center gap-2 text-muted-foreground">
				<Camera size={14} />
				<p>No recent photos</p>
			</div>
		{:else}
			<div class="-mx-6 flex flex-row">
				{#each imageUrls.slice(0, 4) as image}
					<div class="relative flex grow items-center justify-center">
						<img src={image.url} alt="help" class="z-5 max-w-full object-contain shadow-lg" />
					</div>
				{/each}
			</div>
			<div class="-mx-6 flex flex-row">
				{#each imageUrls.slice(4, imageUrls.length) as image}
					<div class="relative flex grow items-center justify-center">
						<img src={image.url} alt="help" class="z-5 max-w-full object-contain shadow-lg" />
					</div>
				{/each}
			</div>
		{/if}
	</Card.Content>
</Card.Root>
