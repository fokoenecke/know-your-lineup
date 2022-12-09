import type { DeezerArtist } from '$lib/deezer';
import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';

interface Gig {
	name: string;
	artists: DeezerArtist[];
}

export const load: LayoutServerLoad = async ({ fetch, params }) => {
	try {
		const response = await fetch(`/${params.year}/${params.gig}.json`);
		const gig = (await response.json()) as Gig;
		return gig;
	} catch {
		throw error(404, 'gig not found');
	}
};
