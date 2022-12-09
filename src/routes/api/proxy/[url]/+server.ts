import type { RequestHandler } from './$types';
export const GET: RequestHandler = async ({ params, fetch }) => {
	const response = await fetch(params.url);
	const result = await response.json();
	return new Response(JSON.stringify(result));
};
