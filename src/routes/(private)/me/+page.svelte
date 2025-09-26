<script lang="ts">
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';

	import * as Card from '$lib/components/ui/card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	import Trash from '@lucide/svelte/icons/trash';
	import Check from '@lucide/svelte/icons/check';
	import X from '@lucide/svelte/icons/x';

	let { data }: PageProps = $props();
	let { success, owner_name, owner_email, language, time_zone } = $derived(data);

	let generalInformationLoading: boolean = $state(false);
	let generalInformationEmailRequired: boolean = $state(false);
	let generalInformationSuccess: boolean = $state(false);
	let generalInformationFailure: boolean = $state(false);
	let generalInformationResponseTimeout: any;

	// svelte-ignore state_referenced_locally
	let selectedLanguage: string = $state(language || '');
	const availableLanguages: string[] = ['en', 'de'];
	const friendlyLanguageLabel: { id: string; label: string }[] = [
		{ id: 'en', label: 'English' },
		{ id: 'de', label: 'Deutsch' }
	];
	// svelte-ignore state_referenced_locally
	let selectedTimezone: string = $state(time_zone || '');
	const availableTimezones = [
		{ label: 'Coordinated Universal Time', value: 'UTC' },
		{ label: 'Central European Time', value: 'Europe/Berlin' },
		{ label: 'Eastern Time', value: 'America/New_York' },
		{ label: 'Pacific Time', value: 'America/Los_Angeles' }
	];
	let localizationLoading: boolean = $state(false);
	let localizationSuccess: boolean = $state(false);
	let localizationFailure: boolean = $state(false);
	let localizationResponseTimeout: any;

	const languageTrigger = $derived(
		friendlyLanguageLabel.find((l) => l.id === selectedLanguage)?.label ?? 'Select a language'
	);
	const timezoneTrigger = $derived(
		availableTimezones.find((t) => t.value === selectedTimezone)?.label ?? 'Select a timezone'
	);
</script>

<svelte:head>
	<title>Pet Manager | Me</title>
	<meta
		name="description"
		content="Update your Pet Manager account settings including name, email, language preferences, and timezone settings."
	/>
</svelte:head>

