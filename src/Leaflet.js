var L, originalL;

if (typeof exports !== 'undefined') {
	L = exports;
} else {
	L = {};
	
	originalL = window.L;

	L.noConflict = function () {
		window.L = originalL;
		return L;
	};

	window.L = L;
}

L.version = '0.4';
