<script lang="ts">
	import Welcome from "$lib/components/welcome.svelte";
</script>

<svelte:head>
    <title>Pet Manager | Welcome</title>
</svelte:head>

<div class="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
	<div class="w-full max-w-sm">
		<Welcome />
	</div>
</div>
