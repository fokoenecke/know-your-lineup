<script lang="ts">
	import { type DeezerArtist, getGenreName } from '$lib/deezer';
	import { fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { createEventDispatcher } from 'svelte';

	import Tracklist from '../tracklist/Tracklist.svelte';

	export let artist: DeezerArtist;

	const dispatch = createEventDispatcher();

	let ref: HTMLDivElement;
	let tracklistLoaded = false;

	export function getRef() {
		return ref;
	}

	$: tracklistLoaded, run();
	const run = async () => {
		if (tracklistLoaded) {
			dispatch('loaded');
		}
	};
	const handleTracklistLoad = () => {
		tracklistLoaded = true;
	};
</script>

<div
	transition:fade={{ duration: 300, easing: quintOut }}
	class="artist-card"
	class:loaded={tracklistLoaded}
	bind:this={ref}
>
	<div class="artist-info">
		<h1>{artist.name}</h1>
		{#if artist.genres}
			<div class="genres">
				{#each artist.genres as genre}
					{#if genre != -1}
						<span class="genre">{getGenreName(genre)}</span>
					{/if}
				{/each}
			</div>
		{/if}
	</div>

	<h2 class="popular">Popular Tracks</h2>
	<Tracklist on:loaded={handleTracklistLoad} {artist} />
</div>

<style>
	.artist-card {
		grid-column: 1 / -1;
		aspect-ratio: 8 / 1;
		padding: 1rem;
		background-color: #f0f0f0;
		border: 1px solid #101010;
		visibility: hidden;
	}

	.genres {
		display: flex;
	}
	.genre {
		display: flex;
		margin-right: 0.5rem;

		background-color: #e0e0e0;
		border-radius: 0.2rem;
		padding: 0.1rem 0.5rem 0.1rem 0.5rem;
	}

	.loaded {
		visibility: visible;
	}

	.artist-info > h1 {
		margin: 0;
	}

	.popular {
		margin-bottom: 0.5rem;
	}
</style>
