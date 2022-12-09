<script lang="ts">
	import ArtistGrid from '$lib/components/artist-grid/ArtistGrid.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<ArtistGrid artists={data.artists} />
