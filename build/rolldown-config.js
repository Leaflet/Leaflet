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
	generateBundle({format}) {
		if (format !== 'es') { return; }
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

export default defineConfig({
	input: './src/Leaflet.js',
	plugins: [staticAssetsPlugin],
	output: [
		{
			...commonOptions,
			file: './dist/leaflet.js',
		},
		{
			...commonOptions,
			file: './dist/leaflet-global.js',
			format: 'iife',
			name: 'L',
		}
	]
});
