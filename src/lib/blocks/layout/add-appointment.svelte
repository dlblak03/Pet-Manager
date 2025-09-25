<script lang="ts">
	import {
		DateFormatter,
		getLocalTimeZone,
	} from '@internationalized/date';

	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';

	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';

	let open = false;

	const df = new DateFormatter(navigator.language || 'en-US', {
		dateStyle: 'short'
	});

	export let appointmentinput;

	const availableTypes = [
		{ label: 'Checkup', value: 'Checkup' },
		{ label: 'Vaccination', value: 'Vaccination' },
		{ label: 'Grooming', value: 'Grooming' },
		{ label: 'Surgery', value: 'Surgery' }
	];
</script>

<div class="flex w-full flex-col gap-1.5">
	<div class="flex gap-4 grow">
		<div class="flex flex-col grow gap-1.5">
			<Label for="date" class="px-1">Date</Label>
			<Popover.Root bind:open>
				<Popover.Trigger id="date">
					{#snippet child({ props })}
						<Button {...props} variant="outline" class="justify-between font-normal">
							{appointmentinput.date
								? appointmentinput.date.toDate(getLocalTimeZone()).toLocaleDateString()
								: 'Select date'}
							<ChevronDownIcon />
						</Button>
					{/snippet}
				</Popover.Trigger>
				<Popover.Content class="w-auto overflow-hidden p-0" align="start">
					<Calendar
						type="single"
						bind:value={appointmentinput.date}
						onValueChange={() => {
							open = false;
						}}
						captionLayout="dropdown"
					/>
				</Popover.Content>
			</Popover.Root>
		</div>
		<div class="flex flex-col gap-1.5">
			<Label for="time" class="px-1">Time</Label>
			<Input
				type="time"
				id="time"
				step="1"
				bind:value={appointmentinput.time}
				class="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
			/>
		</div>
	</div>
</div>

<div class="flex w-full flex-col gap-1.5">
	<Label for="type">Appointment Type</Label>
	<Select.Root type="single" name="type" bind:value={appointmentinput.type}>
		<Select.Trigger id="type" class="w-full cursor-pointer bg-white">
			{availableTypes.find((t) => t.label === appointmentinput.type)?.label}
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Types</Select.Label>
				{#each availableTypes as type (type)}
					<Select.Item value={type.value} label={type.value}>
						{type.label}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
</div>

<div class="flex w-full flex-col gap-1.5">
	<Label for="veterinarian">Veterinarian</Label>
	<Input autocomplete={'off'} bind:value={appointmentinput.veterinarian} type="text" id="veterinarian" name="veterinarian" placeholder="" />
</div>

<div class="flex w-full flex-col gap-1.5">
	<Label for="clinic">Clinic</Label>
	<Input autocomplete={'off'} bind:value={appointmentinput.clinicName} type="text" id="clinic" name="clinic" placeholder="" />
</div>

<div class="flex w-full flex-col gap-1.5">
	<Label for="address">Address</Label>
	<Input autocomplete={'off'} bind:value={appointmentinput.clinicAddress} type="text" id="address" name="address" placeholder="" />
</div>

<div class="flex w-full flex-col gap-1.5">
	<Label for="phone">Phone</Label>
	<Input autocomplete={'off'} bind:value={appointmentinput.clinicName} type="text" id="phone" name="phone" placeholder="" />
</div>

<div class="flex w-full flex-col gap-1.5">
	<Label for="notes">Notes</Label>
	<Input autocomplete={'off'} bind:value={appointmentinput.notes} type="text" id="notes" name="notes" placeholder="" />
</div>