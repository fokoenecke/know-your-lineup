import type { RequestEvent } from '@sveltejs/kit';
import fs from 'fs';
import { basename, extname } from 'path';

// ----- GET -----
export async function load(event: RequestEvent) {
	// const path = './static/gix';

	// const yearGigs: any = {};
	// fs.readdirSync(path).forEach((year) => {
	// 	const yearDir = `${path}/${year}`;
	// 	if (fs.lstatSync(yearDir).isDirectory()) {
	// 		if (!(year in yearGigs)) {
	// 			yearGigs[year] = [];
	// 		}
	// 		fs.readdirSync(yearDir).forEach((gig) => {
	// 			const gigFile = `${yearDir}/${gig}`;
	// 			const gigStats = fs.lstatSync(gigFile);
	// 			if (gigStats.isFile() && extname(gigFile) === '.json') {
	// 				const gigName = basename(gigFile, extname(gigFile));
	// 				yearGigs[year]?.push(gigName);
	// 			}
	// 		});
	// 	}
	// });

	const yearGigs: { [key: string]: string[] } = { 2022: ['hurricane', 'wacken', 'reeperbahn'] };

	return { gigs: yearGigs };
}
