
import * as Util from './core/Util';
import {extend, bind, stamp, setOptions} from './core/Util';

export var version = '1.0.2';
export {Map, map} from './map/Map';
export {Util, extend, bind, stamp, setOptions};

var oldL = window.L;

export function noConflict() {
	window.L = oldL;
	return this;
}
