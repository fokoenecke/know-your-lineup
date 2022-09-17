import type { LoadEvent } from '@sveltejs/kit';
export async function load({ fetch, params }: LoadEvent) {
	console.log('load', params);
	const gigInfoUrl = `/gix/${params.year}/${params.gig}.json`;
	const response = await fetch(gigInfoUrl);
	console.log(response.status);
	console.log(response.ok);

	return {
		status: response.status,
		gig: response.ok && (await response.json())
	};
}
