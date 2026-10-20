// Entry of the global build (`L`). Namespaces like `L.DomUtil` are copied into plain objects, since a bundled module
// namespace has getter-only properties, and plugins written for the global build expect to patch its functions.
import * as L from '../src/Leaflet.js';

const isNamespace = value => value?.[Symbol.toStringTag] === 'Module';

function toPlain(ns) {
	return Object.fromEntries(Object.entries(ns).map(([key, value]) => [key, isNamespace(value) ? toPlain(value) : value]));
}

export default toPlain(L);
