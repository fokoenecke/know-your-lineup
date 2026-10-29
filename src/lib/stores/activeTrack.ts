import type { DeezerTrack } from '#lib/deezer.ts';
import { writable } from 'svelte/store';

function createActiveTrack() {
	const activeTrackStore = writable<DeezerTrack | undefined>();
	const { subscribe, set } = activeTrackStore;

	const unset = () => {
		set(undefined);
	};
	return {
		subscribe,
		set,
		unset
	};
}

export const activeTrack = createActiveTrack();
