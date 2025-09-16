import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: { 
		adapter: adapter({
			edge: false,
			split: false
		}),
		csp: {
			mode: 'hash',
			directives: {
				'default-src': ["'none'"],
				'script-src': ["'self'", "'sha256-94WxU203ItVdYeuHa4UBPQzWANAxvaHV/BgTnRrE/14='", "'sha256-uQ+6xeJ5jfvD5SmN5W7ZFR4dF9DbDwscZWrWOLfV+RM='", "'sha256-/LCCoSezlnuZAHM2DpaIkWQjSHX701X//FJQjR9N23E='"],
				'style-src': ["'self'", "'unsafe-inline'"],
				'img-src': [
					"'self'",
					'data:',
					'blob:'
				],
				'font-src': ["'self'"],
				'connect-src': ["'self'", "https://jjpqfmlhugguosbjadxr.supabase.co/auth/v1/user"],
				'frame-ancestors': ["'none'"],
				'base-uri': ["'self'"],
				'form-action': ["'self'"]
			}
		}
	 }
};

export default config;
