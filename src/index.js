
// Cannot directly import version from package.json, because standard module loaders
// do not understand JSON.
// We could use a similar workaround as d3, which builds a dedicated module out of package.json using json2module
// https://www.npmjs.com/package/json2module
//import {version} from '../package.json';
//export {version};

// control
export * from './control/index';

// core
export * from './core/index';

// dom
export * from './dom/index';

// geometry
export * from './geometry/index';

// geo
export * from './geo/index';

// layer
export * from './layer/index';

// map
export * from './map/index';

// misc

// Module loaders do not need no conflict mode.
// This is managed by the application developer when importing the module, if necessary.
/*var oldL = window.L;
export function noConflict() {
	window.L = oldL;
	return this;
}*/

// Ideally no longer needed.
// The application developer directly uses the imported classes and namespaces.
// Nevertheless there is an issue for legacy plugins which expect L to be globally available.
// It may be possible to provide a very simple patch to be imported when necessary.
// Always export us to window global (see #2364)
//window.L = exports;
