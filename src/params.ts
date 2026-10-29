import { defineParams } from '@sveltejs/kit/params';

export const params = defineParams({
	year: (param: string) => (/^20[0-9]{2}$/.test(param) ? param : undefined)
});
