<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator';

	import HeartPulse from '@lucide/svelte/icons/heart-pulse';
</script>

<Card.Root>
	<Card.Header class="cursor-grab active:cursor-grabbing">
		<Card.Title class="flex items-center gap-2"><HeartPulse size={12} /> Recent Medical Records</Card.Title>
	</Card.Header>
	<Separator />
	<Card.Content class="relative flex flex-col gap-2 cursor-default"></Card.Content>
</Card.Root>
