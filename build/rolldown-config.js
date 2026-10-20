import {readFileSync} from 'node:fs';
import {defineConfig} from 'rolldown';
import pkg from '../package.json' with {type: 'json'};

const STATIC_ASSETS = [
	'leaflet.css',
	'images/layers.svg',
	'images/marker-icon.svg',
	'images/marker-shadow.svg'
];

/** @type {import('rolldown').Plugin} */
const staticAssetsPlugin = {
	name: 'static-assets',
	generateBundle() {
		for (const fileName of STATIC_ASSETS) {
			const source = readFileSync(new URL(`../src/${fileName}`, import.meta.url));
			this.emitFile({type: 'asset', fileName, source});
		}
	},
};

const banner = `/* @preserve
 * Leaflet ${pkg.version}, a JS library for interactive maps. https://leafletjs.com
 * (c) 2010-${new Date().getFullYear()} Volodymyr Agafonkin, (c) 2010-2011 CloudMade
 */`;

/** @type {import('rolldown').OutputOptions} */
const commonOptions = {
	postBanner: banner,
	minify: true,
	comments: false,
	sourcemap: true
};

// keep the minifier from emitting syntax newer than what the sources may use
const transform = {target: 'es2022'};

export default defineConfig([
	{
		input: './src/Leaflet.js',
		plugins: [staticAssetsPlugin],
		transform,
		output: {
			...commonOptions,
			file: './dist/leaflet.js',
		}
	},
	{
		input: './build/global.js',
		transform,
		output: {
			...commonOptions,
			file: './dist/leaflet-global.js',
			format: 'iife',
			name: 'L',
			exports: 'default',
		}
	}
]);
