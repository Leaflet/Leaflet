import * as L from './Leaflet.js';
export * from './Leaflet.js';

const global = getGlobalObject();
const oldL = global.L;
const newL = Object.assign({}, L);

newL.noConflict = function () {
	global.L = oldL;
	return this;
};

global.L = newL;

function getGlobalObject() {
	if (typeof globalThis !== 'undefined') { return globalThis; }
	if (typeof self !== 'undefined') { return self; }
	if (typeof window !== 'undefined') { return window; }
	if (typeof global !== 'undefined') { return global; }

	throw new Error('Unable to locate global object.');
}
