// Fails if importing one module changes what another one exports, e.g. with `include` or `addInitHook`, which
// breaks tree-shaking, or if a module can't be imported on its own, e.g. because of an import cycle that reaches
// a class before it's defined. Each module is imported alone into a fresh copy of the module graph, and its
// exports are recorded before and after importing all the others.

import {readdirSync, readFileSync} from 'node:fs';
import {registerHooks} from 'node:module';

const srcURL = new URL('../src/', import.meta.url);
const modules = readdirSync(srcURL, {recursive: true}).filter(file => file.endsWith('.js'));

// a module imported with `?run=N` pulls in all of its dependencies with the same query, so every run gets its own graph
const sources = new Map();
registerHooks({
	resolve(specifier, context, nextResolve) {
		const result = nextResolve(specifier, context);
		const search = context.parentURL && new URL(context.parentURL).search;
		if (search && result.url.startsWith(srcURL.href)) { result.url += search; }
		return result;
	},
	load(url, context, nextLoad) {
		const path = url.split('?')[0];
		if (!path.startsWith(srcURL.href)) { return nextLoad(url, context); }
		if (!sources.has(path)) { sources.set(path, readFileSync(new URL(path), 'utf8')); }
		return {format: 'module', source: sources.get(path), shortCircuit: true};
	}
});

let failed = false;

for (const [i, target] of modules.entries()) {
	const load = file => import(`${new URL(file, srcURL)}?run=${i}`);

	// init hooks are kept out of sight in a WeakMap, so catch the calls that add them
	// eslint-disable-next-line no-await-in-loop
	const {Class} = await load('core/Class.js');
	const calls = [];
	for (const name of ['include', 'mergeOptions', 'addInitHook']) {
		const fn = Class[name];
		Class[name] = function (...args) {
			calls.push([this, `${this.name}.${name}()`]);
			return fn.apply(this, args);
		};
	}

	let exports;
	try {
		// eslint-disable-next-line no-await-in-loop
		exports = await load(target);
	} catch (err) {
		failed = true;
		console.error(`${target} can't be imported on its own: ${err.message}`);
		continue;
	}
	const before = snapshot(exports);
	calls.length = 0;

	// the entry point first, so that the cycles in the graph are entered the way users enter them
	// eslint-disable-next-line no-await-in-loop
	await load('Leaflet.js');
	// eslint-disable-next-line no-await-in-loop
	await Promise.all(modules.map(load));

	const ownExports = new Set(Object.values(exports));
	const changes = calls.filter(([cls]) => ownExports.has(cls)).map(([, call]) => call);
	for (const [key, value] of snapshot(exports)) {
		if (!before.has(key) || before.get(key) !== value) { changes.push(key); }
	}
	if (changes.length) {
		failed = true;
		console.error(`${target} is patched at import: ${changes.join(', ')}`);
	}
}

if (failed) { process.exit(1); }
console.log(`No import-time patches in ${modules.length} modules.`);

// maps "Export.prop", "Export.prototype.prop" and "Export.defaultOptions.prop" to their current values
function snapshot(exports) {
	const props = new Map();
	const add = (prefix, obj) => {
		for (const key of Reflect.ownKeys(obj)) {
			const {value, get} = Object.getOwnPropertyDescriptor(obj, key);
			props.set(`${prefix}.${String(key)}`, value ?? get);
		}
	};
	for (const [name, value] of Object.entries(exports)) {
		if (typeof value !== 'function' && (typeof value !== 'object' || value === null)) { continue; }
		add(name, value);
		if (typeof value === 'function' && value.prototype) { add(`${name}.prototype`, value.prototype); }
		if (Object.hasOwn(value, 'defaultOptions')) { add(`${name}.defaultOptions`, value.defaultOptions); }
	}
	return props;
}
