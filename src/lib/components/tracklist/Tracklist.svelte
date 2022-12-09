<script lang="ts">
	import type { DeezerArtist, DeezerTrack } from '$lib/deezer';
	import { MusicIcon } from 'svelte-feather-icons';
	import { fade } from 'svelte/transition';
	import Track from './Track.svelte';

	export let artist: DeezerArtist;

	const fetchTracklist = (async () => {
		const response = await fetch(`/api/proxy/${encodeURIComponent(artist.tracklist)}`);
		const repsonseData = await response.json();
		return repsonseData.data as DeezerTrack[];
	})();
</script>

{#await fetchTracklist}
	<ul class="tracklist">
		{#each [...Array(30).keys()] as i}
			<li class="dummy-track">
				<div class="cover"><MusicIcon size="3x" /></div>
				<span class="title">Track</span>
			</li>
		{/each}
	</ul>
{:then tracklist}
	<ul class="tracklist">
		{#each tracklist.splice(0, 30) as track (track.id)}
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
		grid-template-columns: repeat(auto-fill, minmax(min(6rem, 100%), 1fr));
		grid-auto-rows: minmax(min-content, max-content);
		grid-auto-flow: dense;
	}

	.tracklist li {
		width: 100%;
		display: flex;
	}

	.dummy-track {
		display: flex;
		flex-direction: column;
	}

	.dummy-track .cover {
		border: 1px solid black;
		background-color: white;
		aspect-ratio: 1/1;
		display: flex;
		position: relative;
		align-items: center;
		justify-content: center;
	}

	.dummy-track .title {
		padding-top: 0.25rem;

		font-size: small;
		font-weight: bold;
		text-align: center;
	}
</style>
