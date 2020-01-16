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

var style = document.documentElement.style;

// @property ie: Boolean; `true` for all Internet Explorer versions (not Edge).
export var ie = 'ActiveXObject' in window;

// @property ielt9: Boolean; `true` for Internet Explorer versions less than 9.
export var ielt9 = ie && !document.addEventListener;

// @property edge: Boolean; `true` for the Edge web browser.
export var edge = 'msLaunchUri' in navigator && !('documentMode' in document);

// @property webkit: Boolean;
// `true` for webkit-based browsers like Chrome and Safari (including mobile versions).
export var webkit = userAgentContains('webkit');

// @property android: Boolean
// `true` for any browser running on an Android platform.
export var android = userAgentContains('android');

// @property android23: Boolean; `true` for browsers running on Android 2 or Android 3.
export var android23 = userAgentContains('android 2') || userAgentContains('android 3');

/* See https://stackoverflow.com/a/17961266 for details on detecting stock Android */
var webkitVer = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10); // also matches AppleWebKit
// @property androidStock: Boolean; `true` for the Android stock browser (i.e. not Chrome)
export var androidStock = android && userAgentContains('Google') && webkitVer < 537 && !('AudioNode' in window);

// @property opera: Boolean; `true` for the Opera browser
export var opera = !!window.opera;

// @property chrome: Boolean; `true` for the Chrome browser.
export var chrome = userAgentContains('chrome');

// @property gecko: Boolean; `true` for gecko-based browsers like Firefox.
export var gecko = userAgentContains('gecko') && !webkit && !opera && !ie;

// @property safari: Boolean; `true` for the Safari browser.
export var safari = !chrome && userAgentContains('safari');

export var phantom = userAgentContains('phantom');

// @property opera12: Boolean
// `true` for the Opera browser supporting CSS transforms (version 12 or later).
export var opera12 = 'OTransition' in style;

// @property win: Boolean; `true` when the browser is running in a Windows platform
export var win = navigator.platform.indexOf('Win') === 0;

// @property ie3d: Boolean; `true` for all Internet Explorer versions supporting CSS transforms.
export var ie3d = ie && ('transition' in style);

// @property webkit3d: Boolean; `true` for webkit-based browsers supporting CSS transforms.
export var webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !android23;

// @property gecko3d: Boolean; `true` for gecko-based browsers supporting CSS transforms.
export var gecko3d = 'MozPerspective' in style;

// @property any3d: Boolean
// `true` for all browsers supporting CSS transforms.
export var any3d = !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d) && !opera12 && !phantom;

// @property mobile: Boolean; `true` for all browsers running in a mobile device.
export var mobile = typeof orientation !== 'undefined' || userAgentContains('mobile');

// @property mobileWebkit: Boolean; `true` for all webkit-based browsers in a mobile device.
export var mobileWebkit = mobile && webkit;

// @property mobileWebkit3d: Boolean
// `true` for all webkit-based browsers in a mobile device supporting CSS transforms.
export var mobileWebkit3d = mobile && webkit3d;

// @property msPointer: Boolean
// `true` for browsers implementing the Microsoft touch events model (notably IE10).
export var msPointer = !window.PointerEvent && window.MSPointerEvent;

// @property pointer: Boolean
// `true` for all browsers supporting [pointer events](https://msdn.microsoft.com/en-us/library/dn433244%28v=vs.85%29.aspx).
export var pointer = !webkit && !!(window.PointerEvent || msPointer);

// @property touch: Boolean
// `true` for all browsers supporting [touch events](https://developer.mozilla.org/docs/Web/API/Touch_events).
// This does not necessarily mean that the browser is running in a computer with
// a touchscreen, it only means that the browser is capable of understanding
// touch events.
export var touch = !window.L_NO_TOUCH && (pointer || 'ontouchstart' in window ||
		(window.DocumentTouch && document instanceof window.DocumentTouch));

// @property mobileOpera: Boolean; `true` for the Opera browser in a mobile device.
export var mobileOpera = mobile && opera;

// @property mobileGecko: Boolean
// `true` for gecko-based browsers running in a mobile device.
export var mobileGecko = mobile && gecko;

// @property retina: Boolean
// `true` for browsers on a high-resolution "retina" screen or on any screen when browser's display zoom is more than 100%.
export var retina = (window.devicePixelRatio || (window.screen.deviceXDPI / window.screen.logicalXDPI)) > 1;

// @property passiveEvents: Boolean
// `true` for browsers that support passive events.
export var passiveEvents = (function () {
	var supportsPassiveOption = false;
	try {
		var opts = Object.defineProperty({}, 'passive', {
			get: function () {
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
export var canvas = (function () {
	return !!document.createElement('canvas').getContext;
}());

// @property svg: Boolean
// `true` when the browser supports [SVG](https://developer.mozilla.org/docs/Web/SVG).
export var svg = !!(document.createElementNS && svgCreate('svg').createSVGRect);

// @property vml: Boolean
// `true` if the browser supports [VML](https://en.wikipedia.org/wiki/Vector_Markup_Language).
export var vml = !svg && (function () {
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


function userAgentContains(str) {
	return navigator.userAgent.toLowerCase().indexOf(str) >= 0;
}
