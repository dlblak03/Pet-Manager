import type { ColumnDef } from "@tanstack/table-core";

import { renderComponent } from "$lib/components/ui/data-table/index.js";
import { Checkbox } from "$lib/components/ui/checkbox/index.js";

import type { Database } from '$lib/database/database.types';

import DataTableNameButton from "./data-table-name-button.svelte";
import DataTableSpeciesButton from "./data-table-species-button.svelte";
import DataTableBirthDateButton from "./data-table-birth-date-button.svelte";
import DataTableActions from "./data-table-actions.svelte";

type Pet = Database['pets']['Tables']['pets']['Row'];

export const columns: ColumnDef<Pet>[] = [
    {
        id: "select",
        header: ({ table }) =>
            renderComponent(Checkbox, {
                checked: table.getIsAllPageRowsSelected(),
                indeterminate:
                    table.getIsSomePageRowsSelected() &&
                    !table.getIsAllPageRowsSelected(),
                onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
                "aria-label": "Select all",
                class: 'border-foreground/50'
            }),
        cell: ({ row }) =>
            renderComponent(Checkbox, {
                checked: row.getIsSelected(),
                onCheckedChange: (value) => row.toggleSelected(!!value),
                "aria-label": "Select row",
                class: 'border-foreground/50'
            }),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return renderComponent(DataTableNameButton, {
                onclick: column.getToggleSortingHandler(),
            })
        }
    },
    {
        accessorKey: 'species',
        header: ({ column }) => {
            return renderComponent(DataTableSpeciesButton, {
                onclick: column.getToggleSortingHandler(),
            })
        },
        filterFn: 'equalsString'
    },
    {
        accessorKey: 'breed',
        header: 'Breed'
    },
    {
        accessorKey: 'gender',
        header: 'Gender',
        filterFn: 'equalsString'
    },
    {
        accessorKey: 'color',
        header: 'Color'
    },
    {
        accessorKey: 'birth_date',
        header: ({ column }) => {
            return renderComponent(DataTableBirthDateButton, {
                onclick: column.getToggleSortingHandler(),
            })
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return renderComponent(DataTableActions, { id: row.original.id });
        }
    },
];