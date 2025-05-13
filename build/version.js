import {readFileSync, writeFileSync} from 'node:fs';

// TODO: Replace this with a regular import when ESLint adds support for import assertions.
// See: https://rollupjs.org/guide/en/#importing-packagejson
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));

const fileContent = readFileSync(new URL('../src/Leaflet.js', import.meta.url), 'utf8');

const newContent = fileContent.replace(
	/(\/\/ !!! NEXT LINE IS AUTO-GENERATED VIA `NPM VERSION` !!!\s+export const version = ')[^']+(')/,
	`$1${pkg.version}$2`
);

if (newContent === fileContent) {
	console.error('Version replacement failed: pattern in Leaflet.js not found.');
	process.exit(1); // Exit with non-zero status code
}

writeFileSync(new URL('../src/Leaflet.js', import.meta.url), newContent);

console.log(`Version updated to ${pkg.version}`);
