<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth.js';
	import type { PageData } from './$types';

	export let data: PageData;

	let currentYear: string = Math.max(
		...Object.keys(data.gigs).map((year) => Number(year))
	).toString();

	onMount(async () => {
		const parsedHash = new URLSearchParams(
			window.location.hash.substring(1) // skip the first char (#)
		);
		if (parsedHash.has('access_token')) {
			const accessToken = parsedHash.get('access_token') || '';
			auth.updateAccessToken(accessToken);
		}
		if (parsedHash.has('refresh_token')) {
			const refreshToken = parsedHash.get('refresh_token') || '';
			auth.updateRefreshToken(refreshToken);
		}
		if (parsedHash.has('expires_in')) {
			const expiresIn = Number(parsedHash.has('expires_in') || 0);
			const expiryDate = new Date();
			expiryDate.setSeconds(expiryDate.getSeconds() + expiresIn);
			auth.updateExpiryDate(expiryDate);
		}
	});
</script>

<svelte:head>
	<title>know your lineup</title>
</svelte:head>

<div id="header-container">
	<h2 id="header">know your lineup</h2>
	{#if !$auth.accessToken}
		<a href="/auth/login">Login with Spotify</a>
	{/if}

	{#if $auth.accessToken}
		<div id="container">
			<ul id="years">
				{#if data.gigs}
					{#each Object.keys(data.gigs).reverse() as year, i}
						<li>
							<h3 class="year" on:click={(e) => (currentYear = currentYear === year ? '' : year)}>
								{currentYear === year ? '[-]' : '[+]'}{year}
							</h3>
							<ul class="gigs" class:hidden={currentYear !== year}>
								{#each data.gigs[year] as gig}
									<li class="gig">
										<a href="/{year}/{gig}.json">
											{gig}
										</a>
									</li>
								{/each}
							</ul>
						</li>
					{/each}
				{/if}
			</ul>
		</div>
	{/if}
</div>

<style>
	#years > li {
		cursor: pointer;
	}
	.year {
		cursor: pointer;
	}
	.year:hover {
		background-color: orange;
	}
	.gig:hover {
		background-color: orange;
	}
	.gig {
		display: flex;
	}
	.gig a {
		flex: auto;
		padding-left: 1rem;
		text-transform: uppercase;
	}
	.hidden {
		display: none;
	}
</style>
