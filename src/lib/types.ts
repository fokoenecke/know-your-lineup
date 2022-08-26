import type { SpotifyTrack } from './spotify';

export interface Artist {
	name: string;
	spotifyId: string;
	popularity: number;
	genres: string[];
	images: { url: string; height: number; width: number }[];
	followers: { total: number };
	addedAt: number;
}
export interface Gig {
	acts: Array<Artist>;
}

export interface PlaylistTrack extends SpotifyTrack {
	randomPosition: boolean;
}
