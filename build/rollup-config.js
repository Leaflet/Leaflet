import json from '@rollup/plugin-json';
import {readFileSync} from 'node:fs';
import {defineConfig} from 'rollup';
import rollupGitVersion from 'rollup-plugin-git-version';
import {simpleGit} from 'simple-git';

// TODO: Replace this with a regular import when ESLint adds support for import assertions.
// See: https://rollupjs.org/guide/en/#importing-packagejson
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));
const release = process.env.NODE_ENV === 'release';
const version = await getVersion();
const banner = createBanner(version);

export default defineConfig({
	input: 'src/Leaflet.js',
	output: [
		{
			file: pkg.exports['.'],
			format: 'es',
			banner,
			sourcemap: true,
			generatedCode: 'es2015'
		},
		{
			file: './dist/leaflet-global-src.js',
			format: 'umd',
			banner,
			sourcemap: true,
			generatedCode: 'es2015',
			name: 'L',
			noConflict: true,
			freeze: false
		}
	],
	plugins: [
		release ? json() : rollupGitVersion(),
		{
			name: 'copy-leaflet-assets',
			generateBundle() {
				const fileNames = [
					'leaflet.css',
					'images/logo.svg',
					'images/layers.svg',
					'images/marker-icon.png',
					'images/marker-icon-2x.png',
					'images/marker-shadow.png',
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
