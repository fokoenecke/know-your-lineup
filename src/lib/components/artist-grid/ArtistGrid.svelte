<script lang="ts">
	import type { DeezerArtist } from '#lib/deezer.ts';
	import { sleep } from '#lib/sleep.ts';
	import { filtering } from '#lib/stores/filtering.ts';
	import { sorting } from '#lib/stores/sorting.ts';
	import { mount, tick, unmount } from 'svelte';
	import { flip } from 'svelte/animate';

	import Artist from './Artist.svelte';
	import ArtistCard from './ArtistCard.svelte';

	let { artists }: { artists: DeezerArtist[] } = $props();

	const shuffleDuration = 200;

	let artistCard: ReturnType<typeof mount> | null = null;
	let loadingArtistCard = $state(false);

	let artistRefs: HTMLLIElement[] = $state([]);
	let selectedArtist: DeezerArtist | undefined = $state();

	const sortAscending = $derived($sorting.direction === 'ascending');

	const filteredArtists = $derived.by(() =>
		[...artists]
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
			.filter((artist) => $filtering.genre === 0 || artist.genres?.includes($filtering.genre))
			.filter(
				(artist) =>
					artist.name.toLowerCase().includes($filtering.name.toLowerCase()) ||
					$filtering.name === ''
			)
	);

	const destroyArtistCard = () => {
		if (artistCard) {
			unmount(artistCard);
			artistCard = null;
		}
	};

	$effect(() => {
		void $filtering.genre;
		void $filtering.name;
		run();
	});

	const run = async () => {
		destroyArtistCard();
		await tick();
		if (
			selectedArtist?.genres?.includes($filtering.genre) ||
			(selectedArtist && $filtering.genre === 0) ||
			selectedArtist?.name?.toLowerCase()?.includes($filtering.name) ||
			(selectedArtist && $filtering.name === '')
		) {
			await reloadArtistCard();
		}
	};

	const selectArtist = async (artist: DeezerArtist) => {
		destroyArtistCard();
		if (selectedArtist?.id !== artist.id) {
			selectedArtist = artist;
			await reloadArtistCard();
		} else {
			selectedArtist = undefined;
		}
	};

	$effect(() => {
		void $sorting;
		reloadArtistCard();
	});

	const reloadArtistCard = async () => {
		await tick();
		if (selectedArtist) {
			destroyArtistCard();
			const target = artistRefs[selectedArtist.id];
			artistCard = mount(ArtistCard, {
				target: target?.parentElement ?? document.documentElement,
				anchor: target?.nextElementSibling ?? undefined,
				intro: true,
				props: {
					artist: selectedArtist,
					onloaded: async () => {
						loadingArtistCard = false;
						await tick();
						await sleep(shuffleDuration);
						target?.scrollIntoView({ behavior: 'smooth' });
					}
				}
			});
			loadingArtistCard = true;
		}
	};
</script>

<ul class="artist-grid">
	{#each filteredArtists as artist (artist.id)}
		<li
			animate:flip={{ duration: () => shuffleDuration * Math.random() }}
			id={artist.id.toString()}
			bind:this={artistRefs[artist.id]}
		>
			<Artist
				{artist}
				selected={artist.id === selectedArtist?.id}
				loading={selectedArtist?.id === artist.id && loadingArtistCard}
				onclick={() => selectArtist(artist)}
				onkeydown={() => selectArtist(artist)}
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
