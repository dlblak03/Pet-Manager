<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';

	import Camera from '@lucide/svelte/icons/camera';
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="flex items-center gap-2"><Camera size={12} />Photo of the Day</Card.Title>
	</Card.Header>
	<Card.Content></Card.Content>
	<Card.Footer></Card.Footer>
</Card.Root>
