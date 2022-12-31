import * as Util from './Util';

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

// @property webkit: Boolean;
// `true` for webkit-based browsers like Chrome and Safari (including mobile versions).
const webkit = userAgentContains('webkit');

// @property chrome: Boolean; `true` for the Chrome browser.
const chrome = userAgentContains('chrome');

// @property gecko: Boolean; `true` for gecko-based browsers like Firefox.
const gecko = userAgentContains('gecko') && !webkit;

// @property safari: Boolean; `true` for the Safari browser.
const safari = !chrome && userAgentContains('safari');

// @property mobile: Boolean; `true` for all browsers running in a mobile device.
const mobile = typeof orientation !== 'undefined' || userAgentContains('mobile');

// @property mobileWebkit: Boolean; `true` for all webkit-based browsers in a mobile device.
const mobileWebkit = mobile && webkit;

// @property pointer: Boolean
// `true` for all browsers supporting [pointer events](https://msdn.microsoft.com/en-us/library/dn433244%28v=vs.85%29.aspx).
const pointer = !!window.PointerEvent;

// @property touchNative: Boolean
// `true` for all browsers supporting [touch events](https://developer.mozilla.org/docs/Web/API/Touch_events).
// **This does not necessarily mean** that the browser is running in a computer with
// a touchscreen, it only means that the browser is capable of understanding
// touch events.
const touchNative = 'ontouchstart' in window || !!window.TouchEvent;

// @property touch: Boolean
// `true` for all browsers supporting either [touch](#browser-touch) or [pointer](#browser-pointer) events.
// Note: pointer events will be preferred (if available), and processed for all `touch*` listeners.
const touch = touchNative || pointer;

// @property mobileGecko: Boolean
// `true` for gecko-based browsers running in a mobile device.
const mobileGecko = mobile && gecko;

// @property retina: Boolean
// `true` for browsers on a high-resolution "retina" screen or on any screen when browser's display zoom is more than 100%.
const retina = (window.devicePixelRatio || (window.screen.deviceXDPI / window.screen.logicalXDPI)) > 1;

// @property passiveEvents: Boolean
// `true` for browsers that support passive events.
const passiveEvents = (function () {
	let supportsPassiveOption = false;
	try {
		const opts = Object.defineProperty({}, 'passive', {
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

// @property mac: Boolean; `true` when the browser is running in a Mac platform
const mac = navigator.platform.startsWith('Mac');

// @property mac: Boolean; `true` when the browser is running in a Linux platform
const linux = navigator.platform.startsWith('Linux');

function userAgentContains(str) {
	return navigator.userAgent.toLowerCase().includes(str);
}


export default {
	webkit,
	chrome,
	gecko,
	safari,
	mobile,
	mobileWebkit,
	pointer,
	touch,
	touchNative,
	mobileGecko,
	retina,
	passiveEvents,
	mac,
	linux
};
