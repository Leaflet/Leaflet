// Config file for running Rollup in "normal" mode (non-watch)

import rollupGitVersion from 'rollup-plugin-git-version';
import json from '@rollup/plugin-json';
import gitRev from 'git-rev-sync';
import pkg from '../package.json';
import {createBanner} from './banner';

const release = process.env.NODE_ENV === 'release';
// Skip the git branch+rev in the banner when doing a release build
const version = release ? pkg.version : `${pkg.version}+${gitRev.branch()}.${gitRev.short()}`;
const banner = createBanner(version);

const outro = `var oldL = window.L;
exports.noConflict = function() {
	window.L = oldL;
	return this;
}

// Always export us to window global (see #2364)
window.L = exports;`;

/** @type {import('rollup').RollupOptions} */
export default {
	input: 'src/Leaflet.js',
	output: [
		{
			file: pkg.main,
			format: 'umd',
			name: 'L',
			banner: banner,
			outro: outro,
			sourcemap: true,
			freeze: false,
			esModule: false
		},
		{
			file: 'dist/leaflet-src.esm.js',
			format: 'es',
			banner: banner,
			sourcemap: true,
			freeze: false
		}
	],
	plugins: [
		release ? json() : rollupGitVersion()
	]
};
