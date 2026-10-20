// Checks what the spec suite (which can run on `dist/leaflet.js`) doesn't: that the global build loads without a
// browser, has the same exports as the sources and keeps its namespaces patchable like plain objects (as plugins
// written for it expect), and that the images the CSS and the default icon point to are next to the CSS.

import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import * as src from '../src/Leaflet.js';

const distURL = new URL('../dist/', import.meta.url);

// a bare context without `window`, `document` or `navigator`, so that any unguarded use of them at load time throws
const context = {};
try {
	runInNewContext(readFileSync(new URL('leaflet-global.js', distURL), 'utf8'), context);
} catch (err) {
	throw new Error(`dist/leaflet-global.js fails to load: ${err}`, {cause: err});
}
assert.deepEqual(Object.keys(context.L).sort(), Object.keys(src).sort(), 'dist/leaflet-global.js exports differ from src');

(function checkWritable(ns, srcNs, path) {
	for (const [key, {writable}] of Object.entries(Object.getOwnPropertyDescriptors(ns))) {
		assert.ok(writable, `${path}.${key} can't be overwritten`);
		if (srcNs[key]?.[Symbol.toStringTag] === 'Module') { checkWritable(ns[key], srcNs[key], `${path}.${key}`); }
	}
})(context.L, src, 'L');

const css = readFileSync(new URL('leaflet.css', distURL), 'utf8');
const images = Array.from(css.matchAll(/url\(['"]?([^'")]+)/g), match => match[1]);
images.push(`images/${src.DefaultIcon.defaultOptions.shadowUrl}`);

for (const url of images) {
	assert.ok(existsSync(new URL(url, distURL)), `dist/${url} is missing`);
}

console.log(`dist/leaflet-global.js matches src, and the ${images.length} images are in place.`);
