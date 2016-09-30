
export var version = '1.0.1';

import {Evented} from './core/Events';
export {Evented};
export var Mixin = {Events: Evented.prototype};

import * as Util from './core/Util';
export {Util};
export {extend, bind, stamp, setOptions} from './core/Util';

export {Map, createMap as map} from './map/Map';

import {CRS} from './geo/crs/CRS';
import {EPSG3857, EPSG900913} from './geo/crs/CRS.EPSG3857';
CRS.EPSG3857 = EPSG3857;
CRS.EPSG900913 = EPSG900913;
export {CRS};

export {Point, toPoint as point} from './geometry/Point';
export {Bounds, toBounds as bounds} from './geometry/Bounds';

import * as Browser from './core/Browser';
export {Browser};

var oldL = window.L;
export function noConflict() {
	window.L = oldL;
	return this;
}
