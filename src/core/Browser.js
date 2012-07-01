(function () {
	var ua = navigator.userAgent.toLowerCase(),
		ie = !!window.ActiveXObject,
		ie6 = ie && !window.XMLHttpRequest,
		webkit = ua.indexOf("webkit") !== -1,
		gecko = ua.indexOf("gecko") !== -1,
		opera = window.opera,
		android = ua.indexOf("android") !== -1,
		mobile = typeof orientation !== undefined + '' ? true : false,
		doc = document.documentElement,
		ie3d = ie && ('transition' in doc.style),
		webkit3d = webkit && ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()),
		gecko3d = gecko && ('MozPerspective' in doc.style),
		opera3d = opera && ('OTransition' in doc.style);

	var touch = !window.L_NO_TOUCH && (function () {
		var startName = 'ontouchstart';

		// WebKit, etc
		if (startName in doc) {
			return true;
		}

		// Firefox/Gecko
		var div = document.createElement('div'),
			supported = false;

		if (!div.setAttribute) {
			return false;
		}
		div.setAttribute(startName, 'return;');

		if (typeof div[startName] === 'function') {
			supported = true;
		}

		div.removeAttribute(startName);
		div = null;

		return supported;
	}());

	L.Browser = {
		ie: ie,
		ie6: ie6,
		webkit: webkit,
		gecko: gecko,
		opera: opera,
		android: android,

		ie3d: ie3d,
		webkit3d: webkit3d,
		gecko3d: gecko3d,
		opera3d: opera3d,
		any3d: ie3d || webkit3d || gecko3d || opera3d,

		mobile: mobile,
		mobileWebkit: mobile && webkit,
		mobileWebkit3d: mobile && webkit3d,
		mobileOpera: mobile && opera,

		touch: touch
	};
}());
