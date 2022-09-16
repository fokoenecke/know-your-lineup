import { writable } from 'svelte/store';

function createActiveAct() {
	const activeActStore = writable<string>();
	const { subscribe, set, update } = activeActStore;
	return {
		subscribe,
		set
	};
}

export const activeAct = createActiveAct();
