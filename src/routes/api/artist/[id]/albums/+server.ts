import { fetchArtistAlbums } from '#lib/deezer.ts';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const albums = await fetchArtistAlbums(params.id);
	return Response.json(albums);
};
