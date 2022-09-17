import { get } from 'svelte/store';
import { auth } from '$lib/stores/auth.js';

export interface SpotifyArtist {
	id: string;
	name: string;
	popularity: number;
	followers: { total: number };
	images: { url: string; height: number; width: number }[];
	genres: string[];
}

export interface SpotifyTrack {
	id: string;
	uri: string;
	name: string;
	duration_ms: number;
	popularity: number;
	artists: SpotifyArtist[];
	album: { images: [{ url: string }] };
}

async function getValidAccessToken(): Promise<string> {
	const elapsed = get(auth).expiryDate.getTime() - new Date().getTime();
	let accessToken = get(auth).accessToken;
	if (elapsed / (60 * 1000) < 30) {
		console.log('refreshing access token');
		const refresh_token = get(auth).refreshToken;
		const res = await fetch(`/auth/refresh_token?refresh_token=${refresh_token}`);
		const response = await res.json();
		auth.updateAccessToken(response.access_token);
		const expiresIn = new Date();
		expiresIn.setSeconds(expiresIn.getSeconds() + response.expires_in);
		auth.updateExpiryDate(expiresIn);
		accessToken = response.access_token;
	}
	return accessToken;
}

export function loadSpotifyLib(): Promise<any> {
	console.log('loading spotify lib...');
	return new Promise<void>((resolve, reject) => {
		const scriptTag = document.getElementById('spotify-player');

		if (!scriptTag) {
			const script = document.createElement('script');

			script.id = 'spotify-player';
			script.type = 'text/javascript';
			script.async = false;
			script.defer = true;
			script.src = 'https://sdk.scdn.co/spotify-player.js';
			script.onload = () => resolve();
			script.onerror = (error: any) => reject(new Error(`loadScript: ${error.message}`));

			document.head.appendChild(script);
		} else {
			resolve();
		}
	});
}

export function setupWebPlayer(
	deviceIdCB: (did: string) => void,
	currentTrackCB: (ctrack: Spotify.Track) => void,
	trackEndedCB: () => void
): Spotify.Player {
	let lastState: Spotify.PlaybackState;
	let lastTrack: Spotify.Track;

	const player = new Spotify.Player({
		name: 'Web Playback SDK Quick Start Player',
		getOAuthToken: async (cb) => {
			cb(await getValidAccessToken());
		},
		volume: 0.5
	});

	// Ready
	player.addListener('ready', ({ device_id }) => {
		console.log('Ready with Device ID', device_id);
		deviceIdCB(device_id);
	});

	// Not Ready
	player.addListener('not_ready', ({ device_id }) => {
		console.log('Device ID has gone offline', device_id);
	});

	player.addListener('player_state_changed', (state) => {
		if (state) {
			const current_track = state.track_window.current_track;
			if (current_track.id !== lastTrack?.id) {
				console.log('new track:', current_track.name);
				currentTrackCB(current_track);
				lastTrack = current_track;
			}
			if (
				lastState &&
				state.track_window.previous_tracks.find(
					(x) => x.id === state.track_window.current_track.id
				) &&
				!lastState.paused &&
				state.paused
			) {
				trackEndedCB();
			}
			lastState = state;
		}
	});

	player.addListener('initialization_error', ({ message }) => {
		console.error(message);
	});

	player.addListener('authentication_error', ({ message }) => {
		console.error(message);
	});

	player.addListener('account_error', ({ message }) => {
		console.error(message);
	});
	player.connect();
	return player;
}

interface PlayParams {
	spotify_uri: string;
	position_ms: number;
	player: Spotify.Player;
	deviceId: string;
}

export async function play({
	spotify_uri,
	position_ms,
	player,
	deviceId
}: PlayParams): Promise<void> {
	const token = get(auth).accessToken;
	await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
		method: 'PUT',
		body: JSON.stringify({ uris: [spotify_uri], position_ms: position_ms }),
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});
	player.resume();
}

export async function getArtistsTopTracks(artist: SpotifyArtist): Promise<SpotifyTrack[]> {
	return await getArtistsTopTracksById(artist.id);
}
export async function getArtistsTopTracksById(artistId: string): Promise<SpotifyTrack[]> {
	const token = get(auth).accessToken;
	const res = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=DE`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});

	const response = await res.json();
	const topTracks = response.tracks as SpotifyTrack[];
	return topTracks;
}

export async function getArtistsRelatedArtists(artist: SpotifyArtist): Promise<SpotifyArtist[]> {
	return await getArtistsRelatedArtistsById(artist.id);
}

export async function getArtistsRelatedArtistsById(artistId: string): Promise<SpotifyArtist[]> {
	const token = get(auth).accessToken;
	const res = await fetch(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});

	const response = await res.json();
	const relatedArtists = response.artists as SpotifyArtist[];
	return relatedArtists;
}

export async function getArtist(artistId: string): Promise<SpotifyArtist> {
	const token = get(auth).accessToken;
	const res = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});
	const artist = (await res.json()) as SpotifyArtist;
	return artist;
}

export async function searchForArtist(q: string): Promise<SpotifyArtist> {
	const token = get(auth).accessToken;
	const res = await fetch(
		`https://api.spotify.com/v1/search?q=${q}&type=artist&market=DE&limit=1`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		}
	);
	const response = await res.json();
	const artists = response.artists.items as SpotifyArtist[];
	return artists[0];
}

export async function getUsersTopArtists(): Promise<SpotifyArtist[]> {
	const token = get(auth).accessToken;
	const res = await fetch(`https://api.spotify.com/v1/me/top/artists?limit=50`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});
	const response = await res.json();
	const artists = response.items as SpotifyArtist[];
	return artists;
}
