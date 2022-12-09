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
	<img class="cover" src={track.album.cover_medium} alt={track.title_short} />

	<i class="icon">
		{#if isActiveTrack}
			<StopCircleIcon size="3x" />
		{:else}
			<PlayCircleIcon size="3x" />
		{/if}
	</i>
	<span class="title">{track.title_short}</span>
</div>

<style>
	.track {
		display: flex;
		flex-direction: column;
		transition: 0.1s ease-in-out;
		position: relative;
		width: 100%;
	}

	.track:hover,
	.track.active:hover {
		cursor: pointer;
		transform: scale(1.05);
		z-index: 1;
		visibility: visible;
	}

	.track.active > .cover {
		cursor: pointer;
		transform: scale(1.05);
	}

	.cover {
		border: 1px solid black;
		aspect-ratio: 1/1;
		backface-visibility: hidden;

		filter: grayscale(60%);
		-webkit-filter: grayscale(60%);
		-moz-filter: grayscale(60%);
		-ms-filter: grayscale(60%);
		-o-filter: grayscale(60%);

		transition: 0.1s ease-in-out;
	}

	.track:hover > .cover,
	.track.active > .cover {
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
		top: 0.3rem;
		left: 0.3rem;
		color: white;

		filter: drop-shadow(0 0 3px black);
	}

	.track:hover > .icon,
	.track.active > .icon {
		visibility: visible;
	}
</style>
