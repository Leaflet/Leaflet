// Config file for running Rollup in "normal" mode (non-watch)

// Make sure to run `npm run prerollup` script before executing rollup, so that the "src/version.js" file is created.
import version from '../src/version';

const banner = `/* @preserve
 * Leaflet ${version}, a JS library for interactive maps. http://leafletjs.com
 * (c) 2010-2017 Vladimir Agafonkin, (c) 2010-2011 CloudMade
 */
`;

export default {
	input: 'src/Leaflet.js',
	output: {
		file: 'dist/leaflet-src.js',
		format: 'umd',
		name: 'L',
		banner: banner,
		sourcemap: true
	},
	legacy: true // Needed to create files loadable by IE8
};
