<script lang="ts">
	import { invalidate } from '$app/navigation';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
	import Trash from '@lucide/svelte/icons/trash';
	import Eye from '@lucide/svelte/icons/eye';

	let { id }: { id: string } = $props();

	const deletePet = async (petId: string) => {
		const response = await fetch('/api/mypets/' + petId, { method: 'DELETE' });

		invalidate('supabase:db:pets');
	};
</script>

<div class="flex justify-end">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					variant="ghost"
					size="icon"
					class="relative size-8 cursor-pointer justify-self-end p-0"
				>
					<span class="sr-only">Open menu</span>
					<EllipsisIcon />
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			<DropdownMenu.Item class="cursor-pointer px-0 py-0"
				><a href={'/mypets/' + id} class="flex grow items-center gap-2 px-2 py-1.5"
					><Eye />View Pet</a
				></DropdownMenu.Item
			>
			<DropdownMenu.Separator />
			<DropdownMenu.Item
				onSelect={() => {
					deletePet(id);
				}}
				class="cursor-pointer"
				variant="destructive"><Trash />Delete Pet</DropdownMenu.Item
			>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
