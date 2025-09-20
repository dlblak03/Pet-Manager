<script lang="ts" generics="TData, TValue">
	import { untrack } from 'svelte';

	import {
		type ColumnDef,
		type PaginationState,
		type SortingState,
		type ColumnFiltersState,
		type RowSelectionState,
		getCoreRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		getFilteredRowModel
	} from '@tanstack/table-core';

	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';

	import X from '@lucide/svelte/icons/x';
	import LayoutGrid from '@lucide/svelte/icons/layout-grid';
	import List from '@lucide/svelte/icons/list';
	import Trash from '@lucide/svelte/icons/trash';
	import Search from '@lucide/svelte/icons/search';

	type DataTableProps<TData, TValue> = {
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
		species: any[];
		genders: any[];
	};

	let { data, columns, species, genders }: DataTableProps<TData, TValue> = $props();

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 50 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let rowSelection = $state<RowSelectionState>({});
	let globalFilters = $state<string>('');

	let searchPets: string = $state('');
	let speciesFilter: string = $state('');
	let genderFilter: string = $state('');
	let display: string = $state('cards');

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		globalFilterFn: (row, columnId, filterValue) => {
			const searchableText = [
				row.getValue('name'),
				row.getValue('species'),
				row.getValue('breed'),
				row.getValue('gender'),
				row.getValue('color'),
				row.getValue('birth_date')
			]
				.join(' ')
				.toLowerCase();

			console.log(searchableText)
			console.log(filterValue)

			return searchableText.includes(filterValue.toLowerCase());
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		onRowSelectionChange: (updater) => {
			if (typeof updater === 'function') {
				rowSelection = updater(rowSelection);
			} else {
				rowSelection = updater;
			}
		},
		onGlobalFilterChange: (updater) => {
			if (typeof updater === 'function') {
				globalFilters = updater(globalFilters);
				console.log(globalFilters)
			} else {
				globalFilters = updater;
				console.log(globalFilters)
			}
		},
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnFilters() {
				return columnFilters;
			},
			get rowSelection() {
				return rowSelection;
			},
			get globalFilter() {
				return globalFilters;
			}
		}
	});

	$effect(() => {
		speciesFilter;
		untrack(() => {
			table.getColumn('species')?.setFilterValue(speciesFilter);
		});
	});

	$effect(() => {
		genderFilter;
		untrack(() => {
			table.getColumn('gender')?.setFilterValue(genderFilter);
		});
	});

	const speciesTrigger = $derived(
		species.find((s) => s.value === speciesFilter)?.label ?? 'Filter by species'
	);

	const genderTrigger = $derived(
		genders.find((s) => s.value === genderFilter)?.label ?? 'Filter by gender'
	);
</script>

<div class="flex flex-col gap-5 p-5">
	<div class="flex items-center gap-5">
		{#if table.getFilteredSelectedRowModel().rows.length > 0}
			<Button variant="destructive" class="cursor-pointer"><Trash />Delete</Button>
		{:else}
			<div class="relative flex items-center gap-2">
				<Search class="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					type="text"
					placeholder="Search pets..."
					class="max-w-sm pl-8 lg:w-sm"
					bind:value={searchPets}
					onchange={() => {
						table.setGlobalFilter(searchPets);
					}}
					oninput={() => {
						table.setGlobalFilter(searchPets);
					}}
				/>
				{#if searchPets != ''}
					<Button
						variant="outline"
						size="icon"
						onclick={() => {
							searchPets = '';
							table.setGlobalFilter(searchPets);
						}}><X /></Button
					>
				{/if}
			</div>

			<Separator
				orientation="vertical"
				decorative={true}
				class="mx-2 data-[orientation=vertical]:h-6"
			/>

			<div class="flex items-center gap-2">
				<Select.Root type="single" name="species" bind:value={speciesFilter}>
					<Select.Trigger class="w-[130px] cursor-pointer bg-white">
						{speciesTrigger}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Species</Select.Label>
							{#each species as species (species.value)}
								<Select.Item value={species.value} label={species.label}>
									{species.label}
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
				{#if speciesTrigger != 'Filter by species'}
					<Button
						variant="outline"
						size="icon"
						onclick={() => {
							speciesFilter = '';
						}}><X /></Button
					>
				{/if}
			</div>

			<div class="flex items-center gap-2">
				<Select.Root type="single" name="gender" bind:value={genderFilter}>
					<Select.Trigger class="w-[130px] cursor-pointer bg-white">
						{genderTrigger}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Gender</Select.Label>
							{#each genders as gender (gender.value)}
								<Select.Item value={gender.value} label={gender.label}>
									{gender.label}
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
				{#if genderTrigger != 'Filter by gender'}
					<Button
						variant="outline"
						size="icon"
						onclick={() => {
							genderFilter = '';
						}}><X /></Button
					>
				{/if}
			</div>
		{/if}

		<div class="ml-auto">
			<ToggleGroup.Root
				bind:value={display}
				type="single"
				variant="outline"
				class="bg-white dark:bg-input"
			>
				<ToggleGroup.Item value="cards" class="cursor-pointer"><LayoutGrid /></ToggleGroup.Item>
				<ToggleGroup.Item value="list" class="cursor-pointer"><List /></ToggleGroup.Item>
			</ToggleGroup.Root>
		</div>
	</div>

	<div class="grow">
		{#if display == 'cards'}{:else}
			<div class="rounded-md border bg-white dark:bg-input/25">
				<Table.Root>
					<Table.Header>
						{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
							<Table.Row class="bg-primary/25 dark:bg-primary/50">
								{#each headerGroup.headers as header, index (header.id)}
									<!-- svelte-ignore attribute_quoted -->
									<Table.Head
										class={index == 0
											? 'rounded-tl-sm'
											: index == headerGroup.headers.length - 1
												? 'rounded-tr-sm'
												: ''}
										colspan={header.colSpan}
									>
										{#if !header.isPlaceholder}
											<FlexRender
												content={header.column.columnDef.header}
												context={header.getContext()}
											/>
										{/if}
									</Table.Head>
								{/each}
							</Table.Row>
						{/each}
					</Table.Header>
					<Table.Body>
						{#each table.getRowModel().rows as row (row.id)}
							<Table.Row
								data-state={row.getIsSelected() && 'selected'}
								class="hover:[&,&>svelte-css-wrapper]:[&>th,td]:bg-primary/5"
							>
								{#each row.getVisibleCells() as cell (cell.id)}
									<Table.Cell>
										<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
									</Table.Cell>
								{/each}
							</Table.Row>
						{:else}
							<Table.Row>
								<Table.Cell colspan={columns.length} class="h-24 text-center"
									>No results.</Table.Cell
								>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
			<div class="flex items-center justify-between space-x-2 py-4">
				<div class="flex-1 text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{' '}
					{table.getFilteredRowModel().rows.length} row(s) selected
				</div>

				<Button
					variant="outline"
					size="sm"
					onclick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onclick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
		{/if}
	</div>
</div>
