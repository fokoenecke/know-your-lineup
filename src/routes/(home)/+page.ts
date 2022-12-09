import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = () => {
	return {
		gigsInYear: {
			2022: [
				{ name: 'Hurricane', slug: 'hurricane' },
				{ name: 'Wacken', slug: 'wacken' }
			],
			2023: [
				{ name: 'Hurricane', slug: 'hurricane' },
				{ name: 'Wacken', slug: 'wacken' }
			]
		}
	};
};
