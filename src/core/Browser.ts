import * as Util from './Util';
import {svgCreate} from '../layer/vector/SVG.Util';

// @ts-ignore
import {ReturnType} from 'typescript';
import {Point} from "../geometry";
import {LatLngBounds} from "../geo";
import {Canvas} from "../layer";
// import {Point} from "../geometry";

// https://www.typescriptlang.org/docs/handbook/2/typeof-types.html
// type CanvasReturnType = ReturnType<typeof Canvas>;
// type LatLngReturnType = ReturnType<typeof LatLng>;
// type LatLngBoundsReturnType = ReturnType<typeof LatLngBounds>;
type NumberReturnType = ReturnType<typeof  Point.prototype.clone> | number | ReturnType<typeof Number>| ReturnType<typeof Point>;
// type PointReturnType = ReturnType<typeof Point>;
type StringReturnType = ReturnType<typeof  Point.prototype.toString> | string | ReturnType<typeof String>;
// type _roundReturnType = ReturnType<typeof  Point.prototype._round> | number | ReturnType<typeof Object.Number>;
// type roundReturnType = ReturnType<typeof  Point.prototype.round> | number | ReturnType<typeof Object.Number>;
// type floorReturnType = ReturnType<typeof  Point.prototype.floor> | number | ReturnType<typeof Object.Number>;

// type numberAuxX = ReturnType<typeof Object.Number>;

// type numberAuxY = ReturnType<typeof Object.Number>;

// https://www.typescriptlang.org/docs/handbook/2/typeof-types.html

/*
 * @namespace Browser
 * @aka L.Browser
 *
 * A namespace with static properties for browser/feature detection used by Leaflet internally.
 *
 * @example
 *
 * ```tsc
 * if (L.Browser.ielt9) {
 *   alert('Upgrade your browser, dude!');
 * }
 * ```
 */

const style = document.documentElement.style;

// @property ie: Boolean; `true` for all Internet Explorer versions (not Edge).
export const ie = 'ActiveXObject' in window;

// @property ielt9: Boolean; `true` for Internet Explorer versions less than 9.
export const ielt9 = ie && !document.addEventListener;

// @property edge: Boolean; `true` for the Edge web browser.
export const edge = 'msLaunchUri' in navigator && !('documentMode' in document);

// @property webkit: Boolean;
// `true` for webkit-based browsers like Chrome and Safari (including mobile versions).
export const webkit = userAgentContains('webkit');

// @property android: Boolean
// `true` for any browser running on an Android platform.
export const android = userAgentContains('android');

// @property android23: Boolean; `true` for browsers running on Android 2 or Android 3.
export const android23 = userAgentContains('android 2') || userAgentContains('android 3');

/* See https://stackoverflow.com/a/17961266 for details on detecting stock Android */
const webkitVer = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10); // also matches AppleWebKit
// @property androidStock: Boolean; `true` for the Android stock browser (i.e. not Chrome)
export const androidStock = android && userAgentContains('Google') && webkitVer < 537 && !('AudioNode' in window);

// @property opera: Boolean; `true` for the Opera browser
export const opera = false; // without opera

// @property chrome: Boolean; `true` for the Chrome browser.
export const chrome = !edge && userAgentContains('chrome');

// @property gecko: Boolean; `true` for gecko-based browsers like Firefox.
export const gecko = userAgentContains('gecko') && !webkit && !opera && !ie;

// @property safari: Boolean; `true` for the Safari browser.
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const safari = !chrome && userAgentContains('safari');

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const phantom = userAgentContains('phantom');

// @property opera12: Boolean
// `true` for the Opera browser supporting CSS transforms (version 12 or later).
export const opera12 = 'OTransition' in style;

// @property win: Boolean; `true` when the browser is running in a Windows platform
export const win = navigator.platform.indexOf('Win') === 0;

// @property ie3d: Boolean; `true` for all Internet Explorer versions supporting CSS transforms.
export const ie3d = ie && ('transition' in style);

// @property webkit3d: Boolean; `true` for webkit-based browsers supporting CSS transforms.
export const webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !android23;

// @property gecko3d: Boolean; `true` for gecko-based browsers supporting CSS transforms.
export const gecko3d = 'MozPerspective' in style;

// @property any3d: Boolean
// `true` for all browsers supporting CSS transforms.
export const any3d = (ie3d || webkit3d || gecko3d) && !opera12 && !phantom;

// @property mobile: Boolean; `true` for all browsers running in a mobile device.
export const mobile = typeof userAgentContains('mobile');

// @property mobileWebkit: Boolean; `true` for all webkit-based browsers in a mobile device.
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const mobileWebkit = mobile && webkit;

// @property mobileWebkit3d: Boolean
// `true` for all webkit-based browsers in a mobile device supporting CSS transforms.
export const mobileWebkit3d = mobile && webkit3d;

// @property msPointer: Boolean
// `true` for browsers implementing the Microsoft touch events model (notably IE10).
export const msPointer = !window.PointerEvent && window.MSPointerEvent;

// @property pointer: Boolean
// `true` for all browsers supporting [pointer events](https://msdn.microsoft.com/en-us/library/dn433244%28v=vs.85%29.aspx).
export const pointer = !!(window.PointerEvent || msPointer);

// @property touch: Boolean
// `true` for all browsers supporting [touch events](https://developer.mozilla.org/docs/Web/API/Touch_events).
// This does not necessarily mean that the browser is running in a computer with
// a touchscreen, it only means that the browser is capable of understanding
// touch events.
export const touch = (pointer || 'ontouchstart' in window);

// @property mobileOpera: Boolean; `true` for the Opera browser in a mobile device.
export const mobileOpera = mobile && opera;

// @property mobileGecko: Boolean
// `true` for gecko-based browsers running in a mobile device.
export const mobileGecko = mobile && gecko;

// @property retina: Boolean
// `true` for browsers on a high-resolution "retina" screen or on any screen when browser's display zoom is more than 100%.
export const retina = (window.devicePixelRatio) > 1;

// @property passiveEvents: Boolean
// `true` for browsers that support passive events.
export const passiveEvents = (function ():boolean {
	let supportsPassiveOption = false;
	try {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const opts = Object.defineProperty({}, 'passive', {
			get: function () { // eslint-disable-line getter-return
				supportsPassiveOption = true;
			}
		});
		window.addEventListener('testPassiveEventSupport', Util.falseFn, opts);
		window.removeEventListener('testPassiveEventSupport', Util.falseFn, opts);
	} catch (e) {
		// Errors can safely be ignored since this is only a browser support test.
	}
	return supportsPassiveOption;
}());

// @property canvas: Boolean
// `true` when the browser supports [`<canvas>`](https://developer.mozilla.org/docs/Web/API/Canvas_API).
export const canvas = (function ():boolean {
	return !!document.createElement('canvas').getContext;
}());

// @property svg: Boolean
// `true` when the browser supports [SVG](https://developer.mozilla.org/docs/Web/SVG).
export const svg = !!(document.createElementNS);

// @property vml: Boolean
// `true` if the browser supports [VML](https://en.wikipedia.org/wiki/Vector_Markup_Language).
export const vml = !svg && (function ():boolean| ChildNode {
	try {
		const div = document.createElement('div');
		div.innerHTML = '<v:shape adj="1"/>';

		const shape = div.firstChild;
		// shape.style.behavior = 'url(#default#VML)';

		return shape;

	} catch (e) {
		return false;
	}
}());


function userAgentContains(str:StringReturnType):NumberReturnType {
	return navigator.userAgent.toLowerCase().indexOf(str) >= 0;
}
