<script lang="ts">
	import { activeTrack } from '$lib/stores/activeTrack';

	let player: HTMLAudioElement;

	const play = () => {
		player.play();
	};

	$: $activeTrack, run();
	const run = () => {
		if (player && !player.paused && $activeTrack === undefined) {
			player.pause();
			player.src = '';
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
			player.play();
		}}
		src={$activeTrack?.preview}
		controls
		type="audio/mpeg"
		loop={true}
	>
		<track kind="captions" />
	</audio>
	<button on:click={play}>play</button>
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
