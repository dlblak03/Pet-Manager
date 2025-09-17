<script lang="ts" generics="TData, TValue">
	import type { PageProps } from './$types';

	import { columns } from '$lib/blocks/pets/data-table/columns.js';
	import DataTable from '$lib/blocks/pets/data-table/data-table.svelte';

	let { data }: PageProps = $props();
	let { pets, species, genders } = $derived(data);
</script>

<svelte:head>
	<title>Pet Manager | My Pets</title>
</svelte:head>

<DataTable data={pets} {columns} {species} {genders} />
