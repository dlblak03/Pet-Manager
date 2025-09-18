<script lang="ts">
	import { onMount } from 'svelte';
	import { getLocalTimeZone, today } from '@internationalized/date';

	import * as Card from '$lib/components/ui/card/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';

	import Camera from '@lucide/svelte/icons/camera';

	let url: string = $state('');
	let mediaLoading: boolean = $state(true);

	onMount(async () => {
		try {
			url = await fetch('/api/dashboard/photo-of-the-day').then((r) => r.json());
		} finally {
			mediaLoading = false;
		}
	});
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="flex items-center gap-2"><Camera size={12} />Photo of the Day</Card.Title>
	</Card.Header>
	<Card.Content>
		{#if mediaLoading}
			<div class="flex flex-col gap-2">
				<Skeleton class="h-[20px] w-full rounded-lg" />
				<Skeleton class="h-[20px] w-75 rounded-lg" />
			</div>
		{:else}
			<img class="rounded-md" src="{url}" alt="">
		{/if}
	</Card.Content>
	<Card.Footer></Card.Footer>
</Card.Root>
