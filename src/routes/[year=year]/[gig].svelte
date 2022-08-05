<script lang="ts" context="module">
	import type { LoadEvent } from '@sveltejs/kit';

	export async function load({ fetch, params }: LoadEvent) {
		const hurricaneInfoUrl = `/gix/${params.year}/${params.gig}`;
		const response = await fetch(hurricaneInfoUrl);

		return {
			status: response.status,
			props: {
				gig: response.ok && (await response.json())
			}
		};
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import Player from '$lib/components/Player.svelte';
	import { searchForActs, updateActs } from '$lib/util';
	import ActGrid from '$lib/components/ActGrid.svelte';
	import { gig as gigStore } from '$lib/stores/gig.js';
	import type { Artist, Gig } from '$lib/types';
	import PlaylistSidepanel from '$lib/components/PlaylistSidebar.svelte';
	import { StarIcon } from 'svelte-feather-icons';
	import { playlist } from '$lib/stores/playlist.js';
	import { auth } from '$lib/stores/auth.js';

	export let gig: Gig;

	let currentTrack: Spotify.Track;
	let acts: string;
	let jsonActs: string;

	let filterGenre: string;
	let sortOrder: { attribute: keyof Artist; asc: boolean };

	let filterTopArtists: boolean;

	let orderActsByAttribute: (attribute: keyof Artist, asc?: boolean) => void;
	let filterActsByGenre: (genre: string) => void;
	let toggleSidebar: () => void;

	gigStore.update(gig);

	onMount(async () => {
		console.log('mount gig');
		console.log($gigStore);
		const parsedHash = new URLSearchParams(
			window.location.hash.substring(1) // skip the first char (#)
		);
	});
</script>

<svelte:head>
	<title>know your lineup</title>
</svelte:head>

{#if !$auth.accessToken}
	<a href="/auth/login">Login with Spotify</a>
{/if}

{#if $auth.accessToken}
	<div id="header-container">
		<h2 id="header">know your lineup</h2>
		<div class="topFilter-container">
			<div
				class="topFilter"
				class:iconActive={filterTopArtists}
				on:click={() => (filterTopArtists = !filterTopArtists)}
			>
				<StarIcon />
			</div>
		</div>
		<select
			bind:value={sortOrder}
			on:change={() => {
				orderActsByAttribute(sortOrder.attribute, sortOrder.asc);
			}}
			id="orderAttributes"
		>
			<option value={{ attribute: 'name', asc: true }}>name↑</option>
			<option value={{ attribute: 'name', asc: false }}>name↓</option>
			<option value={{ attribute: 'popularity', asc: false }}>popularity↓</option>
			<option value={{ attribute: 'popularity', asc: true }}>popularity↑</option>
		</select>
		<select
			bind:value={filterGenre}
			on:change={() => {
				filterActsByGenre(filterGenre);
			}}
			id="filterGenres"
		>
			<option value={undefined}>all</option>
			<option value="pop">pop</option>
			<option value="hip hop">hip hop</option>
			<option value="punk">punk</option>
			<option value="indie">indie</option>
			<option value="dance">dance</option>
			<option value="folk">folk</option>
			<option value="edm">edm</option>
			<option value="doom">doom</option>
			<option value="modern">modern</option>
			<option value="reggae">reggea</option>
			<option value="wave">wave</option>
			<option value="metal">metal</option>
			<option value="core">core</option>
		</select>
		<div id="playlist-toggle">
			<button on:click={() => toggleSidebar()}>queue[{$playlist.length}]</button>
		</div>
	</div>

	<div id="content">
		<ActGrid bind:filterTopArtists bind:filterActsByGenre bind:orderActsByAttribute />
		<PlaylistSidepanel bind:toggleSidebar />
	</div>
	<Player bind:currentTrack />

	{#if true}
		<textarea bind:value={acts} cols="30" rows="10" />
		<button
			on:click={() => {
				searchForActs(acts);
			}}>Suche bei Spotify</button
		>
		<textarea bind:value={jsonActs} cols="30" rows="10" />
		<button
			on:click={() => {
				updateActs(jsonActs);
			}}>Suche bei Spotify</button
		>
	{/if}
{/if}

<style>
	#header-container {
		display: flex;
		align-items: center;
	}
	#header {
		flex: 1 auto;
		padding: 1rem 0 1rem 0;
	}
	#content {
		border-bottom: 1px solid black;
		border-top: 1px solid black;
	}
	.topFilter-container {
		flex: 1 auto;
	}
	.topFilter {
		display: inline-block;
	}
	.topFilter:hover {
		color: orangered;
	}
	.iconActive {
		color: orange;
	}
</style>
