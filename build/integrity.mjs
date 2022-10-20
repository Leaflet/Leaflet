// This script calculates the integrity hashes of the files in dist/ , and
// **overwrites** the values in the documentation.
import {readFileSync, writeFileSync} from 'node:fs';
import https from 'node:https';
import ssri from 'ssri';

// TODO: Replace this with a regular import when ESLint adds support for import assertions.
// See: https://rollupjs.org/guide/en/#importing-packagejson
const {version} = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));

const getIntegrity = async path => new Promise((resolve) => {
	https.get(`https://unpkg.com/leaflet@${version}/dist/${path}`, (res) => {
		ssri.fromStream(res, {algorithms: ['sha256']}).then(integrity => resolve(integrity.toString()));
	});
});

const integrityUglified = await getIntegrity('leaflet.js');
const integritySrc = await getIntegrity('leaflet-src.js');
const integrityCss = await getIntegrity('leaflet.css');

console.log(`Integrity hashes for ${version}:`);
console.log(`dist/leaflet.js:     ${integrityUglified}`);
console.log(`dist/leaflet-src.js: ${integritySrc}`);
console.log(`dist/leaflet.css:    ${integrityCss}`);

let docConfig = readFileSync('docs/_config.yml', 'utf8');

docConfig = docConfig
	.replace(/latest_leaflet_version:.*/,  `latest_leaflet_version: ${version}`)
	.replace(/integrity_hash_source:.*/,   `integrity_hash_source: "${integritySrc}"`)
	.replace(/integrity_hash_uglified:.*/, `integrity_hash_uglified: "${integrityUglified}"`)
	.replace(/integrity_hash_css:.*/,      `integrity_hash_css: "${integrityCss}"`);

writeFileSync('docs/_config.yml', docConfig);
