import {DefaultIcon} from 'leaflet';

// Load leaflet.css as a real <link> (not a Vite-injected <style>) so the
// DefaultIcon path autodetection can find it via document.querySelector.
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = '/dist/leaflet.css';
const cssLoaded = new Promise((resolve, reject) => {
	link.addEventListener('load', resolve);
	link.addEventListener('error', () => reject(new Error('Failed to load /dist/leaflet.css')));
});
document.head.appendChild(link);
await cssLoaded;

DefaultIcon.imagePath = '/dist/images/';

// Shim Mocha-style `done` callback on top of Vitest's promise-based runner.
// Wraps any `it(name, (done) => { ... })` into a promise so existing specs
// don't need to be rewritten.
function wrapDone(fn) {
	if (typeof fn !== 'function' || fn.length === 0) { return fn; }
	return function () {
		return new Promise((resolve, reject) => {
			const done = err => (err ? reject(err) : resolve());
			try {
				fn.call(this, done);
			} catch (e) {
				reject(e);
			}
		});
	};
}

function patch(target, key) {
	const orig = target[key];
	if (typeof orig !== 'function') { return; }
	const wrapped = function (name, fn, ...rest) {
		return orig.call(this, name, wrapDone(fn), ...rest);
	};
	for (const k of Object.getOwnPropertyNames(orig)) {
		if (k === 'length' || k === 'name' || k === 'prototype') { continue; }
		try { wrapped[k] = orig[k]; } catch { /* skip */ }
	}
	target[key] = wrapped;
}

patch(globalThis, 'it');
patch(globalThis, 'test');
if (globalThis.it) {
	patch(globalThis.it, 'only');
	patch(globalThis.it, 'skip');
}
