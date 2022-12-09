<script lang="ts">
	import type { DeezerArtist } from '$lib/deezer';

	export let artist: DeezerArtist;
	export let selected: boolean;
</script>

<div class="artist" class:selected>
	<img class="picture" src={artist.picture_big} alt={artist.name} />
	<span class="name">{artist.name}</span>
</div>

<style>
	.artist {
		backface-visibility: hidden;
		display: flex;
		flex-direction: column;
		transition: 0.1s ease-in-out;
		position: relative;
		height: 100%;
	}

	.artist:hover,
	.artist.selected:hover {
		cursor: pointer;
		transform: scale(1.05);
		z-index: 1;
	}

	.artist.selected {
		transform: scale(1.025);
	}

	.picture {
		border: 1px solid black;
		height: 100%;

		object-fit: cover;

		filter: grayscale(60%);
		-webkit-filter: grayscale(60%);
		-moz-filter: grayscale(60%);
		-ms-filter: grayscale(60%);
		-o-filter: grayscale(60%);

		transition: 0.1s ease-in-out;
	}
	.artist:hover > .picture,
	.artist.selected > .picture {
		box-shadow: 0 0 1rem black;
		filter: grayscale(0%);
		-webkit-filter: grayscale(0%);
		-moz-filter: grayscale(0%);
		-ms-filter: grayscale(0%);
		-o-filter: grayscale(0%);
	}

	.name {
		color: white;
		font-size: larger;

		position: absolute;
		top: 0;
		left: 0;
		text-align: left;
		text-shadow: 0 0 0.3rem black;
		padding: 0.25rem 0.5rem 0 0.5rem;
	}
</style>
