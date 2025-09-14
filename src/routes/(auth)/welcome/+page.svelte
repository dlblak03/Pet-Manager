<script lang="ts">
	import Welcome from "$lib/components/welcome.svelte";
	import type { PageProps } from './$types';

    let { data }: PageProps = $props();
</script>

<svelte:head>
    <title>Pet Manager | Welcome</title>
</svelte:head>

<div class="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
	<div class="w-full max-w-md">
		<Welcome email={data.email || undefined} />
	</div>
</div>
