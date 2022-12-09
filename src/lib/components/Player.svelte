<script lang="ts">
	import { sleep } from '$lib/sleep';
	import { activeTrack } from '$lib/stores/activeTrack';

	let player: HTMLAudioElement;

	$: $activeTrack, run();
	const run = async () => {
		if (!player) {
			return;
		}
		const trackIsPlaying = $activeTrack === undefined && !player.paused;
		if (trackIsPlaying) {
			player.pause();
			player.src = '';
		} else {
			player.src = $activeTrack?.preview || '';
			player.load();
			player.play();
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
	<audio bind:this={player} controls type="audio/mpeg" loop={true} />
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
