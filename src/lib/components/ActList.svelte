<script lang="ts">
	import type { SpotifyArtist } from '$lib/spotify';

	import type { Artist, Gig } from '$lib/types';
	import {
		ActivityIcon,
		ChevronsDownIcon,
		ChevronsUpIcon,
		StarIcon,
		XIcon
	} from 'svelte-feather-icons';
	import { fade } from 'svelte/transition';

	export let gig: Gig;
	export let usersTopArtists: SpotifyArtist[];
	export let setArtist: (artistId: string) => void;

	let filterTopArtists: boolean;

	let searchTerm = '';
	$: usersTopArtistsIds = usersTopArtists?.map((artist) => artist.id);

	$: filteredActs = gig.acts
		.filter((act) => act.name.toLowerCase().includes(searchTerm.toLowerCase()))
		.filter((act) => !filterTopArtists || usersTopArtistsIds.includes(act.spotifyId));

	const getActsOrderedByAttribute = (
		acts: Artist[],
		attribute: keyof Artist,
		asc: boolean = true
	) => {
		return acts.sort((a, b) =>
			a[attribute] > b[attribute] ? (asc ? 1 : -1) : b.name > a.name ? (asc ? -1 : 1) : 0
		);
	};

	function orderList() {
		gig.acts = getActsOrderedByAttribute(gig.acts, 'name');
	}

	function reverseList() {
		gig.acts = getActsOrderedByAttribute(gig.acts, 'name', false);
	}

	function orderListByPopularity() {
		gig.acts = getActsOrderedByAttribute(gig.acts, 'popularity', false);
	}

	orderList();
</script>

<div id="acts">
	<div id="ordering">
		<input id="artistFilter" bind:value={searchTerm} placeholder="filter" type="search" />

		<div on:click={() => (searchTerm = '')}><XIcon /></div>
		<div on:click={orderList}><ChevronsDownIcon /></div>
		<div on:click={reverseList}><ChevronsUpIcon /></div>
		<div on:click={orderListByPopularity}><ActivityIcon /></div>
		<div
			class={filterTopArtists ? 'iconActive' : ''}
			on:click={() => (filterTopArtists = !filterTopArtists)}
		>
			<StarIcon />
		</div>
	</div>
	<ul>
		{#each filteredActs as act}
			<li
				transition:fade
				style="background-image: url({act.images?.at(0)?.url})"
				on:click={() => setArtist(act.spotifyId)}
			>
				{act.name}
			</li>
		{/each}
	</ul>
</div>

<style>
	#artistFilter {
		width: 10rem;
	}

	#ordering {
		display: flex;
		flex-direction: row;
		padding-bottom: 1rem;
	}

	#ordering input {
		flex: 1;
	}

	#ordering > div:hover {
		background-color: grey;
		cursor: pointer;
	}

	#acts {
		display: flex;
		flex: 0 0 18rem;
		flex-direction: column;
	}

	ul {
		max-width: 18rem;
		list-style-type: none;
		overflow: auto;
		flex: 1;
		margin: 0;
		padding: 0;
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	ul::-webkit-scrollbar {
		display: none;
	}

	li {
		font-size: 1rem;
		background-color: orange;
		text-align: left;
		border-bottom: 1px solid white;
		padding: 1rem;
		color: white;
		text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
		background-size: cover;
		background-position: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	li:hover {
		background-color: bisque;
		box-shadow: inset 0 0 0 10em rgba(255, 255, 255, 0.3);
		cursor: pointer;
	}

	.iconActive {
		color: orange;
	}
</style>
