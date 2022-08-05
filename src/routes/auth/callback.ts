import type { RequestEvent } from '@sveltejs/kit';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, BASE_URL } from '$env/static/private';

export async function GET(event: RequestEvent) {
	const code = event.url.searchParams.get('code') || '';
	const state = event.params.state;

	const params = {
		code: code,
		redirect_uri: BASE_URL + '/auth/callback',
		grant_type: 'authorization_code'
	};

	const form = new URLSearchParams(params);
	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization:
				'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')
		},
		body: form
	});
	const jsonResponse = await response.json();
	return {
		status: 301,
		headers: {
			'access-control-allow-origin': '*',
			Location: `${BASE_URL}/#access_token=${jsonResponse.access_token}&refresh_token=${jsonResponse.refresh_token}&expires_in=${jsonResponse.expires_in}`
		}
	};
}
