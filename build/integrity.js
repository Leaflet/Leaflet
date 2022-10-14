// This script calculates the integrity hashes of the files in dist/ , and
// **overwrites** the values in the documentation.

const ssri = require('ssri');
const fs = require('fs');
const https = require('https');
const version = require('../package.json').version;

const getIntegrity = async (path) => new Promise((resolve) => {
	https.get(`https://unpkg.com/leaflet@${version}/dist/${path}`, (res) => {
		ssri.fromStream(res, {algorithms: ['sha256']}).then(integrity => resolve(integrity.toString()));
	});
});

(async () => {
	const integrityUglified = await getIntegrity('leaflet.js');
	const integritySrc = await getIntegrity('leaflet-src.js');
	const integrityCss = await getIntegrity('leaflet.css');

	console.log(`Integrity hashes for ${version}:`);
	console.log(`dist/leaflet.js:     ${integrityUglified}`);
	console.log(`dist/leaflet-src.js: ${integritySrc}`);
	console.log(`dist/leaflet.css:    ${integrityCss}`);

	let docConfig = fs.readFileSync('docs/_config.yml', 'utf8');

	docConfig = docConfig
		.replace(/latest_leaflet_version:.*/,  'latest_leaflet_version: ' + version)
		.replace(/integrity_hash_source:.*/,   'integrity_hash_source: "' +   integritySrc + '"')
		.replace(/integrity_hash_uglified:.*/, 'integrity_hash_uglified: "' + integrityUglified + '"')
		.replace(/integrity_hash_css:.*/,      'integrity_hash_css: "' +      integrityCss + '"');

	fs.writeFileSync('docs/_config.yml', docConfig);
})();
