<script lang="ts" generics="TData, TValue">
	import type { PageProps } from './$types';

	import { columns } from '$lib/blocks/pets/data-table/columns.js';
	import DataTable from '$lib/blocks/pets/data-table/data-table.svelte';

	import CircleAlert from '@lucide/svelte/icons/circle-alert';

	let { data }: PageProps = $props();
	let { petsError, pets, species, genders } = $derived(data);
</script>

<svelte:head>
	<title>Pet Manager | My Pets</title>
</svelte:head>

{#if !petsError}
	<DataTable data={pets} {columns} {species} {genders} />
{:else}
	<div class="flex h-40 flex-col items-center justify-center gap-2 text-muted-foreground">
		<CircleAlert size={14} />
		<p>There was an error loading your pets</p>
	</div>
{/if}
