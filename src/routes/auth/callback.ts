import type { RequestEvent } from '@sveltejs/kit';
import { config } from 'dotenv';
config();

const BASE_URL = process.env.BASE_URL;
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URL = process.env.SPOTIFY_REDIRECT_URL || '';

export async function GET(event: RequestEvent) {
	const code = event.url.searchParams.get('code') || '';
	const state = event.params.state;

	const params = {
		code: code,
		redirect_uri: REDIRECT_URL,
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
			Authorization: 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
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
