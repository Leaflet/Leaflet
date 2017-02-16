
// Config file for running Rollup in "normal" mode (non-watch)

import rollupGitVersion from 'rollup-plugin-git-version'
import json from 'rollup-plugin-json'

import gitRev from 'git-rev-sync'


let version = require('../package.json').version;
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


const banner = `/*
 * Leaflet ` + version + `, a JS library for interactive maps. http://leafletjs.com
 * (c) 2010-2016 Vladimir Agafonkin, (c) 2010-2011 CloudMade
 */`;

export default {
	format: 'umd',
	moduleName: 'L',
	banner: banner,
	entry: 'src/Leaflet.js',
	dest: 'dist/leaflet-src.js',
	plugins: [
		release ? json() : rollupGitVersion(),
	],
	sourceMap: true,
	legacy: true // Needed to create files loadable by IE8
};
