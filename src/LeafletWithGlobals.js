import * as L from './Leaflet';
export * from './Leaflet';

var globalL = L.extend(L, {noConflict: noConflict});
export default globalL;

var globalObject = getGlobalObject();
var oldL = globalObject.L;

globalObject.L = globalL;

export function noConflict() {
	globalObject.L = oldL;
	return globalL;
}

function getGlobalObject() {
	if (typeof globalThis !== 'undefined') { return globalThis; }
	if (typeof self !== 'undefined') { return self; }
	if (typeof window !== 'undefined') { return window; }
	if (typeof global !== 'undefined') { return global; }

	throw new Error('Unable to locate global object.');
}
