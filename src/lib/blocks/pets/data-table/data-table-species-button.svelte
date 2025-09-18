<script lang="ts">
	import type { ComponentProps } from 'svelte';
	
	import { Button } from '$lib/components/ui/button/index.js';

    import ArrowUpDownIcon from '@lucide/svelte/icons/arrow-up-down';

	let { variant = 'ghost', ...restProps }: ComponentProps<typeof Button> = $props();
</script>

<Button class="hover:bg-primary dark:hover:bg-primary hover:text-white cursor-pointer" {variant} {...restProps}>
	Species
	<ArrowUpDownIcon class="ml-2" />
</Button>
