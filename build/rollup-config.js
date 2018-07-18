// Config file for running Rollup in "normal" mode (non-watch)

import rollupGitVersion from 'rollup-plugin-git-version'
import json from 'rollup-plugin-json'
import gitRev from 'git-rev-sync'
import pkg from '../package.json'

let {version} = pkg;
let release;

// Skip the git branch+rev in the banner when doing a release build
if (process.env.NODE_ENV === 'release') {
	release = true;
} else {
	release = false;
	const branch = gitRev.branch();
	const rev = gitRev.short();
	version += '+' + branch + '.' + rev;
}

const banner = `/* @preserve
 * Leaflet ${version}, a JS library for interactive maps. http://leafletjs.com
 * (c) 2010-2018 Vladimir Agafonkin, (c) 2010-2011 CloudMade
 */
`;

export default {
	input: 'src/Leaflet.js',
	output: [
		{
			file: pkg.main,
			format: 'umd',
			name: 'L',
			banner: banner,
			sourcemap: true,
      exports: 'named'
		},
		{
			file: pkg.module,
			format: 'es',
			banner: banner,
			sourcemap: true
		}
	],
	legacy: true, // Needed to create files loadable by IE8
	plugins: [
		release ? json() : rollupGitVersion()
	]
};
