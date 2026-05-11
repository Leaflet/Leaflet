import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vitest/config';
import {playwright} from '@vitest/browser-playwright';

const touch = process.env.VITE_TOUCH === '1';

// Vitest's tester iframe defaults to a small viewport (414x896) under Playwright's
// touch context, which truncates `document.elementFromPoint` beyond that range and
// breaks specs simulating pointer events at desktop coordinates. Pin a desktop
// viewport so behavior is identical between touch and non-touch runs.
const viewport = {width: 1280, height: 720};

export default defineConfig({
	build: {
		assetsInlineLimit: 0,
	},
	resolve: {
		alias: {
			leaflet: fileURLToPath(new URL('./src/Leaflet.js', import.meta.url)),
		},
	},
	test: {
		globals: true,
		include: ['spec/suites/**/*Spec.js'],
		setupFiles: ['spec/setup.js'],
		// Bound individual test/hook/teardown durations so a stuck spec fails
		// fast with a useful stack instead of hanging the whole worker. Long
		// flyTo specs (~2-3s normally) set their own higher timeout per-test.
		testTimeout: 8000,
		hookTimeout: 8000,
		teardownTimeout: 5000,
		browser: {
			enabled: true,
			provider: playwright({contextOptions: {hasTouch: touch}}),
			headless: true,
			screenshotFailures: false,
			viewport,
			instances: [
				{browser: 'chromium'},
				{browser: 'firefox'},
				{browser: 'webkit'},
				{
					browser: 'chromium',
					name: 'chromium-retina',
					provider: playwright({contextOptions: {hasTouch: touch, deviceScaleFactor: 2}}),
				},
			],
		},
		coverage: {
			provider: 'v8',
			include: ['src/**/*.js'],
			reporter: ['text-summary', 'html'],
			reportsDirectory: 'coverage',
		},
	},
});
