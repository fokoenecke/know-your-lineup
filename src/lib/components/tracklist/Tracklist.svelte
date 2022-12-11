<script lang="ts">
	import type { DeezerArtist, DeezerTrack } from '$lib/deezer';
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	import Track from './Track.svelte';

	export let artist: DeezerArtist;

	const fetchTracklist = (async () => {
		const response = await fetch(`/api/proxy/${encodeURIComponent(artist.tracklist)}`);
		const repsonseData = await response.json();

		return repsonseData.data as DeezerTrack[];
	})();

	fetchTracklist.then(() => dispatch('loaded'));
</script>

{#await fetchTracklist then tracklist}
	<ul class="tracklist">
		{#each tracklist.splice(0, 16) as track (track.id)}
			{#if track.preview}
				<li transition:fade={{ duration: 100 }}>
					<Track {track} />
				</li>
			{/if}
		{/each}
	</ul>
{:catch}
	an error occured!
{/await}

<style>
	.tracklist {
		padding: 0;

		display: grid;
		grid-gap: 0.75rem;
		grid-template-columns: repeat(auto-fill, minmax(min(8rem, 100%), 1fr));
		grid-auto-rows: minmax(min-content, max-content);
		grid-auto-flow: dense;
	}

	.tracklist li {
		width: 100%;
		display: flex;
	}
</style>
