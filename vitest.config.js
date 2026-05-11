import {defineConfig} from 'vitest/config';
import {playwright} from '@vitest/browser-playwright';

const touch = process.env.VITE_TOUCH === '1';

export default defineConfig({
	build: {
		assetsInlineLimit: 0,
	},
	test: {
		globals: true,
		include: ['spec/suites/**/*Spec.js'],
		setupFiles: ['spec/setup.js'],
		browser: {
			enabled: true,
			provider: playwright(),
			headless: true,
			screenshotFailures: false,
			instances: [
				{browser: 'chromium', context: {hasTouch: touch}},
				{browser: 'firefox', context: {hasTouch: touch}},
				{browser: 'webkit', context: {hasTouch: touch}},
				{
					browser: 'firefox',
					name: 'firefox-retina',
					context: {hasTouch: touch, deviceScaleFactor: 2},
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
