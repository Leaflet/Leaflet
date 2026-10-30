// Checks that bundlers can drop any part of Leaflet that isn't used: a bundle that imports every module but uses
// nothing must come out empty, so no module may patch another (e.g. with `include` or `addInitHook`) or run code
// with possible side effects at the top level. Bundles of typical imports must leave out the listed modules, which
// catches a static import that pulls in more than it needs. Also checks that each module can be imported on its own,
// which an import cycle breaks when it reaches a class before it's defined.

import {readdirSync} from 'node:fs';
import {registerHooks} from 'node:module';
import {fileURLToPath} from 'node:url';
import {rolldown} from 'rolldown';

const srcURL = new URL('../src/', import.meta.url);
const srcDir = fileURLToPath(srcURL);
const modules = readdirSync(srcDir, {recursive: true}).filter(file => file.endsWith('.js'));
let failed = false;

// modules (or directories) that must not end up in a bundle of the given imports
const alwaysAbsent = [
	'layer/GeoJSON.js', 'layer/LayerGroup.js', 'layer/FeatureGroup.js', 'layer/tile/WMSTileLayer.js',
	'layer/ImageOverlay.js', 'layer/VideoOverlay.js', 'layer/SVGOverlay.js', 'layer/vector/Canvas.js',
	'control/LayersControl.js', 'control/ScaleControl.js', 'geo/crs/EPSG3395.js', 'geo/crs/EPSG4326.js',
	'geo/crs/SimpleCRS.js'
];
const bundles = {
	'LeafletMap, TileLayer': ['layer/marker/', 'layer/vector/'],
	'LeafletMap, TileLayer, Marker': ['layer/vector/'],
	'LeafletMap, TileLayer, Polygon': [
		'layer/marker/', 'layer/vector/Circle.js', 'layer/vector/CircleMarker.js', 'layer/vector/Rectangle.js'
	],
	'DomUtil, DomEvent, Util, LineUtil, PolyUtil': [
		'core/Class.js', 'core/Events.js', 'control/', 'layer/', 'map/', 'geo/crs/', 'geo/projection/'
	]
};

// every module is treated as having side effects, ignoring the `sideEffects` field in package.json, so only
// what's at the top level of each module decides whether it stays
async function bundle(code) {
	const build = await rolldown({
		input: 'entry',
		treeshake: {moduleSideEffects: () => true},
		onLog(level, log, handler) {
			if (log.code !== 'CIRCULAR_DEPENDENCY' && log.code !== 'EMPTY_BUNDLE') { handler(level, log); }
		},
		plugins: [{
			resolveId: id => (id === 'entry' ? id : null),
			load: id => (id === 'entry' ? code : null)
		}]
	});
	const {output: [{code: output}]} = await build.generate({format: 'es', comments: false});
	// per-module info in the chunk is taken before the last pass of dead code removal, so read the comments that mark
	// where each module's code starts (the only comments left with `comments: false`)
	const included = Array.from(output.matchAll(/^\/\/ .*?src\/(.+)$/gm), m => m[1]);
	return {code: output.replaceAll(/^\/\/ .*$/gm, '').trim(), included};
}

const empty = await bundle(modules.map(file => `import '${srcDir}${file}';`).join('\n'));

if (empty.code) {
	failed = true;
	console.error('Unused modules are kept in bundles because of side effects at import, e.g. a top-level call or ' +
		`a \`new\` in a static field that needs a /* @__PURE__ */ annotation: ${empty.included.join(', ')}\n\n` +
		`${empty.code}\n`);
}

for (const [imports, absent] of Object.entries(bundles)) {
	// eslint-disable-next-line no-await-in-loop
	const {included} = await bundle(`import {${imports}} from '${srcDir}Leaflet.js'; console.log(${imports});`);
	if (!included.length) { throw new Error('No module comments in the bundle; did the Rolldown output format change?'); }
	const unexpected = included.filter(file => [...alwaysAbsent, ...absent].some(prefix => file.startsWith(prefix)));

	if (unexpected.length) {
		failed = true;
		console.error(`A bundle of {${imports}} includes modules it shouldn't: ${unexpected.join(', ')}`);
	}
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
console.log(`All ${modules.length} modules are free of side effects and can be imported on their own, ` +
	`and ${Object.keys(bundles).length} typical bundles leave out what they don't use.`);
