(function() {
	var ua = navigator.userAgent.toLowerCase(),
		ie = !!window.ActiveXObject,
		webkit = ua.indexOf("webkit") != -1,
		mobile = ua.indexOf("mobi") != -1,
		android = ua.indexOf("android") != -1,
		opera = window.opera;
	
	L.Browser = {
		ie: ie,
		ie6: ie && !window.XMLHttpRequest,
		webkit: webkit,
		webkit3d: webkit && ('WebKitCSSMatrix' in window) && ('m11' in new WebKitCSSMatrix()),
		mobileWebkit: webkit && (mobile || android),
		mobileOpera: mobile && opera,
		gecko: ua.indexOf("gecko") != -1,
		android: android
	};
	
	//TODO replace ugly ua sniffing with feature detection
	
	L.Browser.touch = L.Browser.mobileWebkit || L.Browser.mobileOpera;
})();