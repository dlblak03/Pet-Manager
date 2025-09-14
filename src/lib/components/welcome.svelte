<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn, type WithElementRef } from '$lib/utils.js';
	import { Separator } from './ui/separator/index.js';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import { toggleMode } from 'mode-watcher';

	let {
		ref = $bindable(null),
		class: className,
		email = '',
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & { email?: string } = $props();

	const id = $props.id();
</script>

<div class={cn('flex flex-col gap-6', className)} bind:this={ref} {...restProps}>
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
	<div class="flex flex-col gap-6">
		<div class="flex flex-col items-center gap-4">
			<div class="flex flex-col items-center gap-2 font-medium">
				<div class="flex size-8 items-center justify-center rounded-md text-5xl">🐶</div>
			</div>
			<h1 class="text-xl font-bold">Check Your Email</h1>
		</div>
		<div class="flex flex-col items-center gap-2">
			<div class="text-center text-base text-balance">We've sent a magin link to</div>
			<div class="text-center text-base text-balance text-primary">{email}</div>
		</div>
		<div class="text-center text-base text-balance">
			Click the link in your email to sign in to Pet Manager.
		</div>
		<Separator />
		<div class="text-center text-xs text-balance text-muted-foreground">
			The magic link will expire in 1 hour.
		</div>
		<div
			class="text-center text-xs text-balance text-muted-foreground *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary"
		>
			Didn't receive the email? Check your spam folder or <a href="/sign-in">request a new link</a>.
		</div>
	</div>
</div>
