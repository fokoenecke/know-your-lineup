<script lang="ts" context="module">
	import { activeAct as activeActStore } from '$lib/stores/activeAct.js';
</script>

<script lang="ts">
	import { loadSpotifyLib, play, setupWebPlayer, type SpotifyTrack } from '$lib/spotify';

	import { onMount } from 'svelte';

	import { ChevronsRightIcon, PauseIcon, PlayIcon } from 'svelte-feather-icons';
	import { sleep } from '$lib/util';
	import { playlist } from '$lib/stores/playlist.js';

	export let currentTrack: Spotify.Track;

	let deviceId: string;
	let activeTrack: boolean = false;
	let activeArtistId: string;
	let loading = false;

	onMount(() => {
		window.onSpotifyWebPlaybackSDKReady = () => {
			player = setupWebPlayer(
				(dId) => {
					deviceId = dId;
					next();
				},
				(track) => {
					currentTrack = track;
					loading = false;
				},
				() => {
					console.log('ending track');
					player.pause();
					activeTrack = false;
					next(300);
				}
			);
		};
		(async () => await loadSpotifyLib())();
	});

	let player: Spotify.Player;
	let playing: boolean = false;

	$: $playlist, run();
	function run() {
		console.log('playlist updated');
		if (!!player && !!deviceId && !activeTrack) {
			next();
		}
	}

	function togglePlay() {
		if (activeTrack) {
			playing = !playing;
			player.togglePlay();
		}
	}

	function next(sleepDuration: number = 0) {
		console.log('next');
		if ($playlist.length > 0) {
			activeTrack = true;
			const nextTrack = playlist.next();
			console.log('playing', nextTrack?.name, 'as next track');
			if (nextTrack) {
				loading = true;
				playTrack(nextTrack as SpotifyTrack, nextTrack.randomPosition, sleepDuration);
				activeArtistId = nextTrack.artistId;
			}
		} else {
			console.log('no next track');
			player.nextTrack();
			activeTrack = false;
			playing = false;
			activeArtistId = '';
		}
	}

	async function playTrack(track: SpotifyTrack, randomPosition = false, sleepDuration = 0) {
		let position = 0;
		if (randomPosition) {
			// ~~ -> double not bitwise-or = math.floor
			position = ~~(track.duration_ms / 3 + (Math.random() * track.duration_ms) / 3);
		}
		// bug in spotify API?
		// https://community.spotify.com/t5/Spotify-for-Developers/Web-API-502-error-on-me-player-play-for-a-short-period-after/td-p/5400268
		await sleep(sleepDuration);
		await play({
			player: player,
			position_ms: position,
			spotify_uri: track.uri,
			deviceId: deviceId
		});
		playing = true;
		activeTrack = true;
	}
</script>

<div id="playing">
	{#if activeTrack}
		{#if loading}<h3>loading...</h3>{:else}
			<h3
				class="pointable"
				on:click={() => {
					activeActStore.set(activeArtistId);
				}}
			>
				{currentTrack?.artists.map((artist) => artist.name).join(', ')} - {currentTrack?.name}
			</h3>
		{/if}
	{/if}
	<div id="controls">
		<div on:click={togglePlay} class="pointable">
			{#if playing}<PauseIcon />{:else}<PlayIcon />{/if}
		</div>
		{#if $playlist.length > 0}
			<div on:click={() => next()} class="pointable">
				<ChevronsRightIcon />
			</div>
		{/if}
	</div>
</div>

<style>
	#playing {
		padding-top: 1rem;
		flex-grow: 1;
		text-align: center;
	}

	#controls {
		display: flex;
		justify-content: center;
	}

	.pointable:hover {
		color: orange;
	}
</style>
