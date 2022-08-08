import { getArtist, searchForArtist, type SpotifyArtist } from './spotify';

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function searchForActs(acts: string) {
	console.log('suche');
	const actArray = acts.split(/,|\n+/).map((act) => act.trim());
	console.log(actArray);
	const foundArtists: SpotifyArtist[] = [];
	for (const act of actArray) {
		try {
			const artist = await searchForArtist(act);
			await sleep(300);
			if (artist.name.toLowerCase() !== act.toLowerCase()) {
				console.log('ARTIST NAME NOT MATCHING INPUT!!!');
			}
			console.log(artist);
			foundArtists.push(artist);
		} catch (err) {
			console.log(act, err);
		}
	}
	console.log(foundArtists);
	const artists = foundArtists
		.filter((foundArtist) => !!foundArtist)
		.map((foundArtist) => ({
			spotifyId: foundArtist.id,
			name: foundArtist.name
		}));
	console.log(JSON.stringify({ acts: artists }));
}

interface JSONAct {
	spotifyId: string;
}

export async function updateActs(jsonActs: string) {
	const actsToUpdate = JSON.parse(jsonActs) as { acts: JSONAct[] };
	const foundArtists: SpotifyArtist[] = [];
	for (const act of actsToUpdate.acts) {
		const artist = await getArtist(act.spotifyId);
		await sleep(300);
		console.log(artist);
		foundArtists.push(artist);
	}
	const artists = foundArtists.map((foundArtist) => ({
		spotifyId: foundArtist.id,
		name: foundArtist.name,
		popularity: foundArtist.popularity,
		genres: foundArtist.genres,
		images: foundArtist.images
	}));
	console.log(JSON.stringify({ acts: artists }));
}
