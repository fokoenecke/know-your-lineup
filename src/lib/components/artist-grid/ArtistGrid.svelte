<script lang="ts">
	import type { DeezerArtist } from '$lib/deezer';
	import { sorting } from '$lib/stores/sorting';
	import { tick } from 'svelte';
	import { flip } from 'svelte/animate';

	import Artist from './Artist.svelte';
	import ArtistCard from './ArtistCard.svelte';

	export let artists: DeezerArtist[];

	let artistCard: ArtistCard;
	let loadingArtistCard: boolean = false;

	let artistRefs: HTMLLIElement[] = [];

	let selectedArtist: DeezerArtist | undefined;

	$: sortAscending = $sorting.direction === 'ascending';

	$: artists = artists.sort((a, b) => {
		let aValue = a[$sorting.attribute];
		if (typeof aValue === 'string') {
			aValue = String(aValue).toLowerCase();
		}
		let bValue = b[$sorting.attribute];
		if (typeof bValue === 'string') {
			bValue = String(bValue).toLowerCase();
		}
		return aValue > bValue
			? sortAscending
				? 1
				: -1
			: bValue > aValue
			? sortAscending
				? -1
				: 1
			: 0;
	});

	const selectArtist = async (artist: DeezerArtist) => {
		artistCard?.$destroy();
		const target = artistRefs[artist.id];

		if (selectedArtist?.id !== artist.id) {
			selectedArtist = artist;
			artistCard = new ArtistCard({
				props: {
					artist: selectedArtist
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
			selectedArtist = undefined;
		}
	};

	$: $sorting, reloadArtistCard();
	const reloadArtistCard = async () => {
		await tick();
		if (selectedArtist) {
			artistCard?.$destroy();
			const target = artistRefs[selectedArtist.id];
			artistCard = new ArtistCard({
				props: {
					artist: selectedArtist
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
		}
	};
</script>

<ul class="artist-grid">
	{#each artists as artist (artist.id)}
		<li
			animate:flip={{ duration: () => 500 * Math.random() }}
			id={artist.id.toString()}
			bind:this={artistRefs[artist.id]}
			on:click={() => selectArtist(artist)}
			on:keypress={() => selectArtist(artist)}
		>
			<Artist
				{artist}
				selected={artist.id === selectedArtist?.id}
				loading={selectedArtist?.id === artist.id && loadingArtistCard}
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
