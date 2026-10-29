<script lang="ts">
	import { isFirstOccurrence, type DeezerArtist, type DeezerTrack } from '#lib/deezer.ts';

	import Track from './Track.svelte';

	interface Props {
		artist: DeezerArtist;
		onloaded?: () => void;
	}

	let { artist, onloaded }: Props = $props();

	const fetchTracklist = (async () => {
		const response = await fetch(`/api/proxy/${encodeURIComponent(artist.tracklist)}`);
		const tracks = (await response.json()).data as DeezerTrack[];
		const filteredTracks = tracks.filter(isFirstOccurrence);
		return filteredTracks;
	})();

	fetchTracklist.then(() => onloaded?.());
</script>

{#await fetchTracklist then tracklist}
	<ul class="tracklist">
		{#each tracklist.slice(0, 16) as track (track.id)}
			{#if track.preview}
				<li>
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
