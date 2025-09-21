<script lang="ts">
	import type { PageProps } from './$types';

	import * as Card from '$lib/components/ui/card/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	import Trash from '@lucide/svelte/icons/trash';

	let { data }: PageProps = $props();
	let { owner_name, owner_email, language } = $derived(data);

	// svelte-ignore state_referenced_locally
	let fullName: string = $state(owner_name || '');
	// svelte-ignore state_referenced_locally
	let email: string = $state(owner_email || '');
</script>

<svelte:head>
	<title>Pet Manager | Me</title>
</svelte:head>

<div class="flex grow flex-col items-center gap-10 px-10 py-6">
	<div class="flex w-full max-w-4xl flex-col gap-4">
		<div>
			<p class="text-base font-semibold">General Information</p>
			<p class="text-muted-foreground">Manage your basic account details</p>
		</div>
		<Card.Root class="dark:bg-zinc-800">
			<Card.Content class="flex flex-col gap-4">
				<div>
					<div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label for="name">Full Name</Label>
						<Input type="text" id="name" name="name" placeholder="" bind:value={owner_name} />
						<p class="text-sm text-muted-foreground">Enter your first and last name.</p>
					</div>
				</div>

				<div>
					<div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label for="email">Email Address</Label>
						<Input type="email" id="email" name="email" placeholder="" bind:value={owner_email} />
					</div>
				</div>
			</Card.Content>
			<Card.Footer>
				<Button variant={'save'} class="w-max flex-0 cursor-pointer">Save</Button>
			</Card.Footer>
		</Card.Root>
	</div>

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
