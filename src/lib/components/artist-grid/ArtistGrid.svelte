<script lang="ts">
	import type { DeezerArtist } from '$lib/deezer';
	import { sleep } from '$lib/sleep';
	import { filtering } from '$lib/stores/filtering';
	import { sorting } from '$lib/stores/sorting';
	import { tick } from 'svelte';
	import { flip } from 'svelte/animate';

	import Artist from './Artist.svelte';
	import ArtistCard from './ArtistCard.svelte';

	export let artists: DeezerArtist[];

	const shuffleDuration = 200;

	let artistCard: ArtistCard;
	let loadingArtistCard: boolean = false;

	let artistRefs: HTMLLIElement[] = [];
	let selectedArtist: DeezerArtist | undefined;

	$: sortAscending = $sorting.direction === 'ascending';

	$: filteredArtists = artists
		.sort((a, b) => {
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
		})
		.filter((artist) => $filtering.genre === 0 || artist.genres?.includes($filtering.genre));

	$: $filtering.genre, run();
	const run = async () => {
		artistCard?.$destroy();
		await tick();
		if (
			selectedArtist?.genres?.includes($filtering.genre) ||
			(selectedArtist && $filtering.genre === 0)
		) {
			await reloadArtistCard();
		}
	};

	const selectArtist = async (artist: DeezerArtist) => {
		artistCard?.$destroy();
		if (selectedArtist?.id !== artist.id) {
			selectedArtist = artist;
			await reloadArtistCard();
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
				loadingArtistCard = false;
				await tick();
				await sleep(shuffleDuration);
				target.scrollIntoView({ behavior: 'smooth' });
			});
		}
	};
</script>

<ul class="artist-grid">
	{#each filteredArtists as artist (artist.id)}
		<li
			animate:flip={{ duration: () => shuffleDuration * Math.random() }}
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
		</li>
	{/each}
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
