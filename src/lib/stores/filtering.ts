import { writable } from 'svelte/store';

export type Filtering = {
  genre: number;
  name: string;
};

function createFiltering() {
	const filteringStore = writable<Filtering>({ genre: 0, name: "" });
	const { subscribe, set, update } = filteringStore;
	const setGenre = (genre: number) => {
		update((filtering) => {
			filtering.genre = genre;
			return filtering;
		});
  };

	const setName = (name: string) => {
		update((filtering) => {
			filtering.name = name;
			return filtering;
		});
	};

	return {
		subscribe,
		set,
    setGenre,
		setName
	};
}

export const filtering = createFiltering();
