import {chai} from 'vitest';
import {LatLng, Point} from 'leaflet';
import '../src/leaflet.css';

chai.util.addMethod(chai.Assertion.prototype, 'near', function (expected, delta = 1) {
	expected = new Point(expected);

	new chai.Assertion(this._obj.x).to.be.within(expected.x - delta, expected.x + delta);
	new chai.Assertion(this._obj.y).to.be.within(expected.y - delta, expected.y + delta);
});

chai.util.addMethod(chai.Assertion.prototype, 'nearLatLng', function (expected, delta = 1e-4) {
	expected = new LatLng(expected);

	new chai.Assertion(this._obj.lat).to.be.within(expected.lat - delta, expected.lat + delta);
	new chai.Assertion(this._obj.lng).to.be.within(expected.lng - delta, expected.lng + delta);
	new chai.Assertion(this._obj.alt).to.eql(expected.alt);
});

chai.util.addMethod(chai.Assertion.prototype, 'eqlLatLng', function (expected) {
	expected = new LatLng(expected);

	new chai.Assertion(this._obj.lat).to.eql(expected.lat);
	new chai.Assertion(this._obj.lng).to.eql(expected.lng);
	new chai.Assertion(this._obj.alt).to.eql(expected.alt);
});

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
