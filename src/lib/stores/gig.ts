import type { Artist, Gig } from '$lib/types';
import { writable } from 'svelte/store';

function createGig() {
	const { subscribe, set, update } = writable<Gig>();

	return {
		subscribe,
		update: (gig: Gig) => set(gig),
		setArtists: (artists: Artist[]) =>
			update((gig) => {
				gig.acts = artists;
				return gig;
			})
	};
}

export const gig = createGig();
