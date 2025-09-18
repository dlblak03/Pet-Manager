<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';

	import HeartPulse from '@lucide/svelte/icons/heart-pulse';
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="flex items-center gap-2"><HeartPulse size={12} /> Upcoming Vaccinations</Card.Title>
	</Card.Header>
	<Card.Content></Card.Content>
	<Card.Footer></Card.Footer>
</Card.Root>
