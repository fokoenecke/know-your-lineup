import { searchArtist } from '$lib/deezer';
import type { RequestHandler } from './$types';
export const GET: RequestHandler = async ({ params }) => {
	const searchResult = await searchArtist(params.query);
	return new Response(JSON.stringify(searchResult));
};
