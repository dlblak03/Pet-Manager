<script lang="ts">
	import type { LayoutProps } from './$types';
	import { invalidate } from '$app/navigation';

	import { toggleMode } from 'mode-watcher';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';

	import X from '@lucide/svelte/icons/x';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import User from '@lucide/svelte/icons/circle-user-round';
	import PawPrint from '@lucide/svelte/icons/paw-print';
	import Calendar from '@lucide/svelte/icons/calendar';
	import HeartPulse from '@lucide/svelte/icons/heart-pulse';
	import LogOut from '@lucide/svelte/icons/log-out';
	import AddPet from '$lib/blocks/layout/add-pet.svelte';

	import AddAppointment from '$lib/blocks/layout/add-appointment.svelte';

	let { data, children }: LayoutProps = $props();
	let { pathName, headerTitle } = $derived(data);

	let addSheet: boolean = $state(false);

	let addPetSheet: boolean = $state(false);
	let addPetInput = $state({
		petName: '',
		species: 'Dog',
		breed: '',
		gender: 'Male',
		birthDay: undefined,
		color: '',
		microchip: ''
	});
	let addAppointmentSheet: boolean = $state(false);
	let addAppointmentInput = $state({
		date: '',
		time: '',
		type: 'Checkup',
		veterinarian: '',
		clinicName: '',
		clinicAddress: '',
		clinicPhone: '',
		duration: '',
		notes: ''
	});
	let addMedicalRecordsSheet: boolean = $state(false);
	let addVaccinationSheet: boolean = $state(false);

	let addSaveLoading: boolean = $state(false);

	const resetSheets = () => {
		addPetSheet = false;
		addPetInput = {
			petName: '',
			species: 'Dog',
			breed: '',
			gender: 'Male',
			birthDay: undefined,
			color: '',
			microchip: ''
		};
		addAppointmentSheet = false;
		addAppointmentInput = {
			date: '',
			time: '',
			type: 'Checkup',
			veterinarian: '',
			clinicName: '',
			clinicAddress: '',
			clinicPhone: '',
			duration: '',
			notes: ''
		};
		addMedicalRecordsSheet = false;
		addVaccinationSheet = false;
	};

	const getSheetTitle = () => {
		if (addPetSheet) {
			return 'Add Pet';
		}
		if (addAppointmentSheet) {
			return 'Add Appointment';
		}
		if (addMedicalRecordsSheet) {
			return 'Add Medical Record';
		}
		if (addVaccinationSheet) {
			return 'Add Vaccination';
		}
	};

	const saveData = async () => {
		addSaveLoading = true;

		if (addPetSheet) {
			if (addPetInput.petName == '') return;
			if (addPetInput.species == '') return;
			if (addPetInput.gender == '') return;

			const addPetResponse = await fetch('/api/mypets', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(addPetInput)
			}).then((r) => r.json());

			if (addPetResponse.success) {
				addSaveLoading = false;
				addPetSheet = false;
				addSheet = false;
			}

			await invalidate('supabase:db:pets');
		}
		if (addAppointmentSheet) {
			const addAppointmentResponse = await fetch('/api/appointments', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(addAppointmentInput)
			}).then((r) => r.json());

			if (addAppointmentResponse.success) {
				addSaveLoading = false;
				addAppointmentSheet = false;
				addSheet = false;
			}
		}
	};
</script>

<div class="hidden bg-white bg-zinc-100 dark:bg-zinc-800 dark:bg-zinc-950"></div>

<div
	class="flex min-h-[100vh] min-w-[100vw] p-3 transition-all duration-300 {pathName == 'dashboard'
		? 'bg-white dark:bg-zinc-950'
		: 'bg-white dark:bg-zinc-950'}"
