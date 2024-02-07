import {defineConfig} from 'vitest/config';

export default defineConfig({
	resolve: {
		alias: {
			'leaflet': '/src/Leaflet.js',
		}
	},
	test: {
		include: ['./spec/suites/**/*.js'],
		globals: true,
		browser: {
			enabled: true,
			provider: 'playwright',
			name: 'chromium',
		},
	},
});
