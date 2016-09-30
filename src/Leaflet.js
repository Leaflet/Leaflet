
export var version = '1.0.1';

import * as Util from './core/Util';
import {extend, bind, stamp, setOptions} from './core/Util';
export {Util, extend, bind, stamp, setOptions};

export {Map, createMap as map} from './map/Map';

import {CRS} from './geo/crs/CRS';
import {EPSG3857, EPSG900913} from './geo/crs/CRS.EPSG3857';
CRS.EPSG3857 = EPSG3857;
CRS.EPSG900913 = EPSG900913;
export {CRS};

export {Point, toPoint as point} from './geometry/Point';
export {Bounds, toBounds as bounds} from './geometry/Bounds';

import * as browser from './core/Browser';
export var Browser = {
	ie: browser.isIE,
	ielt9: browser.isIELT9,
	edge: browser.isEdge,
	webkit: browser.isWebKit,
	android: browser.isAndroid,
	android23: browser.isAndroid23,
	gecko: browser.isGecko,
	safari: browser.isSafari,
	phantom: browser.isPhantom,
	chrome: browser.isChrome,
	opera: browser.isOpera,
	opera12: browser.isOpera12,
	win: browser.isWin,
	ie32: browser.isIE3D,
	webkit3d: browser.isWebKit3D,
	gecko3d: browser.isGecko3D,
	any3d: browser.isAny3D,
	mobile: browser.isMobile,
	mobileWebkit: browser.isMobileWebkit,
	mobileWebkit3d: browser.isMobileWebkit3D,
	msPointer: browser.isMSPointer,
	pointer: browser.isPointer,
	touch: browser.isTouch,
	mobileOpera: browser.isMobileOpera,
	mobileGecko: browser.isMobileGecko,
	retina: browser.isRetina
};

var oldL = window.L;
export function noConflict() {
	window.L = oldL;
	return this;
}
