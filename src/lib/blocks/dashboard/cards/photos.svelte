<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator';

	import Images from '@lucide/svelte/icons/images';
</script>

<Card.Root>
	<Card.Header class="cursor-grab active:cursor-grabbing">
		<Card.Title class="flex items-center gap-2"><Images size={12} /> Recent Photos</Card.Title>
	</Card.Header>
	<Separator />
	<Card.Content class="relative flex flex-col gap-2 cursor-default"></Card.Content>
</Card.Root>
