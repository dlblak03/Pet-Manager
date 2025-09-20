<script lang="ts">
	import { onMount } from 'svelte';
	import { getLocalTimeZone, today } from '@internationalized/date';

	import * as Card from '$lib/components/ui/card/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';

	import Camera from '@lucide/svelte/icons/camera';
	import { Separator } from '$lib/components/ui/separator';

	let url: any = $state('');
	let mediaLoading: boolean = $state(true);

	onMount(async () => {
		try {
			const response = await fetch('/api/dashboard/photo-of-the-day');

			if (!response.ok) {
				throw new Error('Failed to fetch picture of the day');
			}

			const blob = await response.blob();
			url = URL.createObjectURL(blob);
		} finally {
			mediaLoading = false;
		}
	});
</script>

<Card.Root>
	<Card.Header class="cursor-grab active:cursor-grabbing">
		<Card.Title class="flex items-center gap-2"><Camera size={12} />Photo of the Day</Card.Title>
	</Card.Header>
	<Separator />
	<Card.Content class="relative flex cursor-default flex-col gap-2 overflow-hidden {mediaLoading ? '' : '-mt-6'}">
		{#if mediaLoading}
			<div class="flex flex-col gap-2">
				<Skeleton class="h-[20px] w-full rounded-lg" />
				<Skeleton class="h-[20px] w-75 rounded-lg" />
			</div>
		{:else}
			<div class="flex w-full h-[250px] items-center justify-center">
				<img
					src={url}
					alt=""
					class="absolute inset-0 h-full w-full object-cover blur-md"
				/>
				<img
					src={url}
					alt=""
					class="z-5 max-h-[250px] max-w-full object-contain shadow-lg "
				/>
			</div>

		{/if}
	</Card.Content>
</Card.Root>
