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

interface RBFAct {
	id: number;
	name: string;
}
interface RBFArtist extends SpotifyArtist {
	rbfID?: number;
}

export async function searchForActsRBF(acts: string) {
	console.log('suche');
	const actsToUpdate = JSON.parse(acts) as RBFAct[];
	console.log(actsToUpdate);
	const foundArtists: RBFArtist[] = [];
	for (const act of actsToUpdate) {
		try {
			const artist = await searchForArtist(act.name);
			await sleep(200);
			if (artist.name.toLowerCase() !== act.name.toLowerCase()) {
				console.log('ARTIST NAME NOT MATCHING INPUT!!!');
				foundArtists.push({
					id: 'ARTIST NAME NOT MATCHING INPUT!!!',
					rbfID: act.id,
					name: act.name
				} as RBFArtist);
			} else {
				console.log(artist);
				foundArtists.push({ ...artist, rbfID: act.id });
			}
		} catch (err) {
			foundArtists.push({
				id: 'ARTIST NOT FOUND',
				rbfID: act.id,
				name: act.name
			} as RBFArtist);
		}
	}
	console.log(foundArtists);
	const artists = foundArtists
		.filter((foundArtist) => !!foundArtist)
		.map((foundArtist) => ({
			rbfId: foundArtist.rbfID,
			spotifyId: foundArtist.id,
			name: foundArtist.name
		}));
	console.log(JSON.stringify({ acts: artists }));
}

interface JSONAct {
	spotifyId: string;
	rbfId?: number;
}

export async function updateActs(jsonActs: string) {
	const actsToUpdate = JSON.parse(jsonActs) as { acts: JSONAct[] };
	const foundArtists: RBFArtist[] = [];
	for (const act of actsToUpdate.acts) {
		const artist = await getArtist(act.spotifyId);
		await sleep(200);
		console.log(artist);
		foundArtists.push({ rbfID: act.rbfId, ...artist });
	}
	const artists = foundArtists.map((foundArtist) => ({
		spotifyId: foundArtist.id,
		name: foundArtist.name,
		popularity: foundArtist.popularity,
		genres: foundArtist.genres,
		images: foundArtist.images,
		rbfId: foundArtist.rbfID
	}));
	console.log(JSON.stringify({ acts: artists }));
}
