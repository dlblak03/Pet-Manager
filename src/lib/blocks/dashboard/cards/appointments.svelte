<script lang="ts">
	import { onMount } from 'svelte';
	import { today as heute } from '@internationalized/date';

	import type { Database } from '$lib/database/database.types';

	type Appointment = Database['pets']['Tables']['appointments']['Row'];
	type Appointments = Appointment & { pet: { name: string } };

	import * as Card from '$lib/components/ui/card/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import CalendarDay from '$lib/components/ui/calendar/calendar-day.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { Separator } from '$lib/components/ui/separator';

	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import Clock from '@lucide/svelte/icons/clock';
	import CircleCheckBig from '@lucide/svelte/icons/circle-check-big';

	let appointments: Appointments[] = $state([]);
	let appointmentsLoading: boolean = $state(true);

	let today = heute('UTC');
	let yesterday = heute('UTC').subtract({ days: 1 });

	type appointmentsResponse = {
		success: boolean;
		appointments: Appointments[] | null;
		appointmentsError: string | null;
	};

	onMount(() => {
		const controller = new AbortController();

		async function fetchAppointments() {
			try {
				const response = await fetch('/api/dashboard/appointments', {
					signal: controller.signal
				});

				if (!response.ok) {
					throw new Error(`HTTP error. Status: ${response.status}`);
				}

				const data: appointmentsResponse = await response.json();

				if (data.success && data.appointments) {
					appointments = data.appointments;
				}
			} catch (error) {
				if (error instanceof Error) {
					if (error.name !== 'AbortError') {
						console.error('Failed to fetch appointments: ', error);
					}
				} else {
					console.error('An unexpected error occurred: ', error);
				}
			} finally {
				appointmentsLoading = false;
			}
		}

		fetchAppointments();

		return () => controller.abort();
	});
</script>

<Card.Root>
	<Card.Header class="cursor-grab active:cursor-grabbing">
		<Card.Title class="flex items-center gap-2"><CalendarIcon size={12} />Appointments</Card.Title>
	</Card.Header>
	<Separator />
	<Card.Content class="relative flex cursor-default flex-col gap-2">
		{#if appointmentsLoading}
			<div class="flex flex-col gap-2">
				<Skeleton class="h-[20px] w-full rounded-lg" />
				<Skeleton class="h-[20px] w-75 rounded-lg" />
			</div>
		{:else}
			<Calendar
				readonly={true}
				type="single"
				class="grow-td grow-th grow-months w-full overflow-auto"
				value={today}
			>
				{#snippet day({ day })}
					{@const dayOfAppointment = appointments.find((a) => {
						const appointmentDate = new Date(a.appointment_date);
						return (
							appointmentDate.getUTCDate() == day.day &&
							appointmentDate.getUTCMonth() + 1 == day.month &&
							appointmentDate.getUTCFullYear() == day.year
						);
					})}
					<CalendarDay class="flex h-10 w-10 flex-col items-center">
						{day.day}
						{#if dayOfAppointment}
							{@const dayIsToday = appointments.find((a) => {
								const appointmentDate = new Date(a.appointment_date);
								return (
									appointmentDate.getUTCDate() == today.day &&
									appointmentDate.getUTCMonth() + 1 == today.month &&
									appointmentDate.getUTCFullYear() == today.year
								);
							})}
							<div
								class="h-1.5 w-1.5 rounded-full border {dayIsToday
									? 'border-white/50 bg-white/50 dark:bg-white/25'
									: 'border-orange-600/50 bg-orange-500/50 dark:bg-orange-400/25'}"
							></div>
						{/if}
					</CalendarDay>
				{/snippet}
			</Calendar>
			<Separator />
			{#if appointments.length > 0}
				{#each appointments as appointment}
					{@const dayIsToday =
						new Date(appointment.appointment_date).getUTCDate() == today.day &&
						new Date(appointment.appointment_date).getUTCMonth() + 1 == today.month &&
						new Date(appointment.appointment_date).getUTCFullYear() == today.year}
					{@const dayIsYesterday =
						new Date(appointment.appointment_date).getUTCDate() == yesterday.day &&
						new Date(appointment.appointment_date).getUTCMonth() + 1 == yesterday.month &&
						new Date(appointment.appointment_date).getUTCFullYear() == yesterday.year}
					<div
						class="flex cursor-default flex-row gap-4 rounded-lg p-2 transition-all duration-150 hover:bg-input/50"
					>
						{#if appointment.appointment_type == 'Checkup'}
							<div
								class="flex h-14 w-14 items-center justify-center rounded-lg border border-orange-600/50 bg-orange-500/50 dark:bg-orange-400/25"
							>
								<CircleCheckBig size={14} />
							</div>
						{/if}

						<div class="flex flex-col gap-1">
							<p class="text-base font-medium">
								{appointment.pet.name} – {appointment.appointment_type}
							</p>
							<p class="text-sm text-muted-foreground">
								{appointment.veterinarian} • {new Date(
									appointment.appointment_date
								).toLocaleTimeString(navigator.language || 'en-US', {
									hour: '2-digit',
									minute: '2-digit',
									timeZone: 'UTC'
								})}
							</p>
						</div>

						<div class="ml-auto flex flex-col gap-2">
							<p class="text-sm text-muted-foreground">
								{dayIsToday
									? 'Today'
									: dayIsYesterday
										? 'Yesterday'
										: new Date(appointment.appointment_date).toLocaleDateString(
												navigator.language || 'en-US',
												{
													month: 'short',
													day: 'numeric',
													year: '2-digit',
													timeZone: 'UTC'
												}
											)}
							</p>
						</div>
					</div>
				{/each}
			{:else}
				<div class="flex h-40 flex-col items-center justify-center gap-2 text-muted-foreground">
					<Clock size={14} />
					<p>No upcoming appointments</p>
				</div>
			{/if}
		{/if}
	</Card.Content>
</Card.Root>

<style type="text/css">
	:global(.grow-months > div:last-child > .flex-col) {
		flex-grow: 1;
	}

	:global(.grow-th th) {
		flex-grow: 1;
	}

	:global(.grow-td td) {
		flex-grow: 1;
	}

	:global(.grow-td td div) {
		justify-self: center;
	}
</style>
