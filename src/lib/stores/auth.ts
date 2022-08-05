import { writable } from 'svelte/store';

interface Auth {
	accessToken: string;
	refreshToken: string;
	expiryDate: Date;
}

function createAuth() {
	const { subscribe, set, update } = writable<Auth>({} as Auth);

	return {
		subscribe,
		updateRefreshToken: (refreshToken: string) =>
			update((auth) => {
				auth.refreshToken = refreshToken;
				return auth;
			}),
		updateAccessToken: (accessToken: string) =>
			update((auth) => {
				auth.accessToken = accessToken;
				return auth;
			}),
		updateExpiryDate: (expiryDate: Date) =>
			update((auth) => {
				auth.expiryDate = expiryDate;
				return auth;
			})
	};
}

export const auth = createAuth();
