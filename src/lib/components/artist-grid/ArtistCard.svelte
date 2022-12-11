<script lang="ts">
	import type { DeezerArtist } from '$lib/deezer';
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
		<h2>{artist.name}</h2>
	</div>

	<h3>Popular Tracks</h3>
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

	.loaded {
		visibility: visible;
	}

	.artist-info > h2 {
		margin: 0;
	}
</style>