>
	<div
		class="flex grow flex-col rounded-lg transition-all duration-300 {pathName == 'dashboard'
			? 'bg-white dark:bg-zinc-950'
			: 'bg-zinc-100 dark:bg-zinc-900'}"
	>
		<header
			class="flex h-[37px] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear"
		>
			<div class="flex w-full items-center gap-1 px-2 lg:gap-2 lg:px-2">
				{#if pathName == 'me'}
					<a
						href={'/mypets'}
						aria-label="View my pets"
						class="inline-flex size-9 shrink-0 items-center justify-center gap-2 rounded-md border bg-background text-sm font-medium whitespace-nowrap shadow-xs transition-all outline-none hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:border-input dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
					>
						<span> 🐶 </span>
					</a>
				{/if}
				<a
					href={pathName == 'dashboard' ? '/mypets' : '/dashboard'}
					aria-label={pathName == 'dashboard' ? 'View my pets' : 'View dashboard'}
					class="inline-flex size-9 shrink-0 items-center justify-center gap-2 rounded-md border bg-background text-sm font-medium whitespace-nowrap shadow-xs transition-all outline-none hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:border-input dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
				>
					<span
						class={pathName == 'dashboard'
							? 'scale-100 rotate-0 !transition-all duration-300'
							: 'scale-0 -rotate-90 duration-300'}
					>
						🐶
					</span>
					<span
						class={pathName == 'dashboard'
							? 'absolute scale-0 rotate-90 !transition-all duration-300'
							: 'absolute scale-100 rotate-0 duration-300'}
					>
						<X />
					</span>
				</a>
				<Separator
					orientation="vertical"
					decorative={true}
					class="mx-2 data-[orientation=vertical]:h-6"
				/>
				<h1 class="flex items-center gap-2 text-base font-medium">
					{#if pathName == 'mypets'}
						<PawPrint size={12} />
					{/if}
					{#if pathName == 'me'}
						<User size={12} />
					{/if}
					{headerTitle}
				</h1>
				<div class="ml-auto flex items-center gap-2">
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Button
									class="cursor-pointer border border-green-600/50 bg-green-500/50 text-card-foreground hover:bg-green-600/50 focus-visible:border-green-600/50 focus-visible:ring-green-600/50 dark:bg-green-400/25 dark:hover:bg-green-600/50"
									{...props}
									aria-label="Add new menu"
								>
									<PlusIcon />
									New
								</Button>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="w-56" align="end">
							<DropdownMenu.Label>Add New</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<DropdownMenu.Group>
								<DropdownMenu.Item
									class="cursor-pointer p-2"
									onSelect={() => {
										resetSheets();
										addPetSheet = true;
										addSheet = true;
									}}><PawPrint />Pet</DropdownMenu.Item
								>
							</DropdownMenu.Group>
							<DropdownMenu.Group>
								<DropdownMenu.Item
									class="cursor-pointer p-2"
									onSelect={() => {
										resetSheets();
										addAppointmentSheet = true;
										addSheet = true;
									}}><Calendar />Appointment</DropdownMenu.Item
								>
							</DropdownMenu.Group>
							<DropdownMenu.Sub>
								<DropdownMenu.SubTrigger><HeartPulse />Medical</DropdownMenu.SubTrigger>
								<DropdownMenu.SubContent>
									<DropdownMenu.Item
										class="cursor-pointer p-2"
										onSelect={() => {
											resetSheets();
											addMedicalRecordsSheet = true;
											addSheet = true;
										}}>Medical Record</DropdownMenu.Item
									>
									<DropdownMenu.Item
										class="cursor-pointer p-2"
										onSelect={() => {
											resetSheets();
											addVaccinationSheet = true;
											addSheet = true;
										}}>Vaccination</DropdownMenu.Item
									>
								</DropdownMenu.SubContent>
							</DropdownMenu.Sub>
						</DropdownMenu.Content>
					</DropdownMenu.Root>

					<Separator
						orientation="vertical"
						decorative={true}
						class="mx-2 data-[orientation=vertical]:h-6"
					/>

					<Button onclick={toggleMode} aria-label="Toggle theme" class="cursor-pointer" variant="outline" size="icon">
						<SunIcon
							class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
						/>
						<MoonIcon
							class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
						/>
					</Button>

					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Button class="cursor-pointer" aria-label="View my account" {...props} variant="outline" size="icon">
									<User />
								</Button>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="w-56" align="end">
							<DropdownMenu.Group>
								<DropdownMenu.Item class="p-0">
									<a href="/me" class="flex h-full w-full items-center gap-2 p-2"
										><User />My Account</a
									>
								</DropdownMenu.Item>
							</DropdownMenu.Group>
							<DropdownMenu.Separator />
							<DropdownMenu.Item
								class="p-0"
							>
								<a
									href="/sign-out"
									data-sveltekit-preload-data="off"
									class="flex h-full w-full items-center gap-2 p-2"><LogOut />Sign out</a
								>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			</div>
		</header>

		<div class="flex grow flex-col rounded-b-lg">
			{@render children()}
		</div>
	</div>
</div>

<Sheet.Root bind:open={addSheet}>
	<Sheet.Content side="right" class={'min-w-[300px] gap-0 [&>button:last-child]:hidden'}>
		<Sheet.Header>
			<Sheet.Title class="flex items-center gap-2">
				{#if addPetSheet}
					<PawPrint size={16} />
				{/if}
				{#if addAppointmentSheet}
					<Calendar size={16} />
				{/if}
				{#if addMedicalRecordsSheet}
					<HeartPulse size={16} />
				{/if}
				{#if addVaccinationSheet}
					<HeartPulse size={16} />
				{/if}
				{getSheetTitle()}
			</Sheet.Title>
		</Sheet.Header>
		<Separator class="mt-1" />
		<div class="grid flex-1 auto-rows-min gap-6 p-4">
			{#if addPetSheet}
				<AddPet bind:petinput={addPetInput} />
			{/if}
			{#if addAppointmentSheet}
				<AddAppointment bind:appointmentinput={addAppointmentInput} />
			{/if}
		</div>
		<Separator />
		<Sheet.Footer class={'flex-row justify-end'}>
			<Sheet.Close class={'cursor-pointer ' + buttonVariants({ variant: 'outline' })}
				>Cancel</Sheet.Close
			>
			<Button
				onclick={saveData}
				class={"inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border border-green-600/50 bg-green-500/50 px-4 py-2 text-sm font-medium whitespace-nowrap text-accent-foreground shadow-xs transition-all outline-none hover:bg-green-600/50 focus-visible:border-green-600/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-green-600/50 disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-3 aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:w-auto dark:border-green-600/50 dark:bg-green-400/25 dark:hover:bg-green-600/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"}
			>
				{#if addSaveLoading}
					<div
						class="h-4 w-4 animate-spin rounded-full border-1 border-foreground border-t-primary"
					></div>
				{/if}
				Save
			</Button>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
