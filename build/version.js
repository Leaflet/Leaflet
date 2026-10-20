// Runs on `npm version` and writes the new version into src/Leaflet.js, which bundlers consume directly, so it can't
// import package.json (plain Rollup can't without a plugin).
import {readFileSync, writeFileSync} from 'node:fs';
import pkg from '../package.json' with {type: 'json'};

const url = new URL('../src/Leaflet.js', import.meta.url);
const code = readFileSync(url, 'utf8');
const updated = code.replace(/^export const version = '[^']*';$/m, `export const version = '${pkg.version}';`);

if (!updated.includes(`'${pkg.version}'`)) { throw new Error('No version line found in src/Leaflet.js'); }
writeFileSync(url, updated);
