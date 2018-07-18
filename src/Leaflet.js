import * as exports from './index';

export * from './index';

var oldL = window.L;
export function noConflict() {
  window.L = oldL;
  return this;
}

// Always export us to window global (see #2364)
window.L = exports;

import {freeze} from './core/Util';
Object.freeze = freeze;

export default exports;