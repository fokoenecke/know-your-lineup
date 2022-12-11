<script lang="ts">
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
			<span>
				{$activeTrack?.artist.name} - <span class="title">{$activeTrack?.title}</span>
			</span>
		{:else}
			<span><wbr /></span>
		{/if}
	</div>
</div>
<audio bind:this={player} controls type="audio/mpeg" loop={true} />

<style>
	.player {
		padding: 0 1rem 0 1rem;
	}

	.track-info {
		padding-top: 1rem;
		padding-bottom: 1rem;
		display: inline-grid;
		grid-template-columns: 1fr;
	}
	.track-info > span {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.title {
		font-weight: bold;
	}

	audio {
		display: none;
	}
</style>
