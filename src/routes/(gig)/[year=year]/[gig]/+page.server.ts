import type { DeezerArtist } from '$lib/deezer';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
export const load: PageServerLoad = async ({ fetch, params }) => {
	try {
		const response = await fetch(`/${params.year}/${params.gig}.json`);
		const artists = (await response.json()) as DeezerArtist[];
		return { artists: artists };
	} catch {
		throw error(404, 'gig not found');
	}
};
