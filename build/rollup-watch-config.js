// Config file for running Rollup in "watch" mode
// This adds a sanity check to help ourselves to run 'rollup -w' as needed.

import rollupGitVersion from 'rollup-plugin-git-version';
import gitRev from 'git-rev-sync';
import pkg from '../package.json';
import {createBanner} from './banner';

const version = `${pkg.version}+${gitRev.branch()}.${gitRev.short()}`;
const banner = createBanner(version);

/** @type {import('rollup').RollupOptions} */
export default {
	input: 'src/Leaflet.js',
	output: {
		file: 'dist/leaflet-src.js',
		format: 'umd',
		name: 'L',
		banner: banner,
		sourcemap: true,
		freeze: false,
		esModule: false
	},
	plugins: [
		rollupGitVersion()
	]
};
