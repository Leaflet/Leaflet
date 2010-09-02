var originalL = window.L, 
	L = {};

L.noConflict = function() {
	window.L = originalL;
	return this;
};