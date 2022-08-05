import type { RequestEvent } from '@sveltejs/kit';
import { SPOTIFY_CLIENT_ID, BASE_URL } from '$env/static/private';

const generateRandomString = (len: number) => {
	return Math.random()
		.toString(36)
		.substring(2, 2 + len);
};

export async function GET(event: RequestEvent) {
	console.log(SPOTIFY_CLIENT_ID);
	const state = generateRandomString(16);
	const scope = 'user-read-private user-top-read user-read-email streaming';

	const params = {
		response_type: 'code',
		client_id: SPOTIFY_CLIENT_ID,
		scope: scope,
		redirect_uri: BASE_URL + '/auth/callback',
		state: state
	};

	const querystring = new URLSearchParams(params).toString();
	return {
		status: 301,
		headers: {
			'access-control-allow-origin': '*',
			Location: `https://accounts.spotify.com/authorize?${querystring}`
		}
	};
}
