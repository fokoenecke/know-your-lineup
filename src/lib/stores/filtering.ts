import { writable } from 'svelte/store';

export type Filtering = {
	genre: number;
};

function createFiltering() {
	const filteringStore = writable<Filtering>({ genre: 0 });
	const { subscribe, set, update } = filteringStore;
	const setGenre = (genre: number) => {
		update((filtering) => {
			filtering.genre = genre;
			return filtering;
		});
	};

	return {
		subscribe,
		set,
		setGenre
	};
}

export const filtering = createFiltering();
