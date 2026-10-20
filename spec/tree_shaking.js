// Checks that bundlers can drop any part of Leaflet that isn't used: a bundle that imports every module but uses
// nothing must come out empty, so no module may patch another (e.g. with `include` or `addInitHook`) or run code
// with possible side effects at the top level. Also checks that each module can be imported on its own, which an
// import cycle breaks when it reaches a class before it's defined.

import {readdirSync} from 'node:fs';
import {registerHooks} from 'node:module';
import {fileURLToPath} from 'node:url';
import {rollup} from 'rollup';
import json from '@rollup/plugin-json';

const srcURL = new URL('../src/', import.meta.url);
const srcDir = fileURLToPath(srcURL);
const modules = readdirSync(srcDir, {recursive: true}).filter(file => file.endsWith('.js'));
let failed = false;

const sideEffects = [];
const bundle = await rollup({
	input: 'entry',
	experimentalLogSideEffects: true,
	onLog(level, log, handler) {
		if (log.code === 'FIRST_SIDE_EFFECT') {
			sideEffects.push(log.message.replaceAll(srcDir, ''));
		} else if (log.code !== 'CIRCULAR_DEPENDENCY' && log.code !== 'EMPTY_BUNDLE') {
			handler(level, log);
		}
	},
	plugins: [json(), {
		resolveId: id => (id === 'entry' ? id : null),
		load: id => (id === 'entry' ? modules.map(file => `import '${srcDir}${file}';`).join('\n') : null)
	}]
});
const {output: [chunk]} = await bundle.generate({format: 'es'});

if (chunk.code.trim()) {
	failed = true;
	console.error('Unused modules are kept in bundles because of side effects at import, e.g. a top-level call or ' +
		`a \`new\` in a static field that needs a /* @__PURE__ */ annotation:\n\n${sideEffects.join('\n\n')}\n`);
}

// a module imported with `?run=N` pulls in all of its dependencies with the same query, so every run gets its own graph
registerHooks({
	resolve(specifier, context, nextResolve) {
		const result = nextResolve(specifier, context);
		const search = context.parentURL && new URL(context.parentURL).search;
		if (search && result.url.startsWith(srcURL.href)) { result.url += search; }
		return result;
	}
});

for (const [i, file] of modules.entries()) {
	try {
		// eslint-disable-next-line no-await-in-loop
		await import(`${new URL(file, srcURL)}?run=${i}`);
	} catch (err) {
		failed = true;
		console.error(`${file} can't be imported on its own: ${err.message}`);
	}
}

if (failed) { process.exit(1); }
console.log(`All ${modules.length} modules are free of side effects and can be imported on their own.`);
