<script lang="ts">
	import { getArtist, getArtistsRelatedArtistsById, getArtistsTopTracksById } from '$lib/spotify';
	import { gig as gigStore } from '$lib/stores/gig.js';
	import { playlist } from '$lib/stores/playlist.js';

	export let artistId: string;
	export let setActiveAct: (act: string) => void;

	let ref: HTMLDivElement;

	const fetchArtist = (async () => {
		return await getArtist(artistId);
	})();

	const fetchArtistsTopTracks = (async () => {
		const artistsTopTracks = await getArtistsTopTracksById(artistId);
		artistsTopTracks.sort((a, b) =>
			a.popularity > b.popularity ? -1 : b.popularity > a.popularity ? 1 : 0
		);
		return artistsTopTracks;
	})();

	const fetchArtistsRelatedArtists = (async () => {
		const relatedArtists = await getArtistsRelatedArtistsById(artistId);
		const lineupArtistIds = $gigStore.acts.map((act) => act.spotifyId);

		return relatedArtists.filter((related) => {
			return lineupArtistIds.includes(related.id);
		});
	})();

	export function getRef() {
		return ref;
	}
</script>

<div id="artistCard" bind:this={ref}>
	{#await fetchArtist then artist}
		<div id="actInfo">
			<h2>{artist.name}</h2>
			<h4 id="genres">{artist?.genres.join(', ')}</h4>
		</div>
	{:catch error}
		<p>An error occurred!</p>
	{/await}

	{#await fetchArtistsTopTracks then topTracks}
		<ul id="topTracks">
			{#each topTracks as topTrack}
				<li
					class="topTrack"
					on:click={() => {
						playlist.addTrack({ ...topTrack, randomPosition: true, artistId });
					}}
				>
					<div
						class="trackImage"
						style="background-image: url({topTrack.album.images?.at(-1)?.url})"
					/>
					<span>{topTrack.name}</span>
				</li>
			{/each}
		</ul>
	{:catch error}
		<p>An error occurred!</p>
	{/await}

	{#await fetchArtistsRelatedArtists then relatedArtists}
		{#if relatedArtists.length > 0}
			<div id="relatedActs">
				<h4>related</h4>
				<ul id="relatedArtists">
					{#each relatedArtists as related}
						<li
							class="relatedArtist"
							on:click={() => {
								setActiveAct(related.id);
							}}
						>
							<div
								class="relatedImage"
								style="background-image: url({related.images?.at(-1)?.url})"
							/>
							<span>{related.name}</span>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	{:catch error}
		<p>An error occurred!</p>
	{/await}
</div>

<style>
	#artistCard {
		grid-column: 1 / -1;
		aspect-ratio: 8 / 1;
		padding: 1rem;
		background-color: #f0f0f0;
		margin-bottom: 1rem;
	}
	#topTracks {
		margin-top: 1rem;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(5rem, 1fr));
		gap: 0.25rem;
	}
	.trackImage {
		height: 100%;
		background-size: cover;
		background-position: center;
		overflow: hidden;
	}
	.topTrack {
		aspect-ratio: 1/1;
		color: black;
		font-size: x-small;
		font-weight: 700;
		text-align: center;
		word-wrap: break-word;
	}
	.topTrack:hover {
		color: darkgray;
		cursor: pointer;
	}
	.topTrack:hover .trackImage {
		box-shadow: inset 0 0 0 10em rgba(255, 255, 255, 0.5);
	}

	#relatedActs {
		padding-top: 0.5rem;
	}
	#relatedArtists {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
		gap: 0.25rem;
		margin-bottom: 0.5rem;
	}
	.relatedArtist {
		aspect-ratio: 3/1;
		color: black;
		font-size: x-small;
		font-weight: 700;
		text-align: center;
	}
	.relatedImage {
		height: 100%;
		background-size: cover;
		background-position: center;
		overflow: hidden;
	}
	.relatedArtist:hover {
		color: darkgray;
		cursor: pointer;
	}
	.relatedArtist:hover .relatedImage {
		box-shadow: inset 0 0 0 10em rgba(255, 255, 255, 0.5);
	}
</style>
