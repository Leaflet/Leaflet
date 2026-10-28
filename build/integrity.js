// This script calculates the integrity hashes of the files in dist/ , and
// **overwrites** the values for this version in the site config.
import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import pkg from '../package.json' with {type: 'json'};

const getIntegrity = async (path) => {
	const url = `https://cdn.jsdelivr.net/npm/leaflet@${pkg.version}/dist/${path}`;
	const res = await fetch(url);
	if (!res.ok) { throw new Error(`Failed to fetch ${url}: ${res.status}`); }
	const hash = createHash('sha256').update(Buffer.from(await res.arrayBuffer())).digest('base64');
	return `sha256-${hash}`;
};

const integrityUglified = await getIntegrity('leaflet.js');
const integrityUglifiedGlobal = await getIntegrity('leaflet-global.js');
const integrityCss = await getIntegrity('leaflet.css');

console.log(`Integrity hashes for ${pkg.version}:`);
console.log(`dist/leaflet.js:        ${integrityUglified}`);
console.log(`dist/leaflet-global.js: ${integrityUglifiedGlobal}`);
console.log(`dist/leaflet.css:       ${integrityCss}`);

const configPath = 'build/site.json';
const config = JSON.parse(readFileSync(configPath, 'utf8'));

config.version = pkg.version;
config.versions[pkg.version] = {
	...config.versions[pkg.version],
	'latest_leaflet_version': pkg.version,
	'integrity_hash_css': integrityCss,
	'integrity_hash_uglified': integrityUglified,
	'integrity_hash_global_uglified': integrityUglifiedGlobal
};

writeFileSync(configPath, `${JSON.stringify(config, null, '\t')}\n`);
