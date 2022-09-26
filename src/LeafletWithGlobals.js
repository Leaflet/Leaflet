import * as L from './Leaflet';
export * from './Leaflet';

const globalL = L.extend(L, {noConflict});
export default globalL;

const globalObject = getGlobalObject();
const oldL = globalObject.L;

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
