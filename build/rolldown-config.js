import {readFileSync} from 'node:fs';
import {defineConfig} from 'rolldown';
import {transform as transformCss} from 'lightningcss';
import pkg from '../package.json' with {type: 'json'};

/** @type {import('rolldown').Plugin} */
const cssPlugin = {
	name: 'css',
	generateBundle() {
		const {code} = transformCss({
			filename: 'leaflet.css',
			code: readFileSync(new URL('../src/leaflet.css', import.meta.url)),
			minify: true
		});
		this.emitFile({type: 'asset', fileName: 'leaflet.css', source: code});
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
		plugins: [cssPlugin],
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
