
import {version} from '../package.json';
export {version};

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

var oldL = window.L;
export function noConflict() {
	window.L = oldL;
	return this;
}

// Always export us to window global (see #2364)
window.L = exports;

import {freeze} from './core/Util';
Object.freeze = freeze;
