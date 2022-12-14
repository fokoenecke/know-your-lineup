<script lang="ts">
	import ArtistGrid from '$lib/components/artist-grid/ArtistGrid.svelte';
	import FilterControl from '$lib/components/FilterControl.svelte';
	import SortControl from '$lib/components/SortControl.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="controls">
	<SortControl />
	<FilterControl />
</div>
<ArtistGrid artists={data.artists} />

<style>
	.controls {
		display: flex;
		justify-content: space-between;
		padding-left: 1rem;
		padding-right: 1rem;
	}
</style>
