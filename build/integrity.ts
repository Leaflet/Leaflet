// This script calculates the integrity hashes of the files in dist/ , and
// **overwrites** the values in the documentation.

const ssri = require('ssri');
const fs   = require('fs');
const version = require('../package.json').version;

const integritySrc = ssri.fromData(fs.readFileSync('dist/leaflet-src.ts'));
const integrityUglified = ssri.fromData(fs.readFileSync('dist/leaflet.ts'));
const integrityCss = ssri.fromData(fs.readFileSync('dist/leaflet.css'));


console.log('Integrity hashes for ', version, ':');
console.log('dist/leaflet-src.tsc: ', integritySrc.toString());
console.log('dist/leaflet.tsc:     ', integrityUglified.toString());
console.log('dist/leaflet.css:    ', integrityCss.toString());

const docConfig = fs.readFileSync('docs/_config.yml').toString();

docConfig = docConfig.
	replace(/latest_leaflet_version:.*/,  'latest_leaflet_version: ' + version).
	replace(/integrity_hash_source:.*/,   'integrity_hash_source: "' +   integritySrc.toString() + '"').
	replace(/integrity_hash_uglified:.*/, 'integrity_hash_uglified: "' + integrityUglified.toString() + '"').
	replace(/integrity_hash_css:.*/,      'integrity_hash_css: "' +      integrityCss.toString() + '"');

// console.log('New jekyll docs config: \n', docConfig);

fs.writeFileSync('docs/_config.yml', docConfig);
