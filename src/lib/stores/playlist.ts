import type { PlaylistTrack } from '$lib/types';
import { get, writable } from 'svelte/store';

function createPlaylist() {
	const playlistStore = writable<PlaylistTrack[]>([]);
	const { subscribe, set, update } = playlistStore;
	return {
		subscribe,
		addTrack: (track: PlaylistTrack) => update((playlist) => [...playlist, track]),
		next: () => {
			let returnTrack: PlaylistTrack | undefined;
			if (get(playlistStore).length) {
				update((playlist) => {
					const [nextTrack, ...remainingTracks] = playlist;
					returnTrack = nextTrack;
					return remainingTracks;
				});
			}
			return returnTrack;
		},
		remove: (index: number) =>
			update((playlist) => {
				return [...playlist.slice(0, index), ...playlist.slice(index + 1)];
			})
	};
}

export const playlist = createPlaylist();
