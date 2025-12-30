import terser from '@rollup/plugin-terser';
import {readFileSync} from 'node:fs';
import {defineConfig} from 'rollup';
import {simpleGit} from 'simple-git';
import pkg from '../package.json' with {type: 'json'};

const version = await getVersion();
const banner = `/* @preserve
 * Leaflet ${version}, a JS library for interactive maps. https://leafletjs.com
 * (c) 2010-${new Date().getFullYear()} Volodymyr Agafonkin, (c) 2010-2011 CloudMade
 */
`;

const STATIC_ASSETS = [
	'leaflet.css',
	'images/logo.svg',
	'images/layers.svg',
	'images/marker-icon.svg',
	'images/marker-shadow.svg'
];

/** @type {import('rollup').OutputPlugin} */
const staticAssetsPlugin = {
	name: 'static-assets',
	generateBundle() {
		for (const fileName of STATIC_ASSETS) {
			const source = readFileSync(new URL(`../src/${fileName}`, import.meta.url));
			this.emitFile({type: 'asset', fileName, source});
		}
	},
};

/** @type {import('rollup').OutputOptions} */
const commonOptions = {
	banner,
	sourcemap: true
};

/** @type {import('rollup').OutputOptions} */
const umdOptions = {
	...commonOptions,
	name: 'L',
	format: 'umd',
	freeze: false,
	noConflict: true,
	amd: {
		id: pkg.name
	}
};

export default defineConfig({
	input: './src/Leaflet.js',
	output: [
		{
			...commonOptions,
			file: pkg.exports['.'],
			plugins: [staticAssetsPlugin]
		},
		{
			...commonOptions,
			file: './dist/leaflet.js',
			plugins: [terser()],
		},
		{
			...umdOptions,
			file: './dist/leaflet-global-src.js',
		},
		{
			...umdOptions,
			file: './dist/leaflet-global.js',
			plugins: [terser()],
		}
	]
});

async function getVersion() {
	// Skip the git branch+rev in the banner when doing a release build
	if (process.env.NODE_ENV === 'release') {
		return pkg.version;
	}

	const git = simpleGit();
	const branch = (await git.branch()).current;
	const commit = await git.revparse(['--short', 'HEAD']);

	return `${pkg.version}+${branch}.${commit}`;
}
