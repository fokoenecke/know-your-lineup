<script lang="ts">
	import type { DeezerArtist } from '$lib/deezer';
	import { tick } from 'svelte';
	import { flip } from 'svelte/animate';
	import Artist from './Artist.svelte';
	import ArtistCard from './ArtistCard.svelte';

	export let artists: DeezerArtist[];
	export let sortAscending: boolean = true;
	export let sortAttribute: keyof DeezerArtist = 'name';

	let sortAttributes: (keyof DeezerArtist)[] = ['name', 'nb_fan'];

	let artistCard: ArtistCard;
	let loadingArtistCard: boolean = false;

	let artistRefs: HTMLLIElement[] = [];

	let selectedArtist: DeezerArtist | undefined;

	$: artists = artists.sort((a, b) => {
		let aValue = a[sortAttribute];
		if (typeof aValue === 'string') {
			aValue = String(aValue).toLowerCase();
		}
		let bValue = b[sortAttribute];
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

	const toggleSortDirection = () => {
		sortAscending = !sortAscending;
	};

	const rotateSortAttribute = () => {
		const firstAttribute = sortAttributes.shift();
		if (firstAttribute) {
			sortAttributes.push(firstAttribute);
		}
		sortAttributes = sortAttributes;
		sortAttribute = sortAttributes[0];
	};

	$: sortAscending, sortAttribute, reloadArtistCard();
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

<div class="sort">
	<span class="label">sort by</span>
	<span class="attribute" on:keydown={rotateSortAttribute} on:click={rotateSortAttribute}>
		{#if sortAttribute === 'name'}
			name
		{:else if sortAttribute === 'nb_fan'}
			fans
		{/if}
	</span>
	<span class="direction" on:keydown={toggleSortDirection} on:click={toggleSortDirection}>
		{#if sortAscending}
			{#if sortAttribute === 'name'}
				a to z
			{:else if sortAttribute === 'nb_fan'}
				low to high
			{/if}
		{:else if sortAttribute === 'name'}
			z to a
		{:else if sortAttribute === 'nb_fan'}
			high to low
		{/if}
	</span>
</div>

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

	.sort {
		display: flex;
		justify-content: flex-start;
		align-items: center;

		font-size: large;
		padding-left: 1rem;
		padding-right: 1rem;
		transition: 0.1s ease-in-out;

		padding-top: 0.25rem;
	}

	.sort .direction {
		border-radius: 0.2rem;
	}

	.sort .attribute,
	.sort .direction {
		display: flex;
		cursor: pointer;
		margin-left: 0.5rem;

		background-color: #e0e0e0;
		border-radius: 0.2rem;
		padding: 0.1rem 0.3rem 0.1rem 0.3rem;
	}

	.sort .attribute:hover,
	.sort .direction:hover {
		color: orange;

		background-color: #0f0f0f;
		color: white;
	}
</style>
