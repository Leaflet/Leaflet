import * as Util from './Util';
import {svgCreate} from '../layer/vector/SVG.Util';

/*
 * @namespace Browser
 * @aka L.Browser
 *
 * A namespace with static properties for browser/feature detection used by Leaflet internally.
 *
 * @example
 *
 * ```js
 * if (L.Browser.chrome) {
 *   alert('You are running Chrome!');
 * }
 * ```
 */

var style = document.documentElement.style;

// @property webkit: Boolean;
// `true` for webkit-based browsers like Chrome and Safari (including mobile versions).
var webkit = userAgentContains('webkit');

// @property opera: Boolean; `true` for the Opera browser
var opera = !!window.opera;

// @property chrome: Boolean; `true` for the Chrome browser.
var chrome = userAgentContains('chrome');

// @property gecko: Boolean; `true` for gecko-based browsers like Firefox.
var gecko = userAgentContains('gecko') && !webkit && !opera;

// @property safari: Boolean; `true` for the Safari browser.
var safari = !chrome && userAgentContains('safari');

var phantom = userAgentContains('phantom');

// @property opera12: Boolean
// `true` for the Opera browser supporting CSS transforms (version 12 or later).
var opera12 = 'OTransition' in style;

// @property win: Boolean; `true` when the browser is running in a Windows platform
var win = navigator.platform.indexOf('Win') === 0;

// @property webkit3d: Boolean; `true` for webkit-based browsers supporting CSS transforms.
var webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix());

// @property gecko3d: Boolean; `true` for gecko-based browsers supporting CSS transforms.
var gecko3d = 'MozPerspective' in style;

// @property any3d: Boolean
// `true` for all browsers supporting CSS transforms.
var any3d = !window.L_DISABLE_3D && (webkit3d || gecko3d) && !opera12 && !phantom;

// @property mobile: Boolean; `true` for all browsers running in a mobile device.
var mobile = typeof orientation !== 'undefined' || userAgentContains('mobile');

// @property mobileWebkit: Boolean; `true` for all webkit-based browsers in a mobile device.
var mobileWebkit = mobile && webkit;

// @property mobileWebkit3d: Boolean
// `true` for all webkit-based browsers in a mobile device supporting CSS transforms.
var mobileWebkit3d = mobile && webkit3d;

// @property pointer: Boolean
// `true` for all browsers supporting [pointer events](https://msdn.microsoft.com/en-us/library/dn433244%28v=vs.85%29.aspx).
var pointer = !!window.PointerEvent;

// @property touchNative: Boolean
// `true` for all browsers supporting [touch events](https://developer.mozilla.org/docs/Web/API/Touch_events).
// **This does not necessarily mean** that the browser is running in a computer with
// a touchscreen, it only means that the browser is capable of understanding
// touch events.
var touchNative = 'ontouchstart' in window || !!window.TouchEvent;

// @property touch: Boolean
// `true` for all browsers supporting either [touch](#browser-touch) or [pointer](#browser-pointer) events.
// Note: pointer events will be preferred (if available), and processed for all `touch*` listeners.
var touch = !window.L_NO_TOUCH && (touchNative || pointer);

// @property mobileOpera: Boolean; `true` for the Opera browser in a mobile device.
var mobileOpera = mobile && opera;

// @property mobileGecko: Boolean
// `true` for gecko-based browsers running in a mobile device.
var mobileGecko = mobile && gecko;

// @property retina: Boolean
// `true` for browsers on a high-resolution "retina" screen or on any screen when browser's display zoom is more than 100%.
var retina = (window.devicePixelRatio || (window.screen.deviceXDPI / window.screen.logicalXDPI)) > 1;

// @property passiveEvents: Boolean
// `true` for browsers that support passive events.
var passiveEvents = (function () {
	var supportsPassiveOption = false;
	try {
		var opts = Object.defineProperty({}, 'passive', {
			get() { // eslint-disable-line getter-return
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
var canvas = (function () {
	return !!document.createElement('canvas').getContext;
}());

// @property svg: Boolean
// `true` when the browser supports [SVG](https://developer.mozilla.org/docs/Web/SVG).
var svg = !!(document.createElementNS && svgCreate('svg').createSVGRect);

var inlineSvg = !!svg && (function () {
	var div = document.createElement('div');
	div.innerHTML = '<svg/>';
	return (div.firstChild && div.firstChild.namespaceURI) === 'http://www.w3.org/2000/svg';
})();

// @property mac: Boolean; `true` when the browser is running in a Mac platform
var mac = navigator.platform.indexOf('Mac') === 0;

// @property mac: Boolean; `true` when the browser is running in a Linux platform
var linux = navigator.platform.indexOf('Linux') === 0;

function userAgentContains(str) {
	return navigator.userAgent.toLowerCase().indexOf(str) >= 0;
}


export default {
	webkit,
	opera,
	chrome,
	gecko,
	safari,
	phantom,
	opera12,
	win,
	webkit3d,
	gecko3d,
	any3d,
	mobile,
	mobileWebkit,
	mobileWebkit3d,
	pointer,
	touch,
	touchNative,
	mobileOpera,
	mobileGecko,
	retina,
	passiveEvents,
	canvas,
	svg,
	inlineSvg,
	mac,
	linux
};
