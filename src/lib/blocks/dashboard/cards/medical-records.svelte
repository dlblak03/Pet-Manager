<script lang="ts">
	import { onMount } from 'svelte';

	import type { Database } from '$lib/database/database.types';

	type MedicalRecords = Database['pets']['Tables']['medical_records']['Row'];

	import * as Card from '$lib/components/ui/card/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { Separator } from '$lib/components/ui/separator';

	import HeartPulse from '@lucide/svelte/icons/heart-pulse';
	import FileHeart from '@lucide/svelte/icons/file-heart';

	let medicalRecordsData: MedicalRecords[] = $state([]);
	let medicalRecordsLoading: boolean = $state(true);

	onMount(async () => {
		try {
			medicalRecordsData = await fetch('/api/dashboard/medical-records').then((r) => r.json());
		} finally {
			medicalRecordsLoading = false;
		}
	});
</script>

<Card.Root>
	<Card.Header class="cursor-grab active:cursor-grabbing">
		<Card.Title class="flex items-center gap-2"
			><HeartPulse size={12} /> Recent Medical Records</Card.Title
		>
	</Card.Header>
	<Separator />
	<Card.Content class="relative flex cursor-default flex-col gap-2">
		{#if medicalRecordsLoading}
			<div class="flex flex-col gap-2">
				<Skeleton class="h-[20px] w-full rounded-lg" />
				<Skeleton class="h-[20px] w-75 rounded-lg" />
			</div>
		{:else if medicalRecordsData.length == 0}
			<div class="flex h-20 flex-col items-center justify-center gap-2 text-muted-foreground">
				<FileHeart size={14} />
				<p>No recent medical records</p>
			</div>
		{:else}{/if}
	</Card.Content>
</Card.Root>
