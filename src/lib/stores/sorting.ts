import { writable } from 'svelte/store';

export type SortingAttribute = 'name' | 'nb_fan';
export type SortingDirection = 'ascending' | 'descending';

export type Sorting = {
	attribute: SortingAttribute;
	direction: SortingDirection;
};

function createSorting() {
	const sortingStore = writable<Sorting>({ attribute: 'name', direction: 'ascending' });
	const { subscribe, set, update } = sortingStore;
	const setAttribute = (attribute: SortingAttribute) => {
		update((sorting) => {
			sorting.attribute = attribute;
			return sorting;
		});
	};
	const setDirection = (direction: SortingDirection) => {
		update((sorting) => {
			sorting.direction = direction;
			return sorting;
		});
	};

	return {
		subscribe,
		set,
		setAttribute,
		setDirection
	};
}

export const sorting = createSorting();
