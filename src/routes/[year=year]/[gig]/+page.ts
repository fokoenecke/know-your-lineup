import type { LoadEvent } from '@sveltejs/kit';

export async function load({ fetch, params }: LoadEvent) {
	const hurricaneInfoUrl = `/gix/${params.year}/${params.gig}`;
	const response = await fetch(hurricaneInfoUrl);

	return {
		status: response.status,
		gig: response.ok && (await response.json())
	};
}
