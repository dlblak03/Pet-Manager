<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';

	import Images from '@lucide/svelte/icons/images';
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="flex items-center gap-2"><Images size={12} /> Recent Photos</Card.Title>
	</Card.Header>
	<Card.Content></Card.Content>
	<Card.Footer></Card.Footer>
</Card.Root>
