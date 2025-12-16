import {readFileSync} from 'node:fs';
import {defineConfig} from 'rolldown';
import pkg from '../package.json' with {type: 'json'};

const release = process.env.NODE_ENV === 'release';
const banner = `/* @preserve
 * Leaflet ${pkg.version}, a JS library for interactive maps. https://leafletjs.com
 * (c) 2010-${new Date().getFullYear()} Volodymyr Agafonkin, (c) 2010-2011 CloudMade
 */
`;

export default defineConfig({
	input: 'src/LeafletWithGlobals.js',
	output: [
		{
			file: pkg.exports['.'],
			format: 'es',
			banner,
			sourcemap: true,
			plugins: [
				{
					name: 'copy-leaflet-assets',
					generateBundle() {
						const fileNames = [
							'leaflet.css',
							'images/logo.svg',
							'images/layers.svg',
							'images/marker-icon.svg',
							'images/marker-shadow.svg',
						];
						for (const fileName of fileNames) {
							const source = readFileSync(new URL(`../src/${fileName}`, import.meta.url));
							this.emitFile({type: 'asset',	fileName, source});
						}
					},
				},
			]
		},
		release && {
			file: './dist/leaflet.js',
			format: 'es',
			banner,
			minify: true,
			sourcemap: true
		},
		release && {
			file: './dist/leaflet-global.js',
			name: 'leaflet',
			format: 'umd',
			banner,
			minify: true,
			sourcemap: true,
			esModule: false
		},
		release && {
			file: './dist/leaflet-global-src.js',
			name: 'leaflet',
			format: 'umd',
			banner,
			sourcemap: true,
			esModule: false
		}
	]
});
