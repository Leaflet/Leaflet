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

// short labels for the job name; the rest only go to the job summary
const summaryLabels = {'leaflet.js': 'JS', 'map+tiles': 'map+tiles', 'leaflet.css': 'CSS'};

const [baseDir, headDir] = process.argv.slice(2);
const hasBase = existsSync(`${baseDir}/dist`);

const gzipSize = path => (existsSync(path) ? gzipSync(readFileSync(path)).length : null);
const kB = bytes => `${+(bytes / 1000).toFixed(2)} kB`;
const sign = d => (d > 0 ? '+' : '-');

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

// the job name rounds changes of 1 kB or more and leaves out unchanged ones; the table shows exact bytes
const shortDiff = d => (Math.abs(d) < 1000 ? `${sign(d)}${Math.abs(d)} B` : `${sign(d)}${kB(Math.abs(d))}`);
const summary = Object.entries(summaryLabels).map(([name, label]) => {
	const {size, base} = rows.find(row => row.name === name);
	const d = base === null ? 0 : size - base;
	return `${label} ${kB(size)}${d ? ` (${shortDiff(d)})` : ''}`;
});

console.log(`summary=${summary.join(', ')}`);

if (process.env.GITHUB_STEP_SUMMARY) {
	const diff = ({size, base}) => (base === null ? '' : size === base ? 'no change' : `${sign(size - base)}${Math.abs(size - base)} B`);
	const table = rows.map(row => `| ${row.name} | ${row.size} B | ${diff(row)} |`);
	appendFileSync(process.env.GITHUB_STEP_SUMMARY, `| | gzipped | change |\n|---|--:|--:|\n${table.join('\n')}\n`);
}

process.exitCode = failed ? 1 : 0;
