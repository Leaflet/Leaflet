(function() {
	var ua = navigator.userAgent.toLowerCase(),
		ie = !!window.ActiveXObject,
		webkit = ua.indexOf("webkit") != -1,
		mobile = ua.indexOf("mobile") != -1,
		android = ua.indexOf("android") != -1;
	
	L.Browser = {
		ie: ie,
		ie6: ie && !window.XMLHttpRequest,
		webkit: webkit,
		webkit3d: webkit && ('WebKitCSSMatrix' in window) && ('m11' in new WebKitCSSMatrix()),
		mobileWebkit: webkit && (mobile || android),
		gecko: ua.indexOf("gecko") != -1,
		android: android
	};
})();