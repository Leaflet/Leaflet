import {readFileSync, writeFileSync} from 'node:fs';
import pkg from '../package.json' with {type: 'json'};

const fileContent = readFileSync(new URL('../src/Leaflet.js', import.meta.url), 'utf8');

const newContent = fileContent.replace(
	/(\/\/ !!! NEXT LINE IS AUTO-GENERATED VIA `NPM VERSION` !!!\s+export const version = ')[^']+(')/,
	`$1${pkg.version}$2`
);

if (newContent === fileContent) {
	console.error('Version replacement failed: pattern in Leaflet.js not found.');
	process.exit(1);
}

writeFileSync(new URL('../src/Leaflet.js', import.meta.url), newContent);

console.log(`Version updated to ${pkg.version}`);
