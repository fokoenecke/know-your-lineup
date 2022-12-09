<script lang="ts">
	import { activeTrack } from '$lib/stores/activeTrack';

	let player: HTMLAudioElement;
	let canPlay = false;

	function playWhenReady() {
		if (canPlay === false) {
			console.log('player not ready');
			window.setTimeout(playWhenReady, 25);
		} else {
			player.play();
		}
	}

	$: trackIsPlaying = player && $activeTrack === undefined && !player.paused;
	$: $activeTrack, run();
	const run = async () => {
		canPlay = false;
		if (!player) {
			return;
		}
		if (trackIsPlaying) {
			player.pause();
			player.src = '';
		} else {
			playWhenReady();
		}
	};
</script>

<div class="player">
	<div class="track-info">
		{#if $activeTrack}
			<span class="artist-name">{$activeTrack?.artist.name}</span> -
			<span class="title">{$activeTrack?.title}</span>
		{/if}
	</div>
	<audio
		bind:this={player}
		on:canplay={() => {
			console.log('canplay');
			canPlay = true;
			player.play();
		}}
		src={$activeTrack?.preview}
		controls
		type="audio/mpeg"
		loop={true}
	/>
</div>

<style>
	.player {
		padding: 0 1rem 0 1rem;
		height: 100%;
		display: flex;
		align-items: center;
	}
	.track-info {
		flex: 1;
	}
	.title {
		font-weight: bold;
	}
</style>
