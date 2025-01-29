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
 * if (L.Browser.ielt9) {
 *   alert('Upgrade your browser, dude!');
 * }
 * ```
 */

var style = typeof document === 'undefined' ? undefined : document.documentElement.style;

// @property ie: Boolean; `true` for all Internet Explorer versions (not Edge).
var ie = typeof window === 'undefined' ? false : 'ActiveXObject' in window;

// @property ielt9: Boolean; `true` for Internet Explorer versions less than 9.
var ielt9 = typeof document === 'undefined' ? false : ie && !document.addEventListener;

// @property edge: Boolean; `true` for the Edge web browser.
var edge = typeof navigator === 'undefined' ? false : 'msLaunchUri' in navigator && !('documentMode' in document);

// @property webkit: Boolean;
// `true` for webkit-based browsers like Chrome and Safari (including mobile versions).
var webkit = userAgentContains('webkit');

// @property android: Boolean
// **Deprecated.** `true` for any browser running on an Android platform.
var android = userAgentContains('android');

// @property android23: Boolean; **Deprecated.** `true` for browsers running on Android 2 or Android 3.
var android23 = userAgentContains('android 2') || userAgentContains('android 3');

/* See https://stackoverflow.com/a/17961266 for details on detecting stock Android */
var webkitVer = typeof navigator === 'undefined' ? 0 : parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10); // also matches AppleWebKit
// @property androidStock: Boolean; **Deprecated.** `true` for the Android stock browser (i.e. not Chrome)
var androidStock = typeof window === 'undefined' ? false : android && userAgentContains('Google') && webkitVer < 537 && !('AudioNode' in window);

// @property opera: Boolean; `true` for the Opera browser
var opera = typeof window === 'undefined' ? false : !!window.opera;

// @property chrome: Boolean; `true` for the Chrome browser.
var chrome = !edge && userAgentContains('chrome');

// @property gecko: Boolean; `true` for gecko-based browsers like Firefox.
var gecko = userAgentContains('gecko') && !webkit && !opera && !ie;

// @property safari: Boolean; `true` for the Safari browser.
var safari = !chrome && userAgentContains('safari');

var phantom = userAgentContains('phantom');

// @property opera12: Boolean
// `true` for the Opera browser supporting CSS transforms (version 12 or later).
var opera12 = typeof document === 'undefined' ? false : 'OTransition' in style;

// @property win: Boolean; `true` when the browser is running in a Windows platform
var win = typeof navigator === 'undefined' ? false : navigator.platform.indexOf('Win') === 0;

// @property ie3d: Boolean; `true` for all Internet Explorer versions supporting CSS transforms.
var ie3d = ie && ('transition' in style);

// @property webkit3d: Boolean; `true` for webkit-based browsers supporting CSS transforms.
var webkit3d = typeof window === 'undefined' ? false : ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !android23;

// @property gecko3d: Boolean; `true` for gecko-based browsers supporting CSS transforms.
var gecko3d = typeof document === 'undefined' ? false : 'MozPerspective' in style;

// @property any3d: Boolean
// `true` for all browsers supporting CSS transforms.
var any3d = typeof window === 'undefined' ? false : !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d) && !opera12 && !phantom;

// @property mobile: Boolean; `true` for all browsers running in a mobile device.
var mobile = typeof orientation === 'undefined' ? false : typeof orientation !== 'undefined' || userAgentContains('mobile');

// @property mobileWebkit: Boolean; `true` for all webkit-based browsers in a mobile device.
var mobileWebkit = mobile && webkit;

// @property mobileWebkit3d: Boolean
// `true` for all webkit-based browsers in a mobile device supporting CSS transforms.
var mobileWebkit3d = mobile && webkit3d;

// @property msPointer: Boolean
// `true` for browsers implementing the Microsoft touch events model (notably IE10).
var msPointer = typeof window === 'undefined' ? false : !window.PointerEvent && window.MSPointerEvent;

// @property pointer: Boolean
// `true` for all browsers supporting [pointer events](https://msdn.microsoft.com/en-us/library/dn433244%28v=vs.85%29.aspx).
var pointer = typeof window === 'undefined' ? false : !!(window.PointerEvent || msPointer);

// @property touchNative: Boolean
// `true` for all browsers supporting [touch events](https://developer.mozilla.org/docs/Web/API/Touch_events).
// **This does not necessarily mean** that the browser is running in a computer with
// a touchscreen, it only means that the browser is capable of understanding
// touch events.
var touchNative = typeof window === 'undefined' ? false : 'ontouchstart' in window || !!(window.TouchEvent);

// @property touch: Boolean
// `true` for all browsers supporting either [touch](#browser-touch) or [pointer](#browser-pointer) events.
// Note: pointer events will be preferred (if available), and processed for all `touch*` listeners.
var touch = typeof window === 'undefined' ? false : !window.L_NO_TOUCH && (touchNative || pointer);

// @property mobileOpera: Boolean; `true` for the Opera browser in a mobile device.
var mobileOpera = mobile && opera;

// @property mobileGecko: Boolean
// `true` for gecko-based browsers running in a mobile device.
var mobileGecko = mobile && gecko;

// @property retina: Boolean
// `true` for browsers on a high-resolution "retina" screen or on any screen when browser's display zoom is more than 100%.
var retina = typeof window === 'undefined' || typeof window.devicePixelRatio === 'undefined' ? false : window.devicePixelRatio > 1;

// @property passiveEvents: Boolean
// `true` for browsers that support passive events.
var passiveEvents = (function () {
	var supportsPassiveOption = false;
	try {
		var opts = Object.defineProperty({}, 'passive', {
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
var canvas = (function () {
	return typeof document === 'undefined' ? false : !!document.createElement('canvas').getContext;
}());

// @property svg: Boolean
// `true` when the browser supports [SVG](https://developer.mozilla.org/docs/Web/SVG).
var svg = typeof document === 'undefined' ? false : !!(document.createElementNS && svgCreate('svg').createSVGRect);

var inlineSvg = typeof document === 'undefined' ? false : !!svg && (function () {
	var div = document.createElement('div');
	div.innerHTML = '<svg/>';
	return (div.firstChild && div.firstChild.namespaceURI) === 'http://www.w3.org/2000/svg';
})();

// @property vml: Boolean
// `true` if the browser supports [VML](https://en.wikipedia.org/wiki/Vector_Markup_Language).
var vml = !svg && (function () {
	try {
		var div = document.createElement('div');
		div.innerHTML = '<v:shape adj="1"/>';

		var shape = div.firstChild;
		shape.style.behavior = 'url(#default#VML)';

		return shape && (typeof shape.adj === 'object');

	} catch (e) {
		return false;
	}
}());

// @property mac: Boolean; `true` when the browser is running in a Mac platform
var mac = typeof navigator === 'undefined' || typeof navigator.platform === 'undefined' ? false : navigator.platform.indexOf('Mac') === 0;

// @property mac: Boolean; `true` when the browser is running in a Linux platform
var linux = typeof navigator === 'undefined' || typeof navigator.platform === 'undefined' ? false : navigator.platform.indexOf('Linux') === 0;

function userAgentContains(str) {
	if (typeof navigator === 'undefined' || typeof navigator.userAgent === 'undefined') {
		return false;
	}
	return navigator.userAgent.toLowerCase().indexOf(str) >= 0;
}

export default {
	ie: ie,
	ielt9: ielt9,
	edge: edge,
	webkit: webkit,
	android: android,
	android23: android23,
	androidStock: androidStock,
	opera: opera,
	chrome: chrome,
	gecko: gecko,
	safari: safari,
	phantom: phantom,
	opera12: opera12,
	win: win,
	ie3d: ie3d,
	webkit3d: webkit3d,
	gecko3d: gecko3d,
	any3d: any3d,
	mobile: mobile,
	mobileWebkit: mobileWebkit,
	mobileWebkit3d: mobileWebkit3d,
	msPointer: msPointer,
	pointer: pointer,
	touch: touch,
	touchNative: touchNative,
	mobileOpera: mobileOpera,
	mobileGecko: mobileGecko,
	retina: retina,
	passiveEvents: passiveEvents,
	canvas: canvas,
	svg: svg,
	vml: vml,
	inlineSvg: inlineSvg,
	mac: mac,
	linux: linux
};
