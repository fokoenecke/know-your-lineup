<script lang="ts">
	import { PlayCircleIcon, StopCircleIcon } from 'svelte-feather-icons';
	import type { DeezerTrack } from '$lib/deezer';
	import { activeTrack } from '$lib/stores/activeTrack';

	export let track: DeezerTrack;

	$: isActiveTrack = track.id === $activeTrack?.id;
	const toggleActivate = async (track: DeezerTrack) => {
		if (!isActiveTrack) {
			activeTrack.set(track);
		} else {
			activeTrack.unset();
		}
	};
</script>

<div
	class="track"
	class:active={isActiveTrack}
	on:click={() => toggleActivate(track)}
	on:keypress={() => toggleActivate(track)}
>
	<div class="upper">
		<img class="cover" src={track.album.cover_medium} alt={track.title_short} />
		<i class="icon">
			{#if isActiveTrack}
				<StopCircleIcon size="3x" />
			{:else}
				<PlayCircleIcon size="3x" />
			{/if}
		</i>
	</div>
	<span class="title">{track.title_short}</span>
</div>

<style>
	.track {
		display: flex;
		flex-direction: column;
		transition: 0.1s ease-in-out;
		backface-visibility: hidden;
		width: 100%;
	}

	.upper {
		display: flex;
		flex-direction: column;
		position: relative;
		width: 100%;
		aspect-ratio: 1/1;
		backface-visibility: hidden;
	}

	.track:hover,
	.track.active:hover {
		cursor: pointer;
		transform: scale(1.05) translateZ(-1px);
		z-index: 1;
	}

	.track.active {
		transform: scale(1.02) translateZ(-1px);
	}

	.cover {
		border: 1px solid black;
		backface-visibility: hidden;
		aspect-ratio: 1/1;

		object-fit: cover;

		filter: grayscale(60%);
		-webkit-filter: grayscale(60%);
		-moz-filter: grayscale(60%);
		-ms-filter: grayscale(60%);
		-o-filter: grayscale(60%);

		transition: 0.1s ease-in-out;
	}

	.track:hover .cover,
	.track.active .cover {
		box-shadow: 0 0 0.5rem black;
		filter: grayscale(0%);

		-webkit-filter: grayscale(0%);
		-moz-filter: grayscale(0%);
		-ms-filter: grayscale(0%);
		-o-filter: grayscale(0%);
	}

	.title {
		padding-top: 0.25rem;

		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

		font-size: small;
		font-weight: bold;
		text-align: center;
	}

	.icon {
		visibility: hidden;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: white;
		display: flex;

		filter: drop-shadow(0 0 3px black);
	}

	.track:hover .icon,
	.track.active .icon {
		visibility: visible;
	}
</style>
