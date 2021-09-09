// Config file for running Rollup in "watch" mode
// This adds a sanity check to help ourselves to run 'rollup -w' as needed.

import rollupGitVersion from 'rollup-plugin-git-version'
import gitRev from 'git-rev-sync'

import esBuild from 'rollup-plugin-esbuild'

const branch = gitRev.branch();
const rev = gitRev.short();
const version = require('../package.json').version + '+' + branch + '.' + rev;
const banner = `/* @preserve
 * Leaflet ${version}, a JS library for interactive maps. http://leafletjs.com
 * (c) 2010-2021 Vladimir Agafonkin, (c) 2010-2011 CloudMade
 */
`;

export default {
	input: 'leaflet-entry:',
	output: {
		file: 'dist/leaflet-src.js',
		format: 'iife',
		banner: banner,
		sourcemap: true,
		freeze: false,
	},
	plugins: [
		{
			name: 'leaflet',
			resolveId(id) {
				if (id === 'leaflet-entry:') return id
				if (id[0] === '@') return __dirname + '/..' + id.slice(1)
			},
			load(id) {
				if (id === 'leaflet-entry:') {
					return `
            import * as LL from '@/src/Leaflet.js'
            var oldL = window.L;

            function noConflict() {
              window.L = oldL;
              return LL;
            }

            // Always export us to window global (see #2364)
            window.L = LL;
            window.L.noConflict = noConflict`;
				}
			}
		},
		esBuild({
			target: 'es6'
		}),
		rollupGitVersion()
	]
};
