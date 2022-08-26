import { json as json$1 } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, BASE_URL } from '$env/static/private';

export async function GET(event: RequestEvent) {
	const refreshToken = event.url.searchParams.get('refresh_token') || '';

	const params = {
		grant_type: 'refresh_token',
		refresh_token: refreshToken
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
	return json$1({
		access_token: jsonResponse.access_token,
		refresh_token: jsonResponse.refresh_token,
		expires_in: jsonResponse.expires_in
	}, {
		headers: {
			'access-control-allow-origin': '*',
			Location: `${BASE_URL}/#access_token=${jsonResponse.access_token}`
		}
	});
}
