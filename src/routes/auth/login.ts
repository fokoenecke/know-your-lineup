import type { RequestEvent } from '@sveltejs/kit';
import { config } from 'dotenv';
config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '';
const REDIRECT_URL = process.env.SPOTIFY_REDIRECT_URL || '';

const generateRandomString = (len: number) => {
	return Math.random()
		.toString(36)
		.substring(2, 2 + len);
};

export async function GET(event: RequestEvent) {
	const state = generateRandomString(16);
	const scope = 'user-read-private user-top-read user-read-email streaming';

	const params = {
		response_type: 'code',
		client_id: CLIENT_ID,
		scope: scope,
		redirect_uri: REDIRECT_URL,
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
