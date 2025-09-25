<script lang="ts">
	import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';

	import { cn } from '$lib/utils.js';

	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';

	import CalendarIcon from '@lucide/svelte/icons/calendar';

	const df = new DateFormatter(navigator.language || 'en-US', {
		dateStyle: 'short'
	});

	export let petinput;

	const availableSpecies = [
		{ label: 'Dog', value: 'Dog' },
		{ label: 'Cat', value: 'Cat' }
	];

	const availableGenders = [
		{ label: 'Male', value: 'Male' },
		{ label: 'Female', value: 'Female' }
	];
</script>

<div class="flex w-full flex-col gap-1.5">
	<Label for="name">Pet Name</Label>
	<Input
		autocomplete={'off'}
		bind:value={petinput.petName}
		type="text"
		id="petname"
		name="petname"
		placeholder=""
	/>
</div>

<div class="flex w-full flex-col gap-1.5">
	<Label for="species">Species</Label>
	<Select.Root type="single" name="species" bind:value={petinput.species}>
		<Select.Trigger id="species" class="w-full cursor-pointer bg-white">
			{availableSpecies.find((s) => s.label === petinput.species)?.label}
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Species</Select.Label>
				{#each availableSpecies as species (species)}
					<Select.Item value={species.value} label={species.value}>
						{species.label}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
</div>

<div class="flex w-full flex-col gap-1.5">
	<Label for="breed">Breed</Label>
	<Input
		autocomplete={'off'}
		bind:value={petinput.breed}
		type="text"
		id="breed"
		name="breed"
		placeholder=""
	/>
</div>

<div class="flex w-full flex-col gap-1.5">
	<Label for="gender">Gender</Label>
	<Select.Root type="single" name="gender" bind:value={petinput.gender}>
		<Select.Trigger id="gender" class="w-full cursor-pointer bg-white">
			{availableGenders.find((s) => s.label === petinput.gender)?.label}
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Genders</Select.Label>
				{#each availableGenders as gender (gender)}
					<Select.Item value={gender.value} label={gender.value}>
						{gender.label}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
</div>

<div class="flex w-full flex-col gap-1.5">
	<Label for="birthday">Birth Day</Label>
	<Popover.Root>
		<Popover.Trigger
			id={'birthday'}
			class={cn(
				buttonVariants({
					variant: 'outline',
					class: 'justify-start text-left font-normal'
				}),
				!petinput.birthDate && 'text-muted-foreground'
			)}
		>
			<CalendarIcon />
			{petinput.birthDate
				? df.format(petinput.birthDate.toDate(getLocalTimeZone()))
				: 'Pick a date'}
		</Popover.Trigger>
		<Popover.Content class="w-auto p-0">
			<Calendar type="single" bind:value={petinput.birthDate} captionLayout="dropdown" />
		</Popover.Content>
	</Popover.Root>
</div>

<div class="flex w-full flex-col gap-1.5">
	<Label for="color">Color</Label>
	<Input
		autocomplete={'off'}
		bind:value={petinput.color}
		type="text"
		id="color"
		name="color"
		placeholder=""
	/>
</div>

<div class="flex w-full flex-col gap-1.5">
	<Label for="microchip">Microchip ID</Label>
	<Input
		autocomplete={'off'}
		bind:value={petinput.microchip}
		type="text"
		id="microchip"
		name="microchip"
		placeholder=""
	/>
</div>
