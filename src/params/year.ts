import type { ParamMatcher } from '@sveltejs/kit';
export function match(param: string) {
	return /^20[0-9]{2}$/.test(param);
}
