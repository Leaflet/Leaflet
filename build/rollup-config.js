import {readFileSync} from 'node:fs';
import {defineConfig} from 'rolldown';
import {simpleGit} from 'simple-git';
import pkg from '../package.json' with {type: 'json'};

const release = process.env.NODE_ENV === 'release';
const version = await getVersion();
const banner = createBanner(version);

export default defineConfig({
	input: 'src/LeafletWithGlobals.js',
	output: [
		{
			file: pkg.exports['.'],
			format: 'es',
			banner,
			sourcemap: true,
			freeze: false
		},
		{
			file: './dist/leaflet.js',
			format: 'es',
			banner,
			minify: true,
			sourcemap: true,
			freeze: false
		},
		{
			file: './dist/leaflet-global.js',
			name: 'leaflet',
			format: 'umd',
			banner,
			minify: true,
			sourcemap: true,
			freeze: false,
			esModule: false
		},
		{
			file: './dist/leaflet-global-src.js',
			name: 'leaflet',
			format: 'umd',
			banner,
			minify: false,
			sourcemap: true,
			freeze: false,
			esModule: false
		}
	],
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
});

async function getVersion() {
	// Skip the git branch+rev in the banner when doing a release build
	if (release) {
		return pkg.version;
	}

	const git = simpleGit();
	const branch = (await git.branch()).current;
	const commit = await git.revparse(['--short', 'HEAD']);

	return `${pkg.version}+${branch}.${commit}`;
}

export function createBanner(version) {
	return `/* @preserve
 * Leaflet ${version}, a JS library for interactive maps. https://leafletjs.com
 * (c) 2010-${new Date().getFullYear()} Volodymyr Agafonkin, (c) 2010-2011 CloudMade
 */
`;
}
