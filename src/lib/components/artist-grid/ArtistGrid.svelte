<script lang="ts">
	import type { DeezerArtist } from '$lib/deezer';
	import { tick } from 'svelte';
	import Artist from './Artist.svelte';
	import ArtistCard from './ArtistCard.svelte';

	export let artists: DeezerArtist[];

	let artistCard: ArtistCard;
	let loadingArtistCard: boolean = false;

	let artistRefs: HTMLLIElement[] = [];

	let selectedArtist: number;

	const selectArtist = async (artist: DeezerArtist) => {
		artistCard?.$destroy();
		const target = artistRefs[artist.id];

		if (selectedArtist !== artist.id) {
			selectedArtist = artist.id;
			artistCard = new ArtistCard({
				props: {
					artist: artist
				},
				target: target.parentElement ?? document.documentElement,
				anchor: target.nextElementSibling ?? undefined,
				intro: true
			});
			loadingArtistCard = true;
			artistCard.$on('loaded', async () => {
				await tick();
				loadingArtistCard = false;
				target.scrollIntoView({ behavior: 'smooth' });
			});
		} else {
			selectedArtist = -1;
		}
	};
</script>

<ul class="artist-grid">
	{#each artists as artist (artist.id)}
		<li
			id={artist.id.toString()}
			bind:this={artistRefs[artist.id]}
			on:click={() => selectArtist(artist)}
			on:keypress={() => selectArtist(artist)}
		>
			<Artist
				{artist}
				selected={artist.id === selectedArtist}
				loading={selectedArtist === artist.id && loadingArtistCard}
			/>
		</li>{/each}
</ul>

<style>
	.artist-grid {
		padding: 1rem;

		display: grid;
		grid-gap: 1rem;
		grid-template-columns: repeat(auto-fill, minmax(min(15rem, 100%), 1fr));
		grid-auto-rows: minmax(min-content, max-content);
		grid-auto-flow: dense;
	}

	.artist-grid li {
		aspect-ratio: 3/2;
	}
</style>
