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

// @property chrome: Boolean; `true` for the Chrome browser.
const chrome = userAgentContains('chrome');

// @property safari: Boolean; `true` for the Safari browser.
const safari = !chrome && userAgentContains('safari');

// @property mobile: Boolean; `true` for all browsers running in a mobile device.
const mobile = typeof orientation !== 'undefined' || userAgentContains('mobile');

// @property pointer: Boolean
// `true` for all browsers supporting [pointer events](https://msdn.microsoft.com/en-us/library/dn433244%28v=vs.85%29.aspx).
const pointer = typeof window === 'undefined' ? false : !!window.PointerEvent;

// @property touchNative: Boolean
// `true` for all browsers supporting [touch events](https://developer.mozilla.org/docs/Web/API/Touch_events).
// **This does not necessarily mean** that the browser is running in a computer with
// a touchscreen, it only means that the browser is capable of understanding
// touch events.
const touchNative = typeof window === 'undefined' ? false : 'ontouchstart' in window || !!(window.TouchEvent);

// @property touch: Boolean
// `true` for all browsers supporting either [touch](#browser-touch) or [pointer](#browser-pointer) events.
// Note: pointer events will be preferred (if available), and processed for all `touch*` listeners.
const touch = touchNative || pointer;

// @property retina: Boolean
// `true` for browsers on a high-resolution "retina" screen or on any screen when browser's display zoom is more than 100%.
const retina = typeof window === 'undefined' || typeof window.devicePixelRatio === 'undefined' ? false : window.devicePixelRatio > 1;

// @property mac: Boolean; `true` when the browser is running in a Mac platform
const mac = typeof navigator === 'undefined' || typeof navigator.platform === 'undefined' ? false : navigator.platform.startsWith('Mac');

// @property mac: Boolean; `true` when the browser is running in a Linux platform
const linux = typeof navigator === 'undefined' || typeof navigator.platform === 'undefined' ? false : navigator.platform.startsWith('Linux');

function userAgentContains(str) {
	if (typeof navigator === 'undefined' || typeof navigator.userAgent === 'undefined') {
		return false;
	}
	return navigator.userAgent.toLowerCase().includes(str);
}

export default {
	chrome,
	safari,
	mobile,
	pointer,
	touch,
	touchNative,
	retina,
	mac,
	linux
};
