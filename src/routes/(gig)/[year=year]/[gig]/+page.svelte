<script lang="ts">
	import ArtistGrid from '$lib/components/artist-grid/ArtistGrid.svelte';
	import SortControl from '$lib/components/SortControl.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<SortControl />
<ArtistGrid artists={data.artists} />
