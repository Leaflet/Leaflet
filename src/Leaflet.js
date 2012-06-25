var L, originalL;

if (typeof exports !== 'undefined') {
	L = exports;
} else {

	originalL = window.L;
	L = {};

	L.noConflict = function () {
		var l = window.L;
		window.L = originalL;
		return l;
	};

	window.L = L;
}

L.version = '0.4';
