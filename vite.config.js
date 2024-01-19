import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		include: [
			'gsap',
			'@gsap/shockingly',
		],
	},
	build: {
		rollupOptions: {
			external: ['html-entities'],
		},
	}
});
