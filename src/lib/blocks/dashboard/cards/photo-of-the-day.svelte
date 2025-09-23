<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import * as Card from '$lib/components/ui/card/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { Separator } from '$lib/components/ui/separator';

	import Camera from '@lucide/svelte/icons/camera';

	let url: any = $state('');
	let mediaLoading: boolean = $state(true);

	onMount(async () => {
		try {
			const response = await fetch('/api/dashboard/photo-of-the-day');

			if (!response.ok) {
				throw new Error('Failed to fetch recent pictures');
			}

			const imagesData = await response.json();

			if (imagesData.data.length == 0) {
				return;
			}

			const uint8Array = new Uint8Array(imagesData.data);
			const blob = new Blob([uint8Array], { type: imagesData.mimeType });

			url = URL.createObjectURL(blob);
		} finally {
			mediaLoading = false;
		}
	});

	onDestroy(() => {
		URL.revokeObjectURL(url);
	});
</script>

<Card.Root>
	<Card.Header class="cursor-grab active:cursor-grabbing">
		<Card.Title class="flex items-center gap-2"><Camera size={12} />Photo of the Day</Card.Title>
	</Card.Header>
	<Separator />
	<Card.Content
		class="relative flex cursor-default flex-col gap-2 overflow-hidden {mediaLoading || url == ''
			? ''
			: '-mt-6'}"
	>
		{#if mediaLoading}
			<div class="flex flex-col gap-2">
				<Skeleton class="h-[20px] w-full rounded-lg" />
				<Skeleton class="h-[20px] w-75 rounded-lg" />
			</div>
		{:else if url == ''}
			<div class="flex h-20 flex-col items-center justify-center gap-2 text-muted-foreground">
				<Camera size={14} />
				<p>Add photos to see photo of the day</p>
			</div>
		{:else}
			<div class="flex h-[250px] w-full items-center justify-center">
				<img src={url} alt="" class="absolute inset-0 h-full w-full object-cover blur-md" />
				<img src={url} alt="" class="z-5 max-h-[250px] max-w-full object-contain shadow-lg" />
			</div>
		{/if}
	</Card.Content>
</Card.Root>
