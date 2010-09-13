(function() {
	var ua = navigator.userAgent.toLowerCase();
	
	L.Browser = {
		ie: !!window.ActiveXObject,
		ie6: !!window.ActiveXObject && !window.XMLHttpRequest,
		webkit: ua.indexOf("webkit") != -1
	};
})();