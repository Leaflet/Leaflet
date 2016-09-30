
export var version = '1.0.1';

import {Evented} from './core/Events';
export {Evented};
export var Mixin = {Events: Evented.prototype};

import * as Util from './core/Util';
export {Util};
export {extend, bind, stamp, setOptions} from './core/Util';

export {Map, createMap as map} from './map/Map';
export {Point, toPoint as point} from './geometry/Point';
export {Bounds, toBounds as bounds} from './geometry/Bounds';

import * as CRS from './geo/crs/CRS';
export {CRS};

import * as Browser from './core/Browser';
export {Browser};

var oldL = window.L;
export function noConflict() {
	window.L = oldL;
	return this;
}
