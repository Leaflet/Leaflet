// This script calculates the integrity hashes of the files in dist/ , and
// **overwrites** the values in the documentation.
import {readFileSync, writeFileSync} from 'node:fs';
import https from 'node:https';
import ssri from 'ssri';
import pkg from '../package.json' with {type: 'json'};

const getIntegrity = path => new Promise((resolve) => {
	https.get(`https://cdn.jsdelivr.net/npm/leaflet@${pkg.version}/dist/${path}`, (res) => {
		ssri.fromStream(res, {algorithms: ['sha256']}).then(integrity => resolve(integrity.toString()));
	});
});

const integrityUglified = await getIntegrity('leaflet.js');
const integritySrc = await getIntegrity('leaflet-src.js');
const integrityUglifiedGlobal = await getIntegrity('leaflet-global.js');
const integritySrcGlobal = await getIntegrity('leaflet-global-src.js');
const integrityCss = await getIntegrity('leaflet.css');

console.log(`Integrity hashes for ${pkg.version}:`);
console.log(`dist/leaflet.js:            ${integrityUglified}`);
console.log(`dist/leaflet-src.js:        ${integritySrc}`);
console.log(`dist/leaflet-global.js:     ${integrityUglifiedGlobal}`);
console.log(`dist/leaflet-global-src.js: ${integritySrcGlobal}`);
console.log(`dist/leaflet.css:           ${integrityCss}`);

let docConfig = readFileSync('docs/_config.yml', 'utf8');

docConfig = docConfig
	.replace(/latest_leaflet_version:.*/,  `latest_leaflet_version: ${pkg.version}`)
	.replace(/integrity_hash_source:.*/,   `integrity_hash_source: "${integritySrc}"`)
	.replace(/integrity_hash_uglified:.*/, `integrity_hash_uglified: "${integrityUglified}"`)
	.replace(/integrity_hash_global_source:.*/,   `integrity_hash_global_source: "${integritySrcGlobal}"`)
	.replace(/integrity_hash_global_uglified:.*/, `integrity_hash_global_uglified: "${integrityUglifiedGlobal}"`)
	.replace(/integrity_hash_css:.*/,      `integrity_hash_css: "${integrityCss}"`);

writeFileSync('docs/_config.yml', docConfig);
