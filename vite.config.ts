import { sveltekit } from '@sveltejs/kit/vite';
import { UserConfig } from 'vite';

const config: UserConfig = {
	server: {
		port: 3000
	},
	plugins: [sveltekit()]
};

export default config;
