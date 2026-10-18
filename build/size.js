// Compares gzipped sizes of dist files between two builds, printing a one-line summary as a GitHub
// Actions output (shown as a job name in PR checks) and failing if any file exceeds its limit.
// Usage: node build/size.js <base-dir> <head-dir>
import {existsSync, readFileSync} from 'node:fs';
import {gzipSync} from 'node:zlib';

const limits = {
	'leaflet.js': 40 * 1024,
	'leaflet.css': 3.2 * 1024,
};

const [baseDir, headDir] = process.argv.slice(2);

const gzipSize = path => (existsSync(path) ? gzipSync(readFileSync(path)).length : null);
const formatDiff = d => (d > 0 ? `+${d} B` : d < 0 ? `-${-d} B` : 'no change');

let failed = false;

const summary = Object.entries(limits).map(([file, limit]) => {
	const size = gzipSize(`${headDir}/${file}`);
	const base = gzipSize(`${baseDir}/${file}`);

	if (size > limit) {
		console.error(`${file} is ${size} B gzipped, over the ${limit} B limit`);
		failed = true;
	}
	const diff = base === null ? '' : ` (${formatDiff(size - base)})`;
	return `${file} ${(size / 1024).toFixed(2)} kB${diff}`;
}).join(', ');

console.log(`summary=${summary}`);
process.exitCode = failed ? 1 : 0;
