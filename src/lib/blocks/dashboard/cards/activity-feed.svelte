<script lang="ts">
	import { onMount } from 'svelte';
	import { getLocalTimeZone, today } from '@internationalized/date';

	import type { Database } from '$lib/database/database.types';

	type Activity = Database['pets']['Tables']['activity_feed']['Row'];

	import * as Card from '$lib/components/ui/card/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Separator } from '$lib/components/ui/separator';
	import Button from '$lib/components/ui/button/button.svelte';

	import Activity from '@lucide/svelte/icons/activity';
	import Paw from '@lucide/svelte/icons/paw-print';
	import Calendar from '@lucide/svelte/icons/calendar';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ChevronUp from '@lucide/svelte/icons/chevron-up';
	import Plus from '@lucide/svelte/icons/plus';

	let activityFeedData: Activity[] = $state([]);
	let activityFeedLoading: boolean = $state(true);
	let showMore: boolean = $state(false);

	let value = today(getLocalTimeZone());
	let yesterday = today(getLocalTimeZone()).subtract({ days: 1 });

	onMount(async () => {
		try {
			activityFeedData = await fetch('/api/dashboard/activity-feed').then((r) => r.json());
		} finally {
			activityFeedLoading = false;
		}
	});
</script>

<Card.Root>
	<Card.Header class="cursor-grab active:cursor-grabbing">
		<Card.Title class="flex items-center gap-2"><Activity size={12} />Activity Feed</Card.Title>
	</Card.Header>
	<Separator />
	<Card.Content class="flex cursor-default flex-col gap-2">
		{#if activityFeedLoading}
			<div class="flex flex-col gap-2">
				<Skeleton class="h-[20px] w-full rounded-lg" />
				<Skeleton class="h-[20px] w-75 rounded-lg" />
			</div>
		{:else if activityFeedData.length == 0}
			<div class="flex h-20 flex-col items-center justify-center gap-2 text-muted-foreground">
				<Plus size={14} />
				<p>Add data to see recent activity</p>
			</div>
		{:else}
			{#each activityFeedData as activity, index (activity.id)}
				{@const dayIsToday =
					new Date(activity.created_at).getDate() == value.day &&
					new Date(activity.created_at).getMonth() + 1 == value.month &&
					new Date(activity.created_at).getFullYear() == value.year}
				{@const dayIsYesterday =
					new Date(activity.created_at).getDate() == yesterday.day &&
					new Date(activity.created_at).getMonth() + 1 == yesterday.month &&
					new Date(activity.created_at).getFullYear() == yesterday.year}
				<div
					class="flex cursor-default flex-row gap-4 rounded-lg p-2 transition-all duration-150 hover:bg-input/50 {!showMore &&
					index > 3
						? 'hidden'
						: ''}"
				>
					<!-- icon -->
					{#if activity.activity_type == 'pet_added'}
						<div
							class="flex h-14 w-14 items-center justify-center rounded-lg border border-green-600/50 bg-green-500/50 dark:bg-green-400/25"
						>
							<Paw size={14} />
						</div>
					{/if}
					{#if activity.activity_type == 'pet_deleted'}
						<div
							class="flex h-14 w-14 items-center justify-center rounded-lg border border-red-600/50 bg-red-500/50 dark:bg-red-400/25"
						>
							<Paw size={14} />
						</div>
					{/if}
					{#if activity.activity_type == 'appointment_added'}
						<div
							class="flex h-14 w-14 items-center justify-center rounded-lg border border-indigo-600/50 bg-indigo-500/50 dark:bg-indigo-400/25"
						>
							<Calendar size={14} />
						</div>
					{/if}

					<!-- main text -->
					<div class="flex flex-col gap-1">
						{#if activity.activity_type == 'pet_added'}
							<p class="text-base font-medium">{activity.activity_description} 🎉</p>
							<p class="text-sm text-muted-foreground">
								New {activity.pet_species}
								{activity.pet_breed ? '(' + activity.pet_breed + ')' : ''} added
							</p>
						{/if}
						{#if activity.activity_type == 'pet_deleted'}
							<p class="text-base font-medium">{activity.activity_description} ☹️</p>
							<p class="text-sm text-muted-foreground">All data has been deleted</p>
						{/if}
						{#if activity.activity_type == 'appointment_added'}
							<p class="text-base font-medium">
								New Appointment {activity.appointment_type == 'Check Up' ? '🩺' : ''}
							</p>
							<p class="text-sm text-muted-foreground">
								{activity.activity_description.length > 0 ? activity.activity_description : ''}
							</p>
						{/if}
					</div>

					<!-- tag and date -->
					<div class="ml-auto flex flex-col gap-2">
						{#if activity.activity_type == 'pet_added'}
							<Badge
								class="border border-green-600/50 bg-green-500/50 text-card-foreground dark:bg-green-400/25"
								>Pet Added</Badge
							>
						{/if}
						{#if activity.activity_type == 'pet_deleted'}
							<Badge
								class="border border-red-600/50 bg-red-500/50 text-card-foreground dark:bg-red-400/25"
								>Pet Deleted</Badge
							>
						{/if}
						{#if activity.activity_type == 'appointment_added'}
							<Badge
								class="border border-indigo-600/50 bg-indigo-500/50 text-card-foreground dark:bg-indigo-400/25"
								>Appointment Added</Badge
							>
						{/if}

						<p class="text-right text-sm text-muted-foreground">
							{dayIsToday
								? 'Today'
								: dayIsYesterday
									? 'Yesterday'
									: new Date(activity.created_at).toLocaleDateString(
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
		{/if}
	</Card.Content>
	{#if activityFeedData.length > 4}
		<Card.Footer>
			<Button
				variant={'ghost'}
				class="cursor-pointer"
				onclick={() => {
					showMore = !showMore;
				}}
			>
				{#if showMore}
					Show less <ChevronUp />
				{:else}
					Show more <ChevronDown />
				{/if}
			</Button>
		</Card.Footer>
	{/if}
</Card.Root>
