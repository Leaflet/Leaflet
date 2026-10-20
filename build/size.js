// Compares gzipped sizes of dist files and of minified bundles of typical imports from src between two checkouts,
// printing a one-line summary as a GitHub Actions output (shown as a job name in PR checks) and a table for the job
// summary, and failing if any dist file exceeds its limit.
// Usage: node build/size.js <base-dir> <head-dir>, each with `dist` and `src`
import {appendFileSync, existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {gzipSync} from 'node:zlib';
import {rollup} from 'rollup';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

const limits = {
	'leaflet.js': 40 * 1024,
	'leaflet.css': 3.2 * 1024,
};

const bundles = {
	'map+tiles': 'LeafletMap, TileLayer',
	'map+tiles+marker': 'LeafletMap, TileLayer, Marker',
	'map+tiles+polygon': 'LeafletMap, TileLayer, Polygon',
};

// shown in the job name; the rest only go to the job summary
const summaryRows = ['leaflet.js', 'leaflet.css', 'map+tiles'];

const [baseDir, headDir] = process.argv.slice(2);
const hasBase = existsSync(`${baseDir}/dist`);

const gzipSize = path => (existsSync(path) ? gzipSync(readFileSync(path)).length : null);
const formatDiff = d => (d > 0 ? `+${d} B` : d < 0 ? `-${-d} B` : 'no change');

async function bundleSize(dir, imports) {
	const code = `import {${imports}} from '${resolve(dir, 'src/Leaflet.js')}'; console.log(${imports});`;
	const build = await rollup({
		input: 'entry',
		onLog() {},
		plugins: [json(), {
			resolveId: id => (id === 'entry' ? id : null),
			load: id => (id === 'entry' ? code : null)
		}]
	});
	const {output: [chunk]} = await build.generate({format: 'es', plugins: [terser()]});
	return gzipSync(chunk.code).length;
}

let failed = false;
const rows = [];

for (const [file, limit] of Object.entries(limits)) {
	const size = gzipSize(`${headDir}/dist/${file}`);
	const base = hasBase ? gzipSize(`${baseDir}/dist/${file}`) : null;

	if (size > limit) {
		console.error(`${file} is ${size} B gzipped, over the ${limit} B limit`);
		failed = true;
	}
	rows.push({name: file, size, base});
}

for (const [name, imports] of Object.entries(bundles)) {
	// eslint-disable-next-line no-await-in-loop
	const [size, base] = await Promise.all([bundleSize(headDir, imports), hasBase ? bundleSize(baseDir, imports) : null]);
	rows.push({name, size, base});
}

const diff = ({size, base}) => (base === null ? '' : formatDiff(size - base));
const summary = rows
	.filter(({name}) => summaryRows.includes(name))
	.map(row => `${row.name} ${(row.size / 1024).toFixed(2)} kB${row.base === null ? '' : ` (${diff(row)})`}`);

console.log(`summary=${summary.join(', ')}`);

if (process.env.GITHUB_STEP_SUMMARY) {
	const table = rows.map(row => `| ${row.name} | ${row.size} B | ${diff(row)} |`);
	appendFileSync(process.env.GITHUB_STEP_SUMMARY, `| | gzipped | change |\n|---|--:|--:|\n${table.join('\n')}\n`);
}

process.exitCode = failed ? 1 : 0;
