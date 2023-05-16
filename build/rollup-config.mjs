import json from '@rollup/plugin-json';
import {readFileSync} from 'node:fs';
import rollupGitVersion from 'rollup-plugin-git-version';
import {simpleGit} from 'simple-git';

// TODO: Replace this with a regular import when ESLint adds support for import assertions.
// See: https://rollupjs.org/guide/en/#importing-packagejson
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));
const release = process.env.NODE_ENV === 'release';
const version = await getVersion();
const banner = createBanner(version);

/** @type {import('rollup').RollupOptions} */
const config = {
	input: 'src/LeafletWithGlobals.js',
	output: [
		{
			file: pkg.main,
			format: 'umd',
			name: 'leaflet',
			banner,
			sourcemap: true,
			freeze: false,
			esModule: false
		},
		{
			file: pkg.module,
			format: 'es',
			banner,
			sourcemap: true,
			freeze: false
		}
	],
	plugins: [
		release ? json() : rollupGitVersion()
	]
};

export default config;

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
