<script lang="ts">
	import { activeTrack } from '#lib/stores/activeTrack.ts';

	let player: HTMLAudioElement | undefined;

	$effect(() => {
		const track = $activeTrack;
		if (!player) {
			return;
		}
		if (track === undefined) {
			if (!player.paused) {
				player.pause();
				player.src = '';
			}
		} else if (track.preview) {
			player.src = track.preview;
			player.load();
			// user activation may have expired by the time the effect runs
			player.play().catch(() => {});
		}
	});
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
<audio bind:this={player} controls loop={true}></audio>

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
