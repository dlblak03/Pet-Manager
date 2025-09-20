<script lang="ts">
	import { onMount } from 'svelte';
	import { getLocalTimeZone, today } from '@internationalized/date';

	import * as Card from '$lib/components/ui/card/index.js';

	import type { Database } from '$lib/database/database.types';

	type Appointment = Database['pets']['Tables']['appointments']['Row'];
	type Appointments = Appointment & { pet: { name: string } };

	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import CalendarDay from '$lib/components/ui/calendar/calendar-day.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';

	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import Clock from '@lucide/svelte/icons/clock';
	import CircleCheckBig from '@lucide/svelte/icons/circle-check-big';
	import { Separator } from '$lib/components/ui/separator';

	let appointmentsData: Appointments[] = $state([]);
	let appointmentsLoading: boolean = $state(true);

	let value = today(getLocalTimeZone());
	let yesterday = today(getLocalTimeZone()).subtract({ days: 1 });

	onMount(async () => {
		try {
			appointmentsData = await fetch('/api/dashboard/appointments').then((r) => r.json());
		} finally {
			appointmentsLoading = false;
		}
	});
</script>

<Card.Root>
	<Card.Header class="cursor-grab active:cursor-grabbing">
		<Card.Title class="flex items-center gap-2"><CalendarIcon size={12} />Appointments</Card.Title>
	</Card.Header>
	<Separator />
	<Card.Content class="relative flex flex-col gap-2 cursor-default">
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
				{value}
				numberOfMonths={2}
			>
				{#snippet day({ day })}
					{@const dayOfAppointment = appointmentsData.find((a) => {
						const appointmentDate = new Date(a.appointment_date);
						return (
							appointmentDate.getDate() == day.day &&
							appointmentDate.getMonth() + 1 == day.month &&
							appointmentDate.getFullYear() == day.year
						);
					})}
					<CalendarDay class="flex flex-col items-center">
						{day.day}
						{#if dayOfAppointment}
							{@const dayIsToday = appointmentsData.find((a) => {
								const appointmentDate = new Date(a.appointment_date);
								return (
									appointmentDate.getDate() == value.day &&
									appointmentDate.getMonth() + 1 == value.month &&
									appointmentDate.getFullYear() == value.year
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
			<div class="mt-2">
				<p class="text-base font-medium">Next 3 Appointments</p>
			</div>
			{#if appointmentsData.length > 0}
				{#each appointmentsData as appointment}
					{@const dayIsToday =
						new Date(appointment.appointment_date).getDate() == value.day &&
						new Date(appointment.appointment_date).getMonth() + 1 == value.month &&
						new Date(appointment.appointment_date).getFullYear() == value.year}
					{@const dayIsYesterday =
						new Date(appointment.appointment_date).getDate() == yesterday.day &&
						new Date(appointment.appointment_date).getMonth() + 1 == yesterday.month &&
						new Date(appointment.appointment_date).getFullYear() == yesterday.year}
					<div
						class="flex cursor-default flex-row gap-4 rounded-lg p-2 transition-all duration-150 hover:bg-input/50"
					>
						<!-- icon -->
						{#if appointment.appointment_type == 'Check Up'}
							<div
								class="flex h-14 w-14 items-center justify-center rounded-lg border border-orange-600/50 bg-orange-500/50 dark:bg-orange-400/25"
							>
								<CircleCheckBig size={14} />
							</div>
						{/if}

						<!-- main text -->
						<div class="flex flex-col gap-1">
							<p class="text-base font-medium">
								{appointment.pet.name} – {appointment.appointment_type}
							</p>
							<p class="text-sm text-muted-foreground">
								{appointment.veterinarian} • {new Date(
									appointment.appointment_date
								).toLocaleTimeString(navigator.language || 'en-US', {
									hour: '2-digit',
									minute: '2-digit'
								})}
							</p>
						</div>

						<!-- date -->
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
													year: '2-digit'
												}
											)}
							</p>
						</div>
					</div>
				{/each}
			{:else}
				<div class="flex h-20 flex-col items-center justify-center gap-2 text-muted-foreground">
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
