(function() {
	var ua = navigator.userAgent.toLowerCase(),
		ie = !!window.ActiveXObject,
		webkit = ua.indexOf("webkit") != -1,
		mobile = typeof orientation != 'undefined' ? true : false,
		android = ua.indexOf("android") != -1,
		opera = window.opera;
	
	L.Browser = {
		ie: ie,
		ie6: ie && !window.XMLHttpRequest,
		
		webkit: webkit,
		webkit3d: webkit && ('WebKitCSSMatrix' in window) && ('m11' in new WebKitCSSMatrix()),
		
		gecko: ua.indexOf("gecko") != -1,
		
		opera: opera,
		
		android: android,
		mobileWebkit: mobile && webkit,
		mobileOpera: mobile && opera,
		
		mobile: mobile,
		touch: ('ontouchstart' in document.documentElement)
	};
})();