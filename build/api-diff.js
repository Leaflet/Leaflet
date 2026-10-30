// Compares the public API between two checkouts: their emitted declarations with comments stripped, and the type casts
// and `any`s per source file. Prints a one-line summary as a GitHub Actions output (shown as a job name in PR checks)
// and writes the declaration diff and a table of the changed counts to the job summary. A report, not a check: API
// changes are often intended.
// Usage: node build/api-diff.js <base-dir> <head-dir>, each with `dist/types` and `src`
import {execFileSync} from 'node:child_process';
import {appendFileSync, existsSync, globSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join} from 'node:path';

const CHANGED_LINE = /^[+-](?![+-]{2} )/;
const ANY = /\bany\b/g;
const CAST_END = /^\s*\*\/\s*\(/;

const [baseDir, headDir] = process.argv.slice(2);
const hasBase = existsSync(`${baseDir}/dist/types`);

// the declarations without their docs, so that only signatures are compared
function writeStripped(dir, out) {
	for (const file of globSync('**/*.d.ts', {cwd: `${dir}/dist/types`})) {
		const code = readFileSync(`${dir}/dist/types/${file}`, 'utf8')
			.replace(/^\s*\/\*\*[\s\S]*?\*\/\n/gm, '')
			.replace(/^\s*\/\/.*\n/gm, '');
		mkdirSync(dirname(`${out}/${file}`), {recursive: true});
		writeFileSync(`${out}/${file}`, code);
	}
}

let apiDiff = '';
if (hasBase) {
	const tmp = mkdtempSync(join(tmpdir(), 'api-diff-'));
	writeStripped(baseDir, `${tmp}/base`);
	writeStripped(headDir, `${tmp}/head`);
	try {
		execFileSync('git', ['diff', '--no-index', '--no-color', '--no-prefix', '-U2', 'base', 'head'], {cwd: tmp, encoding: 'utf8'});
	} catch (err) {
		// exits with 1 when the trees differ
		if (err.status !== 1) { throw err; }
		apiDiff = err.stdout;
	}
	rmSync(tmp, {recursive: true});
}
const changedLines = apiDiff.split('\n').filter(line => CHANGED_LINE.test(line));
const added = changedLines.filter(line => line[0] === '+').length;
const removed = changedLines.length - added;

// the type expression of the JSDoc tag whose `{` is at `start`, braces balanced
function typeAt(code, start) {
	let depth = 0;
	for (let i = start; i < code.length; i++) {
		if (code[i] === '{') { depth++; } else if (code[i] === '}' && --depth === 0) { return code.slice(start + 1, i); }
	}
	return '';
}

function countFile(code, isJS) {
	let casts = 0, any = 0;
	if (isJS) {
		for (const m of code.matchAll(/@\w+\s+\{/g)) {
			const start = m.index + m[0].length - 1;
			const type = typeAt(code, start);
			any += type.match(ANY)?.length ?? 0;
			if (m[0].startsWith('@type') && CAST_END.test(code.slice(start + type.length + 2))) { casts++; }
		}
	} else {
		any = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').match(ANY)?.length ?? 0;
	}
	return {casts, any};
}

function countSrc(dir) {
	const counts = {};
	for (const file of globSync('**/*.{js,ts}', {cwd: `${dir}/src`})) {
		counts[file] = countFile(readFileSync(`${dir}/src/${file}`, 'utf8'), file.endsWith('.js'));
	}
	return counts;
}

const metrics = {casts: 'casts', any: 'any'};
const zero = {casts: 0, any: 0};
const head = countSrc(headDir);
const base = hasBase ? countSrc(baseDir) : head;

const total = counts => Object.values(counts).reduce((sum, c) => {
	for (const key of Object.keys(metrics)) { sum[key] += c[key]; }
	return sum;
}, {...zero});
const headTotal = total(head);
const baseTotal = total(base);

const sign = d => (d > 0 ? `+${d}` : `−${-d}`);
const withDelta = (key, h, b) => `${h[key]}${h[key] !== b[key] ? ` (${sign(h[key] - b[key])})` : ''}`;

const apiSummary = !hasBase ? 'api: no base' : changedLines.length ? `api: +${added} −${removed} lines` : 'api: no change';
const counts = Object.entries(metrics).map(([key, label]) => `${withDelta(key, headTotal, baseTotal)} ${label}`);
console.log(`summary=${[apiSummary, ...counts].join(', ')}`);

if (process.env.GITHUB_STEP_SUMMARY) {
	const changed = file => Object.keys(metrics).some(key => (base[file] ?? zero)[key] !== (head[file] ?? zero)[key]);
	const files = [...new Set([...Object.keys(base), ...Object.keys(head)])].sort().filter(changed);
	const cells = file => Object.keys(metrics).map(key => withDelta(key, head[file] ?? zero, base[file] ?? zero));
	const rows = files.map(file => `| ${file} | ${cells(file).join(' | ')} |`);
	const header = `| | ${Object.values(metrics).join(' | ')} |\n|---|${'--:|'.repeat(Object.keys(metrics).length)}\n`;
	const totals = `| **total** | ${Object.keys(metrics).map(key => withDelta(key, headTotal, baseTotal)).join(' | ')} |`;
	const diff = !hasBase ? 'No declarations in the base to compare with.\n' :
		apiDiff ? `\`\`\`diff\n${apiDiff}\`\`\`\n` : 'The declarations are unchanged.\n';
	appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### API\n\n${diff}\n${header}${[...rows, totals].join('\n')}\n`);
}
