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
export var isIE = 'ActiveXObject' in window;

// @property ielt9: Boolean; `true` for Internet Explorer versions less than 9.
export var isIELT9 = isIE && !document.addEventListener;

// @property edge: Boolean; `true` for the Edge web browser.
export var isEdge = 'msLaunchUri' in navigator && !('documentMode' in document);

// @property webkit: Boolean;
// `true` for webkit-based browsers like Chrome and Safari (including mobile versions).
export var isWebKit = userAgentContains('webkit');

// @property android: Boolean
// `true` for any browser running on an Android platform.
export var isAndroid = userAgentContains('android');

// @property android23: Boolean; `true` for browsers running on Android 2 or Android 3.
export var isAndroid23 = userAgentContains('android 2') || userAgentContains('android 3');

// @property gecko: Boolean; `true` for gecko-based browsers like Firefox.
export var isGecko = userAgentContains('gecko') && !isWebKit && !isOpera && !isIE;

// @property safari: Boolean; `true` for the Safari browser.
export var isSafari = !isChrome && userAgentContains('safari');

export var isPhantom = userAgentContains('phantom');

// @property chrome: Boolean; `true` for the Chrome browser.
export var isChrome = userAgentContains('chrome');

// @property opera: Boolean; `true` for the Opera browser
export var isOpera = !!window.opera;

// @property opera12: Boolean
// `true` for the Opera browser supporting CSS transforms (version 12 or later).
export var isOpera12 = 'OTransition' in style;

// @property win: Boolean; `true` when the browser is running in a Windows platform
export var isWin = navigator.platform.indexOf('Win') === 0;

// @property ie3d: Boolean; `true` for all Internet Explorer versions supporting CSS transforms.
export var isIE3D = isIE && ('transition' in style);

// @property webkit3d: Boolean; `true` for webkit-based browsers supporting CSS transforms.
export var isWebKit3D = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !isAndroid23;

// @property gecko3d: Boolean; `true` for gecko-based browsers supporting CSS transforms.
export var isGecko3D = 'MozPerspective' in style;

// @property any3d: Boolean
// `true` for all browsers supporting CSS transforms.
export var isAny3D = !window.L_DISABLE_3D && (isIE3D || isWebKit3D || isGecko3D) && !isOpera12 && !isPhantom;

// @property mobile: Boolean; `true` for all browsers running in a mobile device.
export var isMobile = typeof orientation !== 'undefined' || userAgentContains('mobile');

// @property mobileWebkit: Boolean; `true` for all webkit-based browsers in a mobile device.
export var isMobileWebkit = isMobile && isWebKit;

// @property mobileWebkit3d: Boolean
// `true` for all webkit-based browsers in a mobile device supporting CSS transforms.
export var isMobileWebkit3D = isMobile && isWebKit3D;

// @property msPointer: Boolean
// `true` for browsers implementing the Microsoft touch events model (notably IE10).
export var isMSPointer = !window.PointerEvent && window.MSPointerEvent;

// @property pointer: Boolean
// `true` for all browsers supporting [pointer events](https://msdn.microsoft.com/en-us/library/dn433244%28v=vs.85%29.aspx).
export var isPointer = window.PointerEvent || isMSPointer;

// @property touch: Boolean
// `true` for all browsers supporting [touch events](https://developer.mozilla.org/docs/Web/API/Touch_events).
export var isTouch = !window.L_NO_TOUCH && (isPointer || 'ontouchstart' in window ||
		(window.DocumentTouch && document instanceof window.DocumentTouch));

// @property mobileOpera: Boolean; `true` for the Opera browser in a mobile device.
export var isMobileOpera = isMobile && isOpera;

// @property mobileGecko: Boolean
// `true` for gecko-based browsers running in a mobile device.
export var isMobileGecko = isMobile && isGecko;

// @property retina: Boolean
// `true` for browsers on a high-resolution "retina" screen.
export var isRetina = (window.devicePixelRatio || (window.screen.deviceXDPI / window.screen.logicalXDPI)) > 1;

function userAgentContains(str) {
	return navigator.userAgent.toLowerCase().indexOf(str) >= 0;
}
