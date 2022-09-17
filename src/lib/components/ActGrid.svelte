<script lang="ts">
	import type { Artist } from '$lib/types';
	import { type SpotifyArtist, getUsersTopArtists } from '$lib/spotify';
	import { fade } from 'svelte/transition';
	import { gig as gigStore } from '$lib/stores/gig.js';
	import { activeAct as activeActStore } from '$lib/stores/activeAct.js';
	import { onMount, tick } from 'svelte';
	import ActCard from './ArtistCard.svelte';

	export let filterTopArtists: boolean = false;

	let usersTopArtists: SpotifyArtist[] = [];
	onMount(async () => {
		usersTopArtists = await getUsersTopArtists();
	});

	// const deep_value = (obj: Artist, path: string) =>
	// 	path.split('.').reduce((acc, val) => {{acc && val in acc && acc[val]}}, obj);

	let artistCard: ActCard;
	let actsRefs: { [key: string]: HTMLLIElement } = {};

	let sortAttribute: keyof Artist = 'name';
	let sortAscending: boolean = true;

	let filterGenre: string;

	$: usersTopArtistIds = usersTopArtists.map((artist) => artist.id);
	$: acts = $gigStore.acts.sort((a, b) =>
		a[sortAttribute] > b[sortAttribute]
			? sortAscending
				? 1
				: -1
			: b[sortAttribute] > a[sortAttribute]
			? sortAscending
				? -1
				: 1
			: 0
	);
	$: filteredActs = $gigStore.acts
		.filter((act) => !filterTopArtists || usersTopArtistIds.includes(act.spotifyId))
		.filter(
			(act) =>
				!filterGenre ||
				act.genres
					.filter((genre) => {
						if (typeof genre.toLowerCase === 'function') {
							return true;
						} else {
							console.log(act);
							return false;
						}
					})
					.some((genre) => genre.toLowerCase().includes(filterGenre.toLowerCase()))
		)
		.map((act) => act.spotifyId);

	$: onFilterChange(actsRefs, filteredActs);
	async function onFilterChange(...args: any[]) {
		const actId = $activeActStore;
		if (!!actId) {
			await tick();
			deactivateArtist();
			if (filteredActs.includes(actId)) {
				activateArtist(actId);
				const target = actsRefs[actId];
				target.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}
	}

	$: onActChange($activeActStore);
	function onActChange(actId: string) {
		console.log('on act change');
		if (!!actId) {
			console.log('activate', actId);
			activateArtist(actId);
		} else {
			deactivateArtist();
		}
		const target = actsRefs[actId];
		if (target) {
			target.scrollIntoView({ behavior: 'smooth' });
		}
	}

	function setActiveAct(actId: string): void {
		activeActStore.set(actId === $activeActStore ? '' : actId);
	}

	export const orderActsByAttribute = (attr: keyof Artist, asc: boolean = true) => {
		sortAttribute = attr;
		sortAscending = asc;
	};

	export const filterActsByGenre = (genre: string) => {
		filterGenre = genre;
	};

	async function activateArtist(actId: string): Promise<void> {
		artistCard?.$destroy();
		const target = actsRefs[actId];
		artistCard = new ActCard({
			props: {
				artistId: actId,
				setActiveAct: setActiveAct
			},
			target: target.parentElement ?? document.documentElement,
			anchor: target.nextElementSibling ?? undefined
		});
	}

	function deactivateArtist(): void {
		artistCard?.$destroy();
	}
</script>

<div id="acts">
	{#if filteredActs.length > 0}
		<ul id="act-grid">
			{#each acts as act, i}
				<li
					in:fade
					style={act.images?.at(-1) ? `background-image: url(${act.images?.at(-1)?.url})` : ''}
					on:click={() => setActiveAct(act.spotifyId)}
					class:hidden={!filteredActs.includes(act.spotifyId)}
					class:active={$activeActStore === act.spotifyId}
					class:inactive={!!$activeActStore && $activeActStore !== act.spotifyId}
					bind:this={actsRefs[act.spotifyId]}
				>
					{act.name}
				</li>
			{/each}
		</ul>
	{/if}
	{#if filteredActs.length === 0}<h1 class="no-items">no items :(</h1>{/if}
</div>

<style>
	#act-grid {
		display: grid;
		gap: 0.5rem;
		grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
		overflow: scroll;
		max-height: 80vh;
		grid-auto-flow: dense;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;

		list-style-type: none;
		overflow: auto;
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	#act-grid li {
		aspect-ratio: 1 / 1;
		font-size: small;
		background-color: orange;
		text-align: left;
		border-bottom: 1px solid white;
		padding: 0.25rem;
		color: white;
		text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
		background-size: cover;
		background-position: center;
		text-overflow: ellipsis;
	}
	#act-grid li.inactive {
		filter: grayscale(90%);
		opacity: 0.75;
	}
	#act-grid li.inactive:hover {
		filter: none;
		opacity: 1;
	}
	#act-grid li.active {
		aspect-ratio: 5/6;
	}
	#act-grid li:hover {
		background-color: bisque;
		box-shadow: inset 0 0 0 10em rgba(255, 255, 255, 0.1);
		cursor: pointer;
	}
	.no-items {
		text-align: center;
	}
	.hidden {
		display: none;
	}
</style>
