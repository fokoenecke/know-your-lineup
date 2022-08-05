<script lang="ts">
	import type { SpotifyArtist, SpotifyTrack } from '$lib/spotify';
	import { ShuffleIcon } from 'svelte-feather-icons';

	export let currentArtist: SpotifyArtist;
	export let currentArtistsTopTracks: SpotifyTrack[];
	export let currentArtistsRelatedArtists: SpotifyArtist[];
	export let currentTrack: Spotify.Track;
	export let playTrack: (track: SpotifyTrack, randomPosition?: boolean) => Promise<void>;
	export let setArtist: (artistId: string) => void;

	export let loading: boolean;

	async function playRandomTopTrack(): Promise<void> {
		playTrack(
			currentArtistsTopTracks[Math.floor(Math.random() * currentArtistsTopTracks.length)],
			true
		);
	}
	const wait = () => new Promise((res) => setTimeout(res, 300));
</script>

<div id="info">
	{#if loading}
		{#await wait()}
			<div />
		{:then a}
			<h1>loading...</h1>
		{/await}{:else if currentArtist}
		<h2>{currentArtist?.name}</h2>
		<h4 id="genres">{currentArtist?.genres.join(', ')}</h4>
		<h4>
			Top Tracks <button on:click={playRandomTopTrack}><ShuffleIcon class="small-icon" /></button>
		</h4>
		<ul id="topTrackList">
			{#each currentArtistsTopTracks as topTrack}
				<li
					class="pointable topTrack {currentTrack?.id === topTrack.id && 'currentlyPlaying'}"
					on:click={() => {
						playTrack(topTrack);
					}}
				>
					{topTrack.name}
				</li>
			{/each}
		</ul>
		{#if currentArtistsRelatedArtists.length > 0}
			<h4>related (in this lineup)</h4>
			<ul>
				{#each currentArtistsRelatedArtists as related}
					<li
						class="pointable relatedArtist"
						on:click={() => {
							setArtist(related.id);
						}}
					>
						{related.name}
					</li>
				{/each}
			</ul>
		{/if}
	{:else}
		<h1>Choose an artist!</h1>
	{/if}
</div>

<style>
	#info {
		flex: auto;
		overflow: auto;
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	#genres {
		padding-bottom: 1rem;
	}

	#info::-webkit-scrollbar {
		display: none;
	}

	#topTrackList {
		padding-bottom: 2rem;
	}

	.currentlyPlaying {
		background-color: orange;
	}

	.topTrack:hover {
		background-color: lightgrey;
	}

	.relatedArtist:hover {
		background-color: lightgrey;
	}
</style>
