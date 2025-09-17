<script lang="ts">
	import type { ComponentProps } from 'svelte';
	
	import { Button } from '$lib/components/ui/button/index.js';

    import ArrowUpDownIcon from '@lucide/svelte/icons/arrow-up-down';

	let { variant = 'ghost', ...restProps }: ComponentProps<typeof Button> = $props();
</script>

<Button class="hover:bg-zinc-200/50 dark:hover:bg-zinc-700" {variant} {...restProps}>
	Species
	<ArrowUpDownIcon class="ml-2" />
</Button>
