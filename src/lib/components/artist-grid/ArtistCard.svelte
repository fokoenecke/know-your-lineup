<script lang="ts">
	import type { DeezerArtist } from '$lib/deezer';
	import { fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import Tracklist from '../tracklist/Tracklist.svelte';

	export let artist: DeezerArtist;

	let ref: HTMLDivElement;

	export function getRef() {
		return ref;
	}
</script>

<div transition:fade={{ duration: 300, easing: quintOut }} class="artist-card" bind:this={ref}>
	<div class="artist-info">
		<h2>{artist.name}</h2>
	</div>

	<h3>Popular Tracks</h3>
	<Tracklist {artist} />
</div>

<style>
	.artist-card {
		grid-column: 1 / -1;
		aspect-ratio: 8 / 1;
		padding: 1rem;
		background-color: #f0f0f0;
		border: 1px solid black;
	}

	.artist-info > h2 {
		margin: 0;
	}
</style>
