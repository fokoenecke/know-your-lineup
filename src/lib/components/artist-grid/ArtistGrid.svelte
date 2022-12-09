<script lang="ts">
	import type { DeezerArtist } from '$lib/deezer';
	import Artist from './Artist.svelte';
	import ArtistCard from './ArtistCard.svelte';

	export let artists: DeezerArtist[];

	let artistCard: ArtistCard;
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
		} else {
			selectedArtist = -1;
		}
		target.scrollIntoView({ behavior: 'smooth' });
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
			<Artist {artist} selected={artist.id === selectedArtist} />
		</li>{/each}
</ul>

<style>
	.artist-grid {
		padding: 1rem;

		display: grid;
		grid-gap: 1rem;
		grid-template-columns: repeat(auto-fill, minmax(min(12rem, 100%), 1fr));
		grid-auto-rows: minmax(min-content, max-content);
		grid-auto-flow: dense;
	}

	.artist-grid li {
		aspect-ratio: 3/2;
	}
</style>
