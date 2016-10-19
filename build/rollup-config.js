
// Config file for running Rollup in "normal" mode (non-watch)

// Needed to create files loadable by IE8
import es3 from 'rollup-plugin-es3'
import json from 'rollup-plugin-json'

import gitRev from 'git-rev-sync'

// TODO: There should be a way to skip the git branch+rev when doing a production build
const branch = gitRev.branch();
const rev = gitRev.short();

const version = require('../package.json').version + '+' + branch + '.' + rev;


const banner = `/*
 * Leaflet ` + version + `, a JS library for interactive maps. http://leafletjs.com
 * (c) 2010-2016 Vladimir Agafonkin, (c) 2010-2011 CloudMade
 */`;

export default {
	format: 'umd',
	moduleName: 'L',
	banner: banner,
	entry: 'src/Leaflet.js',
	dest: 'dist/leaflet-rollup-src.js',
	plugins: [
// 		es3(),
		json()
	],
	sourceMap: true
};
