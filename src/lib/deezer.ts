export interface DeezerArtist {
	id: number;
	name: string;
	link: string;
	share: string;
	picture: string;
	picture_small: string;
	picture_medium: string;
	picture_big: string;
	picture_xl: string;
	nb_album: number;
	nb_fan: string;
	radio: boolean;
	tracklist: string;
	type: string;
}

export interface DeezerAlbum {
	id: number;
	title: string;
	link: string;
	cover: string;
	cover_small: string;
	cover_medium: string;
	cover_big: string;
	cover_xl: string;
	md5_image: string;
	genre_id: number;
	fans: number;
	release_date: string;
	record_type: string;
	tracklist: string;
	explicit_lyrics: boolean;
	type: string;
}

export interface DeezerTrack {
	id: number;
	readable: boolean;
	title: string;
	title_short: string;
	title_version: string;
	link: string;
	duration: number;
	rank: number;
	explicit_lyrics: boolean;
	explicit_content_lyrics: number;
	explicit_content_cover: number;
	preview: string;
	md5_image: string;
	artist: DeezerArtist;
	album: DeezerAlbum;
	type: string;
}

export interface DeezerArtistSearchResult {
	data: DeezerArtist[];
}

export const fetchArtist = async (): Promise<DeezerArtist> => {
	const artist = await fetch('https://api.deezer.com/artist/27');
	return artist.json();
};

export const fetchArtistAlbums = async (artistId: string): Promise<DeezerAlbum[]> => {
	const artistAlbums = await fetch(`https://api.deezer.com/artist/${artistId}/albums`);
	return (await artistAlbums.json()).data;
};

export const searchArtist = async (artistName: string): Promise<DeezerArtist> => {
	const searchResult = await search(artistName, 'artist');
	if (!searchResult || searchResult.data.length === 0) {
		return Promise.reject();
	}

	let foundArtist = searchResult.data[0];
	for (let artist of searchResult.data) {
		if (artist.name.toLowerCase() === artistName.toLowerCase()) {
			foundArtist = artist;
			break;
		}
	}
	return foundArtist;
};

export const search = async (query: string, type: string): Promise<DeezerArtistSearchResult> => {
	const artistSearchResult = await fetch(
		`https://api.deezer.com/search/${type}?q=${encodeURIComponent(query)}`
	);
	return artistSearchResult.json();
};

export const hasSameTitle = (track: DeezerTrack) => {
	return (otherTrack: DeezerTrack) =>
		otherTrack.title_short.toLowerCase() === track.title_short.toLowerCase();
};
export const isFirstOccurrence = (track: DeezerTrack, trackIndex: number, tracks: DeezerTrack[]) =>
	tracks.findIndex(hasSameTitle(track)) === trackIndex;