<div class="flex grow flex-col items-center gap-10 px-10 py-10">
	{#if success}
		<div class="flex w-full max-w-4xl flex-col gap-4">
			<div>
				<p class="text-base font-semibold">General Information</p>
				<p class="text-muted-foreground">Manage your basic account details</p>
			</div>
			<Card.Root class="dark:bg-zinc-800">
				<form
					class="flex flex-col gap-6"
					method="POST"
					action="?/updategeneralinformation"
					use:enhance={() => {
						generalInformationLoading = true;

						return async ({ result, update }) => {
							generalInformationLoading = false;

							if (generalInformationResponseTimeout)
								clearTimeout(generalInformationResponseTimeout);

							if (result.type == 'failure') {
								if (result.data?.emailRequired) {
									generalInformationEmailRequired = true;
								} else {
									generalInformationEmailRequired = false;
								}
								generalInformationSuccess = false;
								generalInformationFailure = true;
								await update({ reset: false });
							} else {
								generalInformationEmailRequired = false;
								generalInformationSuccess = true;
								generalInformationFailure = false;
								await update({ reset: false });
							}

							generalInformationResponseTimeout = setTimeout(() => {
								generalInformationSuccess = false;
								generalInformationFailure = false;
							}, 3000);
						};
					}}
				>
					<Card.Content class="flex flex-col gap-4">
						<div>
							<div class="flex w-full max-w-sm flex-col gap-2">
								<Label for="name">Name</Label>
								<Input autocomplete={'name'} type="text" id="name" name="name" value={owner_name} />
							</div>
						</div>

						<div>
							<div class="flex w-full max-w-sm flex-col gap-2">
								<Label for="email">Email Address</Label>
								<Input
									aria-invalid={generalInformationEmailRequired}
									autocomplete="email"
									type="email"
									id="email"
									name="email"
									value={owner_email}
								/>
							</div>
						</div>
					</Card.Content>
					<Card.Footer class="flex gap-4">
						<Button
							disabled={generalInformationLoading}
							type="submit"
							variant="save"
							class="w-max flex-0 cursor-pointer"
						>
							{#if generalInformationLoading}
								<div
									class="h-4 w-4 animate-spin rounded-full border-1 border-foreground border-t-primary"
								></div>
							{/if}
							Save
						</Button>
						{#if generalInformationFailure}
							<div class={buttonVariants({ variant: 'destructive' })}>
								<X />Uh oh, something went wrong! Please try again.
							</div>
						{/if}

						{#if generalInformationSuccess}
							<div class={buttonVariants({ variant: 'save' })}>
								<Check />Successfully saved general information.
							</div>
						{/if}
					</Card.Footer>
				</form>
			</Card.Root>
		</div>

		<div class="flex w-full max-w-4xl flex-col gap-4">
			<div>
				<p class="text-base font-semibold">Localization</p>
				<p class="text-muted-foreground">Adjust your language and time zone settings</p>
			</div>
			<Card.Root class="dark:bg-zinc-800">
				<form
					class="flex flex-col gap-6"
					method="POST"
					action="?/updatelocalization"
					use:enhance={() => {
						localizationLoading = true;

						return async ({ result, update }) => {
							localizationLoading = false;

							if (localizationResponseTimeout) clearTimeout(localizationResponseTimeout);

							if (result.type == 'failure') {
								localizationSuccess = false;
								localizationFailure = true;
								await update({ reset: false });
							} else {
								localizationSuccess = true;
								localizationFailure = false;
								await update({ reset: false });
							}

							localizationResponseTimeout = setTimeout(() => {
								localizationSuccess = false;
								localizationFailure = false;
							}, 3000);
						};
					}}
				>
					<Card.Content class="flex flex-col gap-4">
						<div>
							<div class="flex w-full max-w-sm flex-col gap-2">
								<Label for="language">Language</Label>
								<Select.Root type="single" name="language" bind:value={selectedLanguage}>
									<Select.Trigger id="language" class="w-sm cursor-pointer bg-white">
										{languageTrigger}
									</Select.Trigger>
									<Select.Content>
										<Select.Group>
											<Select.Label>Languages</Select.Label>
											{#each availableLanguages as language (language)}
												<Select.Item value={language} label={language}>
													{friendlyLanguageLabel.find((l) => l.id === language)?.label}
												</Select.Item>
											{/each}
										</Select.Group>
									</Select.Content>
								</Select.Root>
							</div>
						</div>

						<div>
							<div class="flex w-full max-w-sm flex-col gap-2">
								<Label for="timezone">Timezone</Label>
								<Select.Root type="single" name="timezone" bind:value={selectedTimezone}>
									<Select.Trigger id="timezone" class="w-sm cursor-pointer bg-white">
										{timezoneTrigger}
									</Select.Trigger>
									<Select.Content>
										<Select.Group>
											<Select.Label>Timezones</Select.Label>
											{#each availableTimezones as timezone (timezone.value)}
												<Select.Item value={timezone.value} label={timezone.label}>
													{timezone.label}
												</Select.Item>
											{/each}
										</Select.Group>
									</Select.Content>
								</Select.Root>
							</div>
						</div>
					</Card.Content>
					<Card.Footer class="flex gap-4">
						<Button
							disabled={localizationLoading}
							type="submit"
							variant="save"
							class="w-max flex-0 cursor-pointer"
						>
							{#if localizationLoading}
								<div
									class="h-4 w-4 animate-spin rounded-full border-1 border-foreground border-t-primary"
								></div>
							{/if}
							Save
						</Button>
						{#if localizationFailure}
							<div class={buttonVariants({ variant: 'destructive' })}>
								<X />Uh oh, something went wrong! Please try again.
							</div>
						{/if}

						{#if localizationSuccess}
							<div class={buttonVariants({ variant: 'save' })}>
								<Check />Successfully saved localization.
							</div>
						{/if}
					</Card.Footer>
				</form>
			</Card.Root>
		</div>
	{/if}

	<div class="flex w-full max-w-4xl flex-col gap-4">
		<div>
			<p class="text-base font-semibold">Danger Zone</p>
			<p class="text-muted-foreground">Permanent and irreversible actions</p>
		</div>
		<Card.Root class="border-2 border-dashed border-red-500 dark:bg-zinc-800">
			<Card.Content class="flex flex-col gap-4">
				<p class="text-base">
					Permanently delete my account, including all pets, photos, and personal information.
				</p>
			</Card.Content>
			<Card.Footer>
				<Button variant={'destructive'} class="w-max flex-0 cursor-pointer"
					><Trash />Delete account</Button
				>
			</Card.Footer>
		</Card.Root>
	</div>
</div>
