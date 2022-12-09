import { fetchArtistAlbums } from '$lib/deezer';
import type { RequestHandler } from './$types';
export const GET: RequestHandler = async ({ params }) => {
	const albums = await fetchArtistAlbums(params.id);
	return new Response(JSON.stringify(albums));
};
