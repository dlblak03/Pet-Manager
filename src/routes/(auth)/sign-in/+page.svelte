<script lang="ts">
	import { enhance } from '$app/forms';
	import { toggleMode } from 'mode-watcher';

	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';

	const id = $props.id();

	let loggingIn: boolean = $state(false);
</script>

<svelte:head>
	<title>Pet Manager | Sign-in</title>
</svelte:head>

<div class="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
	<div class="w-full max-w-sm">
		<div class={'flex flex-col gap-6'}>
			<div class="absolute top-3 right-5">
				<Button onclick={toggleMode} variant="outline" size="icon">
					<SunIcon
						class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
					/>
					<MoonIcon
						class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
					/>
					<span class="sr-only">Toggle theme</span>
				</Button>
			</div>
			<form
				method="POST"
				action="?/signin"
				use:enhance={() => {
					loggingIn = true;

					return async ({ result, update }) => {
						if (result.type === 'redirect') {
							window.location.href = result.location;
						} else {
							await update();
						}

						loggingIn = false;
					};
				}}
			>
				<div class="flex flex-col gap-6">
					<div class="flex flex-col items-center gap-4">
						<div class="flex flex-col items-center gap-2 font-medium">
							<div class="flex size-8 items-center justify-center rounded-md text-5xl">🐶</div>
						</div>
						<h1 class="text-xl font-bold">Sign in to Pet Manager</h1>
					</div>
					<div class="flex flex-col gap-6">
						<div class="grid gap-3">
							<Label for="email-{id}">Email</Label>
							<Input
								id="email-{id}"
								autocomplete="email"
								type="email"
								name="email"
								placeholder="me@example.com"
								required
							/>
						</div>
						<Button disabled={loggingIn} type="submit" class="w-full">Sign in</Button>
					</div>
				</div>
			</form>
			<!-- <div
		class="text-center text-xs text-balance text-muted-foreground *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary"
	>
		By signing in, you agree to our <a href="##">Terms of Service</a>
		and <a href="##">Privacy Policy</a>.
	</div> -->
		</div>
	</div>
</div>
