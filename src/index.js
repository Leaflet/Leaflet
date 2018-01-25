
// Cannot directly import version from package.json, because other module loaders may not understand JSON.
// Using version2module custom script, adapted from d3's json2module, because the latter exports everything from
// package.json file, which is not Tree Shakable by webpack when exports are in the same file.
// import {version} from '../package.json';
export {default as version} from './version';

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
/* var oldL = window.L;
export function noConflict() {
	window.L = oldL;
	return this;
} */

// Ideally no longer needed.
// The application developer directly uses the imported classes and namespaces.
// Nevertheless there is an issue for legacy plugins which expect L to be globally available.
// It may be possible to provide a very simple patch to be imported when necessary.
// Always export us to window global (see #2364)
// window.L = exports;
