import { searchArtist } from '#lib/deezer.ts';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const searchResult = await searchArtist(params.query);
	return Response.json(searchResult);
};
