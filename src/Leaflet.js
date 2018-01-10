
import {version} from '../package.json';
export {version};

// Directly use the "index.js" file for normal ES module
export * from './index';

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
